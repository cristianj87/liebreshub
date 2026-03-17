const CACHE_NAME = 'itcj-hub-v2'; // Cambiamos a v2 para forzar la actualización del caché
const assetsToCache = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Instalar el Service Worker y guardar los archivos base
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(assetsToCache))
      .then(() => self.skipWaiting())
  );
});

// Interceptar las peticiones para el modo Offline
self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  // 1. ESTRATEGIA PARA IMÁGENES (Noticias ITCJ) - "Cache First con actualización"
  // Si lo que estamos descargando es una imagen (del Tec u otra)
  if (requestUrl.hostname === 'cdjuarez.tecnm.mx' || event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        // Devuelve la imagen del caché si existe
        if (cachedResponse) return cachedResponse;
        
        // Si no está en caché, la descarga y guarda una copia
        return fetch(event.request).then(networkResponse => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
  } 
  // 2. ESTRATEGIA PARA LO DEMÁS (HTML, CSS, JS) - "Network First"
  else {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  }
});

// Limpiar versiones antiguas del caché cuando actualizamos la app
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
                  .map(name => caches.delete(name))
      );
    })
  );
});