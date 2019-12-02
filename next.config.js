const withCSS = require('@zeit/next-css')
const withOffline = require('next-offline')

module.exports = withCSS(
  withOffline({
    env: {
      GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID
    },
    workboxOpts: {
      swDest: 'static/service-worker.js',
      runtimeCaching: [
        {
          urlPattern: new RegExp('^https://avatars1.githubusercontent.com'),
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
