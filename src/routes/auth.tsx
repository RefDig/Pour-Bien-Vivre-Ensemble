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
    // Aligner la redirection sur la nouvelle route de connexion
    return c.redirect('/admin/realisations/login')
  }
  
  await next()
}

// Page de connexion
// Redirections propres pour compatibilité backward: /auth/* -> nouvelle page
app.get('/login', (c) => c.redirect('/admin/realisations/login'))
app.post('/login', async (c) => c.redirect('/admin/realisations/login'))
app.post('/logout', (c) => {
  deleteCookie(c, 'admin_session')
  return c.redirect('/admin/realisations/login')
})

export default app