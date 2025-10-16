// Service Worker pour Pour Bien Vivre Ensemble
const CACHE_NAME = 'pbve-v1';
const urlsToCache = [
  '/',
  '/static/manifest.json'
  // On retire les fichiers qui n'existent peut-être pas
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installation en cours...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Cache ouvert');
        // On essaie de mettre en cache, mais sans bloquer si ça échoue
        return cache.addAll(urlsToCache).catch((err) => {
          console.warn('[Service Worker] Erreur mise en cache:', err);
          return Promise.resolve(); // Continue quand même
        });
      })
      .then(() => {
        console.log('[Service Worker] Installation réussie');
        return self.skipWaiting(); // Active immédiatement
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activation en cours...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      console.log('[Service Worker] Activation réussie');
      return self.clients.claim(); // Prend contrôle immédiatement
    })
  );
});

// Intercept des requêtes réseau (stratégie Network First)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Si la réponse est valide, on la met en cache
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // En cas d'échec réseau, on essaie le cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Fallback pour les pages HTML
          if (event.request.destination === 'document') {
            return caches.match('/');
          }
        });
      })
  );
});

// Gestion des notifications push (pour futures fonctionnalités)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || 'Nouvelle notification PBVE',
      icon: '/static/icon-192.png',
      badge: '/static/icon-72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey || 1
      }
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'PBVE', options)
    );
  }
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});

console.log('[Service Worker] Script chargé');