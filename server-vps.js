// Backend Node.js simplifié pour VPS avec MySQL
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

// Création de l'application Hono
const app = new Hono()

// Middleware pour injecter le pool MySQL
app.use('*', async (c, next) => {
  c.set('db', pool)
  await next()
})

// Servir les fichiers statiques
app.use('/static/*', serveStatic({ root: './public' }))
app.use('/assets/*', serveStatic({ root: './dist' }))

// Middleware d'authentification
async function requireAuth(c, next) {
  const sessionId = getCookie(c, 'admin_session')
  if (!sessionId) {
    return c.json({ error: 'Session non trouvée' }, 401)
  }
  
  const db = c.get('db')
  try {
    const [rows] = await db.execute(
      'SELECT * FROM admin WHERE id = ?',
      [1]
    )
    if (rows.length === 0) {
      return c.json({ error: 'Session invalide' }, 401)
    }
    c.set('user', rows[0])
  } catch (error) {
    return c.json({ error: 'Erreur de connexion' }, 500)
  }
  await next()
}

// Route de santé
app.get('/api/health', async (c) => {
  const db = c.get('db')
  try {
    await db.execute('SELECT 1')
    return c.json({ status: 'ok', database: 'connected' })
  } catch (error) {
    return c.json({ status: 'error', database: 'disconnected', error: error.message }, 500)
  }
})

// Route de connexion admin
app.post('/api/admin/login', async (c) => {
  try {
    const { username, password } = await c.req.json()
    
    const db = c.get('db')
    const [rows] = await db.execute(
      'SELECT * FROM admin WHERE username = ?',
      [username]
    )
    
    if (rows.length === 0) {
      return c.json({ error: 'Identifiants incorrects' }, 401)
    }
    
    const admin = rows[0]
    const passwordMatch = await bcrypt.compare(password, admin.password_hash)
    
    if (!passwordMatch) {
      return c.json({ error: 'Identifiants incorrects' }, 401)
    }
    
    const sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    
    setCookie(c, 'admin_session', sessionId, {
      maxAge: 24 * 60 * 60,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      path: '/'
    })
    
    return c.json({ success: true, user: { id: admin.id, username: admin.username } })
  } catch (error) {
    console.error('Erreur de connexion:', error)
    return c.json({ error: 'Erreur serveur' }, 500)
  }
})

// Route de déconnexion
app.post('/api/admin/logout', (c) => {
  setCookie(c, 'admin_session', '', { maxAge: 0 })
  return c.json({ success: true })
})

// Routes pour les réalisations
app.get('/api/realisations', async (c) => {
  const db = c.get('db')
  try {
    const [rows] = await db.execute(
      'SELECT * FROM realisations ORDER BY created_at DESC'
    )
    return c.json(rows)
  } catch (error) {
    console.error('Erreur:', error)
    return c.json({ error: 'Erreur serveur' }, 500)
  }
})

app.post('/api/realisations', requireAuth, async (c) => {
  const data = await c.req.json()
  const db = c.get('db')
  
  try {
    const [result] = await db.execute(
      'INSERT INTO realisations (titre, description, image_url, date_realisation) VALUES (?, ?, ?, ?)',
      [data.titre, data.description, data.image_url, data.date_realisation]
    )
    return c.json({ success: true, id: result.insertId })
  } catch (error) {
    console.error('Erreur:', error)
    return c.json({ error: 'Erreur serveur' }, 500)
  }
})

app.put('/api/realisations/:id', requireAuth, async (c) => {
  const id = c.req.param('id')
  const data = await c.req.json()
  const db = c.get('db')
  
  try {
    await db.execute(
      'UPDATE realisations SET titre=?, description=?, image_url=?, date_realisation=? WHERE id=?',
      [data.titre, data.description, data.image_url, data.date_realisation, id]
    )
    return c.json({ success: true })
  } catch (error) {
    console.error('Erreur:', error)
    return c.json({ error: 'Erreur serveur' }, 500)
  }
})

app.delete('/api/realisations/:id', requireAuth, async (c) => {
  const id = c.req.param('id')
  const db = c.get('db')
  
  try {
    await db.execute('DELETE FROM realisations WHERE id=?', [id])
    return c.json({ success: true })
  } catch (error) {
    console.error('Erreur:', error)
    return c.json({ error: 'Erreur serveur' }, 500)
  }
})

// Routes pour la galerie
app.get('/api/galerie', async (c) => {
  const db = c.get('db')
  try {
    const [rows] = await db.execute(
      'SELECT * FROM galerie ORDER BY created_at DESC'
    )
    return c.json(rows)
  } catch (error) {
    console.error('Erreur:', error)
    return c.json({ error: 'Erreur serveur' }, 500)
  }
})

app.post('/api/galerie', requireAuth, async (c) => {
  const data = await c.req.json()
  const db = c.get('db')
  
  try {
    const [result] = await db.execute(
      'INSERT INTO galerie (titre, image_url, description) VALUES (?, ?, ?)',
      [data.titre, data.image_url, data.description]
    )
    return c.json({ success: true, id: result.insertId })
  } catch (error) {
    console.error('Erreur:', error)
    return c.json({ error: 'Erreur serveur' }, 500)
  }
})

app.delete('/api/galerie/:id', requireAuth, async (c) => {
  const id = c.req.param('id')
  const db = c.get('db')
  
  try {
    await db.execute('DELETE FROM galerie WHERE id=?', [id])
    return c.json({ success: true })
  } catch (error) {
    console.error('Erreur:', error)
    return c.json({ error: 'Erreur serveur' }, 500)
  }
})

// Route par défaut pour le SPA
app.get('*', serveStatic({ path: './dist/index.html' }))

// Lancement du serveur
const port = process.env.PORT || 3000
console.log(`🚀 Serveur PBVE démarré sur http://localhost:${port}`)
console.log(`📊 Base de données: ${dbConfig.database}@${dbConfig.host}`)
console.log(`🔒 Environnement: ${process.env.NODE_ENV || 'development'}`)

serve({
  fetch: app.fetch,
  port: Number(port)
})
