self.addEventListener('install', (event) => {
    console.log('Service worker installed');
  });

  self.addEventListener('activate', (event) => {
    console.log('Service worker activated');
  });

  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  });