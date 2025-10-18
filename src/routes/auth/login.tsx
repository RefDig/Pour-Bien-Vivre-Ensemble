import { renderer } from '../../renderer'
import { Layout } from '../../components/Layout'

// Cette page doit en fait rediriger ou être identique à /admin/realisations/login
// Si tu veux une vraie page stylée ici, utilise le même code que pour /admin/realisations/login.tsx
export default renderer(() => (
  <Layout activeMenu="">
    <div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 px-4">
      <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <div class="flex justify-center mb-6">
          <div class="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
            <i class="fas fa-user text-white text-3xl"></i>
          </div>
        </div>
        <h2 class="text-2xl font-bold text-center mb-2">Espace Administrateur</h2>
        <p class="text-sm text-gray-500 text-center mb-6">Pour Bien Vivre Ensemble - PBVE</p>
        <form method="POST" action="/admin/realisations/login" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Adresse email</label>
            <input type="email" name="email" id="email" required
              class="w-full px-4 py-2 rounded bg-yellow-100 border border-gray-300 font-medium focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="admin@pourbienvivreensemble.fr"
              defaultValue="admin@pourbienvivreensemble.fr"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input type="password" name="password" id="password" required
              class="w-full px-4 py-2 rounded bg-yellow-100 border border-gray-300 font-medium focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Mot de passe"
            />
          </div>
          <button type="submit"
            class="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded font-semibold hover:opacity-90 transition-all">
            <i class="fas fa-sign-in-alt mr-2"></i> Se connecter
          </button>
        </form>
        <div class="mt-4 text-sm text-gray-700 text-center">
          Accès réservé aux administrateurs PBVE<br />
          <a href="/" class="text-blue-600 hover:text-blue-800 text-sm underline">Retour au site</a>
        </div>
      </div>
    </div>
  </Layout>
))