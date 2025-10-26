import server from '../../dist/server/server.js'
import type { Handler } from '@netlify/functions'

/**
 * Netlify Function that wraps the TanStack Start server
 * Routes all requests to the server's fetch handler
 */
export const handler: Handler = async (event, context) => {
  // Create a Web API Request from the Netlify function event
  const request = new Request(new URL(event.rawUrl).href, {
    method: event.httpMethod,
    headers: event.headers as Record<string, string>,
    body:
      event.httpMethod === 'GET' || event.httpMethod === 'HEAD'
        ? undefined
        : event.body,
  })

  // Pass the request to the TanStack Start server
  const response = await server.fetch(request)

  // Convert the Response back to a Netlify function response
  return {
    statusCode: response.status,
    headers: Object.fromEntries(response.headers.entries()),
    body: await response.text(),
    isBase64Encoded: false,
  }
}
