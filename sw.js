const CACHE_NAME =
  "dream-music-v2";

const FILES = [

"./",
  "./index.html",
  "./css/style.css",
  "./js/app.js",
  "./manifest.json",
  "./song.mp3"

];


self.addEventListener(
  "install",
  event => {

    event.waitUntil(

      caches.open(
        CACHE_NAME
      )
      .then(cache => {

        return cache.addAll(
          FILES
        );

      })

    );

  }
);


self.addEventListener(
  "activate",
  event => {

    event.waitUntil(

      caches.keys()
        .then(keys => {

          return Promise.all(

            keys
              .filter(
                key =>
                  key !==
                  CACHE_NAME
              )
              .map(
                key =>
                  caches.delete(
                    key
                  )
              )

          );

        })

    );

  }
);


self.addEventListener(
  "fetch",
  event => {

    event.respondWith(

      caches.match(
        event.request
      )
      .then(cached => {

        return (
          cached ||
          fetch(event.request)
        );

      })

    );

  }
);
