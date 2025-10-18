import { Hono } from 'hono'
import { setCookie, getCookie, deleteCookie } from 'hono/cookie'

// Cette route ne génère pas de page HTML, uniquement des redirections
// donc pas besoin du renderer ici

const app = new Hono()

const ADMIN_EMAIL = 'admin@pourbienvivreensemble.fr'
const ADMIN_PASSWORD = 'admin123' // En production, utiliser un hash sécurisé

export const requireAuth = async (c: any, next: any) => {
  const isAuthenticated = getCookie(c, 'admin_session')
  if (!isAuthenticated) {
    return c.redirect('/admin/realisations/login')
  }
  await next()
}

// Redirections de /auth/login vers la vraie page stylée
app.get('/login', (c) => c.redirect('/admin/realisations/login'))
app.post('/login', async (c) => c.redirect('/admin/realisations/login'))
app.post('/logout', (c) => {
  deleteCookie(c, 'admin_session')
  return c.redirect('/admin/realisations/login')
})

export default app