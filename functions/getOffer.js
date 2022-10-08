addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Fetch and log a request
 * @param {Request} request
 * @returns {Promise<Response>}
 */
async function handleRequest(request) {
  const data = await fetch('https://catfact.ninja/fact')
  const json = await data.json()
  return new Response(JSON.stringify(json), {status: 200})
}