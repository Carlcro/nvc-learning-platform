import server from '../../dist/server/server.js'

/**
 * Netlify Edge Function that wraps the TanStack Start server
 * Handles SSR rendering with proper streaming support
 */
export default async (req: Request) => {
  try {
    // Pass the request directly to the TanStack Start server
    const response = await server.fetch(req)
    return response
  } catch (error) {
    console.error('Error in server edge function:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
