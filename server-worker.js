// Backend Node.js pour VPS - Utilise le worker Vite compilé
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import mysql from 'mysql2/promise'
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

// Créer une nouvelle app Hono pour wrapper le worker
const app = new Hono()

// Servir les fichiers statiques AVANT le worker
app.use('/static/*', serveStatic({ root: './dist' }))
app.use('/assets/*', serveStatic({ root: './dist' }))

// Importer le worker Vite compilé
const workerModule = await import('./dist/_worker.js')
const workerApp = workerModule.default

// Adapter l'environnement pour MySQL et monter le worker
app.all('*', async (c) => {
  const request = c.req.raw
  
  // Créer un adaptateur DB compatible avec D1 pour MySQL
  const mysqlDB = {
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

  // Injecter le DB dans l'environnement
  const customEnv = { DB: mysqlDB }

  return workerApp.fetch(request, customEnv, {})
})

// Lancement du serveur
const port = process.env.PORT || 3000
console.log(`🚀 Serveur PBVE démarré sur http://localhost:${port}`)
console.log(`📊 Base de données: ${dbConfig.database}@${dbConfig.host}`)
console.log(`🔒 Environnement: ${process.env.NODE_ENV || 'development'}`)
console.log(`✨ Worker Vite chargé avec routes complètes`)

serve({
  fetch: app.fetch,
  port: Number(port)
})
