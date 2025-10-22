// Backend Node.js pour VPS avec MySQL et routes Hono
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { serveStatic } from '@hono/node-server/serve-static'
import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'
import { getCookie, setCookie } from 'hono/cookie'
import dotenv from 'dotenv'

// Charger les variables d'environnement
dotenv.config()

// Configuration MySQL
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'pourbienvivreens_pbve',
  password: process.env.DB_PASSWORD || '1204@1958',
  database: process.env.DB_NAME || 'pourbienvivreens_pbve',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}

// Pool de connexions MySQL
const pool = mysql.createPool(dbConfig)

// Création de l'application Hono principale
const app = new Hono()

// Adapter pour MySQL : remplace c.env.DB par le pool MySQL
app.use('*', async (c, next) => {
  // Injecter un adaptateur DB compatible avec l'ancienne syntaxe D1
  c.env = {
    DB: {
      prepare: (sql) => ({
        bind: (...params) => ({
          first: async () => {
            try {
              const [rows] = await pool.execute(sql, params)
              return rows[0] || null
            } catch (error) {
              console.error('DB Error (first):', error)
              return null
            }
          },
          all: async () => {
            try {
              const [rows] = await pool.execute(sql, params)
              return { results: rows, success: true }
            } catch (error) {
              console.error('DB Error (all):', error)
              return { results: [], success: false }
            }
          },
          run: async () => {
            try {
              const [result] = await pool.execute(sql, params)
              return { success: true, meta: result }
            } catch (error) {
              console.error('DB Error (run):', error)
              return { success: false, error: error.message }
            }
          }
        })
      })
    }
  }
  await next()
})

// Servir les fichiers statiques
app.use('/static/*', serveStatic({ root: './public' }))
app.use('/assets/*', serveStatic({ root: './dist' }))

// Importer et monter les routes de l'application
try {
  // Route de santé
  app.get('/api/health', async (c) => {
    try {
      await pool.execute('SELECT 1')
      return c.json({ status: 'ok', database: 'connected' })
    } catch (error) {
      return c.json({ status: 'error', database: 'disconnected', error: error.message }, 500)
    }
  })

  // Importer dynamiquement les routes
  const adminRealisations = await import('./src/routes/admin-realisations.tsx')
  const galerieCorrigee = await import('./src/routes/admin-galerie-corrigee.tsx')
  const realisations = await import('./src/routes/realisations.tsx')
  const galerie = await import('./src/routes/galerie.tsx')
  
  // Monter les routes
  app.route('/admin/realisations', adminRealisations.default)
  app.route('/admin-galerie-corrigee', galerieCorrigee.default)
  app.route('/realisations', realisations.default)
  app.route('/galerie', galerie.default)

  // Route par défaut : page d'accueil
  app.get('/', (c) => {
    return c.html(`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pour Bien Vivre Ensemble</title>
  <link href="/static/pbve-colors.css" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50">
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-purple-600 mb-4">Pour Bien Vivre Ensemble</h1>
      <p class="text-gray-700 mb-8">Bienvenue sur le site PBVE</p>
      <div class="space-x-4">
        <a href="/realisations" class="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700">
          <i class="fas fa-star mr-2"></i>Réalisations
        </a>
        <a href="/galerie" class="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700">
          <i class="fas fa-images mr-2"></i>Galerie
        </a>
        <a href="/admin/realisations/login" class="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700">
          <i class="fas fa-lock mr-2"></i>Admin
        </a>
      </div>
    </div>
  </div>
</body>
</html>`)
  })

} catch (error) {
  console.error('Erreur lors du chargement des routes:', error)
  
  // Fallback si les routes ne chargent pas
  app.get('*', (c) => {
    return c.html(`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Erreur - PBVE</title>
</head>
<body style="font-family: Arial, sans-serif; padding: 40px; text-align: center;">
  <h1 style="color: #e74c3c;">Erreur de chargement</h1>
  <p>Les routes de l'application n'ont pas pu être chargées.</p>
  <p>Vérifiez que le dossier <code>src/</code> est bien présent sur le serveur.</p>
  <a href="/api/health" style="color: #3498db;">Tester la connexion à la base de données</a>
</body>
</html>`)
  })
}

// Lancement du serveur
const port = process.env.PORT || 3000
console.log(`🚀 Serveur PBVE démarré sur http://localhost:${port}`)
console.log(`📊 Base de données: ${dbConfig.database}@${dbConfig.host}`)
console.log(`🔒 Environnement: ${process.env.NODE_ENV || 'development'}`)

serve({
  fetch: app.fetch,
  port: Number(port)
})
