const CACHE_NAME = "dream-music-v3";

// เฉพาะ "โครงเว็บ" (app shell) เท่านั้น — ไม่ cache ไฟล์เพลง (mp3)
// เพราะไฟล์เสียงใหญ่และไม่จำเป็นต้อง cache ล่วงหน้า
const FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./android-chrome-192x192.png",
  "./android-chrome-512x512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
