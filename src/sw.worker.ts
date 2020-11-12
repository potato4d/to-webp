const CACHE_NAME = 'v1'

self.addEventListener('fetch', (event: any) => {
  event.respondWith(
    caches.match(event.request).then((r) => {
      console.log('[Service Worker] Fetching resource: ' + event.request.url)
      return (
        r ||
        fetch(event.request).then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            console.log(
              '[Service Worker] Caching new resource: ' + event.request.url
            )
            cache.put(event.request, response.clone())
            return response
          })
        })
      )
    })
  )
})

self.addEventListener('install', (event: any) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/index.html',
        '/types.js',
        '/wasm',
        '/wasm/vips.worker.js',
        '/wasm/vips.d.ts',
        '/wasm/vips.js',
        '/wasm/vips.wasm',
        '/main.js',
        '/style.css',
        '/sw.worker.js',
      ])
    })
  )
})
