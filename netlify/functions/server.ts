import server from '../../dist/server/server.js'
import type { Handler } from '@netlify/functions'

/**
 * Netlify Function that wraps the TanStack Start server
 * Routes all requests to the server's fetch handler
 */
export const handler: Handler = async (event) => {
  try {
    // Construct the full URL for the request
    const protocol = event.headers['x-forwarded-proto'] || 'https'
    const host = event.headers.host || event.headers['x-forwarded-host'] || 'localhost'
    const path = event.path || '/'
    const querystring = event.rawUrl.split('?')[1] || ''
    const url = `${protocol}://${host}${path}${querystring ? `?${querystring}` : ''}`

    // Create a Web API Request from the Netlify function event
    const request = new Request(url, {
      method: event.httpMethod,
      headers: event.headers as Record<string, string>,
      body:
        event.httpMethod === 'GET' || event.httpMethod === 'HEAD'
          ? undefined
          : event.body,
    })

    // Pass the request to the TanStack Start server
    const response = await server.fetch(request)

    // Read the response body
    const body = await response.text()

    // Convert the Response back to a Netlify function response
    return {
      statusCode: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body,
      isBase64Encoded: false,
    }
  } catch (error) {
    console.error('Server function error:', error)
    return {
      statusCode: 500,
      body: 'Internal Server Error',
      headers: { 'Content-Type': 'text/plain' },
    }
  }
}
