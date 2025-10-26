import server from '../../dist/server/server.js'
import type { Handler } from '@netlify/functions'

/**
 * Netlify Function that wraps the TanStack Start server
 * Routes all requests to the server's fetch handler
 */
export const handler: Handler = async (event) => {
  try {
    // Construct the full URL for the request
    // Use rawUrl which includes the full path and query string
    const protocol = event.headers['x-forwarded-proto'] || 'https'
    const host = event.headers.host || event.headers['x-forwarded-host'] || 'localhost'

    // rawUrl might already be absolute, so check
    let url: string
    if (event.rawUrl.startsWith('http')) {
      url = event.rawUrl
    } else {
      url = `${protocol}://${host}${event.rawUrl}`
    }

    console.log('Incoming request:', {
      method: event.httpMethod,
      url,
      rawUrl: event.rawUrl,
      path: event.path,
    })

    // Create a Web API Request from the Netlify function event
    const request = new Request(url, {
      method: event.httpMethod,
      headers: {
        // Remove host-related headers that might cause issues
        ...Object.fromEntries(
          Object.entries(event.headers).filter(
            ([key]) => !['host', 'x-forwarded-host', 'x-forwarded-proto'].includes(key.toLowerCase())
          )
        ),
        host: new URL(url).host,
      },
      body:
        event.httpMethod === 'GET' || event.httpMethod === 'HEAD'
          ? undefined
          : event.body,
    })

    // Pass the request to the TanStack Start server
    console.log('Calling server.fetch...')
    const response = await server.fetch(request)

    console.log('Got response:', { status: response.status })

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
      body: JSON.stringify({ error: String(error) }),
      headers: { 'Content-Type': 'application/json' },
    }
  }
}
