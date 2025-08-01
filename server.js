const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = process.env.HOSTNAME || 'localhost'
const port = process.env.PORT || 3000

// Next.js app'ini initialize et
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // URL'yi parse et
      const parsedUrl = parse(req.url, true)
      const { pathname, query } = parsedUrl

      // Static dosyalar için doğru handling
      if (pathname.startsWith('/_next/static/') || pathname.startsWith('/static/')) {
        return handle(req, res, parsedUrl)
      }

      // API routes
      if (pathname.startsWith('/api/')) {
        return handle(req, res, parsedUrl)
      }

      // Ana sayfa ve diğer pages
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
    })
})
