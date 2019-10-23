const withCSS = require('@zeit/next-css')
const withOffline = require('next-offline')

module.exports = withCSS(
  withOffline({
    workboxOpts: {
      swDest: 'static/service-worker.js',
      runtimeCaching: [
        {
          urlPattern: /.*\.(?:png|jpg|jpeg|svg|gif)/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'image-cache',
            cacheableResponse: {
              statuses: [0, 200]
            },
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 // 1 day
            }
          }
        },
        {
          urlPattern: new RegExp('^https://api.github.com'),
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'api-cache',
            cacheableResponse: {
              statuses: [0, 200]
            },
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 // 1 day
            }
          }
        }
      ]
    }
  })
)
