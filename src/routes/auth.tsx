import { Hono } from 'hono'
import { setCookie, getCookie, deleteCookie } from 'hono/cookie'
import { Layout } from '../components/Layout'

const app = new Hono()

// Configuration des identifiants admin
const ADMIN_EMAIL = 'admin@pourbienvivreensemble.fr'
const ADMIN_PASSWORD = 'admin123' // En production, utiliser un hash sécurisé

// Middleware d'authentification
export const requireAuth = async (c: any, next: any) => {
  const isAuthenticated = getCookie(c, 'admin_session')
  
  if (!isAuthenticated) {
    return c.redirect('/auth/login')
  }
  
  await next()
}

// Page de connexion
app.get('/login', (c) => {
  const error = c.req.query('error')
  
  return c.html(
    <Layout title="Connexion Administrateur - PBVE" currentPath="/auth/login">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <img 
              src="/static/logo-pbve-authentique.png" 
              alt="Logo PBVE" 
              className="mx-auto w-24 h-24 rounded-full shadow-lg border-4 border-white"
            />
            <h1 className="mt-6 text-3xl font-bold text-gray-900">
              Espace Administrateur
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Pour Bien Vivre Ensemble - PBVE
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form method="POST" action="/auth/login" className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-envelope mr-2"></i>
                  Adresse email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="admin@pourbienvivreensemble.fr"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-lock mr-2"></i>
                  Mot de passe
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  <div className="flex">
                    <i className="fas fa-exclamation-triangle mr-2 mt-0.5"></i>
                    <span className="text-sm">Identifiants incorrects. Veuillez réessayer.</span>
                  </div>
                </div>
              )}
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
              >
                <i className="fas fa-sign-in-alt mr-2"></i>
                Se connecter
              </button>
            </form>
            
            <div className="mt-6 text-center text-sm text-gray-500">
              <i className="fas fa-shield-alt mr-1"></i>
              Accès réservé aux administrateurs PBVE
            </div>
          </div>
          
          <div className="text-center">
            <a 
              href="/" 
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              <i className="fas fa-arrow-left mr-1"></i>
              Retour au site
            </a>
          </div>
        </div>
      </div>
    </Layout>
  )
})

// Traitement de la connexion
app.post('/login', async (c) => {
  const body = await c.req.formData()
  const email = body.get('email') as string
  const password = body.get('password') as string
  
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    // Créer une session (en production, utiliser JWT ou session sécurisée)
    setCookie(c, 'admin_session', 'authenticated', {
      httpOnly: true,
      secure: true,
      maxAge: 86400, // 24 heures
      sameSite: 'Lax'
    })
    
    return c.redirect('/admin')
  }
  
  return c.redirect('/auth/login?error=1')
})

// Déconnexion
app.post('/logout', (c) => {
  deleteCookie(c, 'admin_session')
  return c.redirect('/auth/login')
})

export default app