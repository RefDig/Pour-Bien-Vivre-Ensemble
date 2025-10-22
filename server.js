import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import app from './dist/_worker.js'

// Remplacer le serveStatic Cloudflare par celui de Node.js
app.get('/static/*', serveStatic({ root: './dist' }))

// Lancer le serveur sur le port 3000
const port = process.env.PORT || 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
