import { Hono } from 'hono'
import { Layout } from '../components/Layout'

interface HonoContext {
  Bindings: {
    DB: D1Database;
  };
}

const auth = new Hono<HonoContext>()

// Page de connexion
auth.get('/login', (c) => {
  const error = c.req.query('error')
  
  return c.html(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Connexion Admin - Pour Bien Vivre Ensemble</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <link href="/static/pbve-colors.css" rel="stylesheet">
    </head>
    <body class="pbve-page-bg min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
            <div class="text-center">
                <div class="mx-auto h-20 w-20 mb-4">
                    <img 
                      src="/static/logo-pbve-authentique.png" 
                      alt="Logo Pour Bien Vivre Ensemble - PBVE" 
                      class="w-20 h-20 rounded-full shadow-lg border-4 border-white"
                    />
                </div>
                <h1 class="text-3xl font-bold pbve-gradient-text mb-2">
                    Espace Administrateur
                </h1>
                <p class="text-gray-600">
                    Connexion sécurisée pour l'administration PBVE
                </p>
            </div>

            ${error ? `
                <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <div class="flex items-center">
                        <i class="fas fa-exclamation-triangle mr-2"></i>
                        ${error === 'invalid_credentials' ? 'Identifiants incorrects.' : 
                          error === 'admin_required' ? 'Accès administrateur requis.' : 
                          'Erreur de connexion.'}
                    </div>
                </div>
            ` : ''}

            <form method="POST" action="/auth/login" class="space-y-6">
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                        Email administrateur
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="marie.cappello@pourbienvivreensemble.com"
                    />
                </div>

                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                        Mot de passe
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        required
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Votre mot de passe"
                    />
                </div>

                <button
                    type="submit"
                    class="w-full pbve-gradient-bg text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center"
                >
                    <i class="fas fa-sign-in-alt mr-2"></i>
                    Se connecter
                </button>
            </form>

            <div class="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
                <div class="text-sm">
                    <strong>Démonstration :</strong><br/>
                    Email : marie.cappello@pourbienvivreensemble.com<br/>
                    Mot de passe : admin123
                </div>
            </div>

            <div class="text-center">
                <a href="/" class="text-blue-600 hover:text-blue-800 font-medium">
                    <i class="fas fa-arrow-left mr-2"></i>
                    Retour au site
                </a>
            </div>
        </div>
    </body>
    </html>
  `)
})

// Traitement de la connexion
auth.post('/login', async (c) => {
  const formData = await c.req.parseBody()
  const email = formData.email as string
  const password = formData.password as string

  // Authentification simple pour la démonstration
  if (email === 'marie.cappello@pourbienvivreensemble.com' && password === 'admin123') {
    // Définir le cookie de session
    c.header('Set-Cookie', 'admin_session=true; Path=/; HttpOnly; Max-Age=86400')
    return c.redirect('/admin')
  }

  return c.redirect('/auth/login?error=invalid_credentials')
})

// Déconnexion
auth.post('/logout', (c) => {
  c.header('Set-Cookie', 'admin_session=; Path=/; HttpOnly; Max-Age=0')
  return c.redirect('/')
})

export default auth