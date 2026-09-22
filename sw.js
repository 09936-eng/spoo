const CACHE_NAME = "dream-music-v1";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/style.css",
  "./js/app.js",
  "./android-chrome-192x192.png",
  "./android-chrome-512x512.png"
];


self.addEventListener("install", event => {

  event.waitUntil(

    caches.open(CACHE_NAME)
      .then(cache => {

        return cache.addAll(
          FILES_TO_CACHE
        );

      })

  );

  self.skipWaiting();

});


self.addEventListener("activate", event => {

  event.waitUntil(

    caches.keys()
      .then(cacheNames => {

        return Promise.all(

          cacheNames
            .filter(
              name =>
                name !== CACHE_NAME
            )
            .map(
              name =>
                caches.delete(name)
            )

        );

      })

  );

  self.clients.claim();

});


self.addEventListener("fetch", event => {

  if (
    event.request.method !== "GET"
  ) {
    return;
  }

  event.respondWith(

    caches.match(event.request)
      .then(cachedResponse => {

        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then(response => {

            if (
              !response ||
              response.status !== 200 ||
              response.type === "opaque"
            ) {
              return response;
            }

            const responseClone =
              response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {

                cache.put(
                  event.request,
                  responseClone
                );

              });

            return response;

          });

      })

  );

});
