import { Hono } from 'hono'
import { Layout } from '../components/Layout'

const app = new Hono()

app.get('/', (c) => {
  return c.render(
    <Layout activeMenu="">
      <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">.
        <img
          src="/static/logo-pbve-authentique.png"
          alt="Logo PBVE"
          class="w-32 h-32 md:w-40 md:h-40 mb-8 rounded-full shadow-lg border-4 border-white mx-auto"
        />
        <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
          <h2 class="text-2xl font-bold text-center mb-6">Connexion Administrateur</h2>
          <form method="POST" action="/auth/login" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                <i class="fas fa-envelope mr-2 text-gray-400"></i>
                Adresse email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="admin@pourbienvivreensemble.fr"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                <i class="fas fa-lock mr-2 text-gray-400"></i>
                Mot de passe
              </label>
              <input
                type="password"
                name="password"
                id="password"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              class="w-full pbve-gradient-bg text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
            >
              <i class="fas fa-sign-in-alt mr-2"></i>
              Se connecter
            </button>
          </form>

          <div class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 class="text-sm font-semibold text-green-800 mb-3">
              <i class="fas fa-rocket mr-1"></i>
              Accès direct aux fonctionnalités :
            </h3>
            <div class="space-y-2">
              <a href="/admin/galerie-fonctionnelle" class="block w-full bg-green-600 text-white py-2 px-4 rounded-lg text-center font-medium hover:bg-green-700 transition-colors text-sm">
                <i class="fas fa-images mr-2"></i>
                Gestion de la Galerie
              </a>
              <a href="/galerie" class="block w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-center font-medium hover:bg-blue-700 transition-colors text-sm">
                <i class="fas fa-eye mr-2"></i>
                Voir Galerie Publique
              </a>
            </div>
          </div>

          <div class="mt-6 text-center text-xs text-gray-500">
            <i class="fas fa-shield-alt mr-1"></i>
            Accès réservé aux administrateurs PBVE
          </div>
        </div>

        <div class="text-center mt-6 space-y-2">
          <div class="text-gray-800 text-sm">
            <i class="fas fa-question-circle mr-1"></i>
            Problème de connexion ?
          </div>
          <div class="space-x-4">
            <a href="mailto:contact@pourbienvivreensemble.fr" class="text-blue-600 hover:text-blue-800 text-sm underline">
              Contacter le support
            </a>
            <a href="/" class="text-blue-600 hover:text-blue-800 text-sm underline">
              Retour accueil
            </a>
          </div>
        </div>
      </div>
    </Layout>
  )
})

export default app