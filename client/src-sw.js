const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

precacheAndRoute(self.__WB_MANIFEST);

const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

registerRoute(({ request }) => request.mode === 'navigate', pageCache);

// TODO: Implement asset caching
registerRoute(
  // defining the criteria for the files we'll cache
  ({ request }) => ['style', 'script', 'image'].includes(request.destination),
  // directing the user to try to grab asset from cache first and then network second if none found
  new CacheFirst({
    // defining name of cached assets
    cacheName: 'asset-cache',
    // plugins for caching
    plugins: [
      // only caching successfully loaded assets
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      // defining when cached assets will expire
      new ExpirationPlugin({
        // 10 days
        maxAgeSeconds: 10 * 24 * 60 * 60,
        // only 60 cached assets at once in order to limit storage use
        maxEntries: 60,
      }),
    ],
  })
);
