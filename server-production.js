// Backend Node.js final pour VPS avec MySQL - Version Production
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

// Middleware MySQL
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
    const [rows] = await db.execute('SELECT * FROM admin WHERE id = ?', [1])
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
  try {
    await pool.execute('SELECT 1')
    return c.json({ status: 'ok', database: 'connected' })
  } catch (error) {
    return c.json({ status: 'error', database: 'disconnected' }, 500)
  }
})

// ============= ROUTES ADMIN =============

// Login admin
app.post('/api/admin/login', async (c) => {
  try {
    const { username, password } = await c.req.json()
    const db = c.get('db')
    
    const [rows] = await db.execute('SELECT * FROM admin WHERE username = ?', [username])
    
    if (rows.length === 0) {
      return c.json({ error: 'Identifiants incorrects' }, 401)
    }
    
    const admin = rows[0]
    const passwordMatch = await bcrypt.compare(password, admin.password_hash)
    
    if (!passwordMatch) {
      return c.json({ error: 'Identifiants incorrects' }, 401)
    }
    
    const sessionId = Math.random().toString(36).substring(2)
    setCookie(c, 'admin_session', sessionId, {
      maxAge: 24 * 60 * 60,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      path: '/'
    })
    
    return c.json({ success: true, user: { id: admin.id, username: admin.username } })
  } catch (error) {
    console.error('Erreur login:', error)
    return c.json({ error: 'Erreur serveur' }, 500)
  }
})

// Logout admin
app.post('/api/admin/logout', (c) => {
  setCookie(c, 'admin_session', '', { maxAge: 0 })
  return c.json({ success: true })
})

// ============= ROUTES REALISATIONS =============

app.get('/api/realisations', async (c) => {
  const db = c.get('db')
  try {
    const [rows] = await db.execute('SELECT * FROM realisations ORDER BY created_at DESC')
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

// ============= ROUTES GALERIE =============

app.get('/api/galerie', async (c) => {
  const db = c.get('db')
  try {
    const [rows] = await db.execute('SELECT * FROM galerie ORDER BY created_at DESC')
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

// ============= PAGE D'ACCUEIL =============

app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pour Bien Vivre Ensemble</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen flex items-center justify-center">
  <div class="text-center max-w-4xl mx-auto px-4">
    <div class="mb-8">
      <h1 class="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
        Pour Bien Vivre Ensemble
      </h1>
      <p class="text-2xl text-gray-700 mb-2">Association de solidarité - Lille Sud</p>
      <p class="text-gray-600">Plateforme de gestion des réalisations et galerie</p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
      <a href="/realisations" class="group bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all transform hover:-translate-y-2">
        <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-600 transition-colors">
          <i class="fas fa-star text-3xl text-purple-600 group-hover:text-white transition-colors"></i>
        </div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">Réalisations</h2>
        <p class="text-gray-600">Découvrez nos projets et initiatives</p>
      </a>
      
      <a href="/galerie" class="group bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all transform hover:-translate-y-2">
        <div class="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-pink-600 transition-colors">
          <i class="fas fa-images text-3xl text-pink-600 group-hover:text-white transition-colors"></i>
        </div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">Galerie</h2>
        <p class="text-gray-600">Parcourez nos photos et moments</p>
      </a>
      
      <a href="/admin" class="group bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all transform hover:-translate-y-2">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-600 transition-colors">
          <i class="fas fa-lock text-3xl text-gray-600 group-hover:text-white transition-colors"></i>
        </div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">Administration</h2>
        <p class="text-gray-600">Espace réservé aux administrateurs</p>
      </a>
    </div>
    
    <div class="mt-12 text-sm text-gray-500">
      <p>✨ Serveur Node.js + MySQL sur VPS</p>
      <p class="mt-2">🚀 Déployé avec PM2</p>
    </div>
  </div>
</body>
</html>`)
})

// Page Admin (simple formulaire de connexion)
app.get('/admin', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin - PBVE</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center justify-center px-4">
  <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
    <div class="text-center mb-8">
      <div class="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <i class="fas fa-user-shield text-white text-2xl"></i>
      </div>
      <h1 class="text-2xl font-bold text-gray-900">Administration PBVE</h1>
      <p class="text-gray-600 mt-2">Connexion sécurisée</p>
    </div>
    
    <div id="error" class="hidden bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4"></div>
    
    <form id="loginForm" class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Nom d'utilisateur</label>
        <input type="text" id="username" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
        <input type="password" id="password" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
      </div>
      <button type="submit" class="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors">
        <i class="fas fa-sign-in-alt mr-2"></i>Se connecter
      </button>
    </form>
    
    <div class="mt-6 text-center">
      <a href="/" class="text-sm text-gray-600 hover:text-gray-900">← Retour à l'accueil</a>
    </div>
  </div>
  
  <script>
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault()
      const username = document.getElementById('username').value
      const password = document.getElementById('password').value
      const errorDiv = document.getElementById('error')
      
      try {
        const response = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        })
        
        const data = await response.json()
        
        if (data.success) {
          window.location.href = '/admin/dashboard'
        } else {
          errorDiv.textContent = data.error || 'Identifiants incorrects'
          errorDiv.classList.remove('hidden')
        }
      } catch (error) {
        errorDiv.textContent = 'Erreur de connexion au serveur'
        errorDiv.classList.remove('hidden')
      }
    })
  </script>
</body>
</html>`)
})

// Dashboard admin (après connexion)
app.get('/admin/dashboard', requireAuth, async (c) => {
  const db = c.get('db')
  const [realisations] = await db.execute('SELECT COUNT(*) as count FROM realisations')
  const [galerie] = await db.execute('SELECT COUNT(*) as count FROM galerie')
  
  return c.html(`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard Admin - PBVE</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50 min-h-screen">
  <div class="bg-white shadow-sm border-b">
    <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
      <h1 class="text-xl font-semibold text-gray-900">
        <i class="fas fa-chart-line text-purple-600 mr-2"></i>Dashboard Administration
      </h1>
      <button onclick="logout()" class="text-red-600 hover:text-red-800">
        <i class="fas fa-sign-out-alt mr-1"></i>Déconnexion
      </button>
    </div>
  </div>
  
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-star text-purple-600 text-xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-600">Réalisations</p>
            <p class="text-2xl font-bold text-gray-900">${realisations[0].count}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-images text-pink-600 text-xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-600">Photos Galerie</p>
            <p class="text-2xl font-bold text-gray-900">${galerie[0].count}</p>
          </div>
        </div>
      </div>
    </div>
    
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold mb-4">Actions rapides</h2>
      <div class="space-y-2">
        <p class="text-gray-600">✅ Base de données MySQL connectée</p>
        <p class="text-gray-600">✅ Serveur Node.js actif avec PM2</p>
        <p class="text-gray-600">✅ API disponible sur /api/realisations et /api/galerie</p>
      </div>
    </div>
  </div>
  
  <script>
    async function logout() {
      await fetch('/api/admin/logout', { method: 'POST' })
      window.location.href = '/'
    }
  </script>
</body>
</html>`)
})

// Fallback 404
app.notFound((c) => {
  return c.html(`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 - PBVE</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 min-h-screen flex items-center justify-center">
  <div class="text-center">
    <h1 class="text-6xl font-bold text-gray-300 mb-4">404</h1>
    <p class="text-xl text-gray-600 mb-8">Page non trouvée</p>
    <a href="/" class="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700">Retour à l'accueil</a>
  </div>
</body>
</html>`, 404)
})

// Lancement du serveur
const port = process.env.PORT || 3000
console.log(`🚀 Serveur PBVE démarré sur http://localhost:${port}`)
console.log(`📊 Base de données: ${dbConfig.database}@${dbConfig.host}`)
console.log(`🔒 Environnement: ${process.env.NODE_ENV || 'development'}`)
console.log(`✅ API disponible: /api/health, /api/realisations, /api/galerie`)

serve({
  fetch: app.fetch,
  port: Number(port)
})
