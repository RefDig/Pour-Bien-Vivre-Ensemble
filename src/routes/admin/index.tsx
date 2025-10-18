import { renderer } from '../../renderer'
import { Layout } from '../../components/Layout'

export default renderer(() => (
  <Layout activeMenu="admin">
    {/* Dashboard stylé */}
    <div class="min-h-screen bg-gray-50">
      <header class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-4">
            <div class="flex items-center space-x-3">
              <img src="/static/logo-pbve-authentique.png" alt="Logo PBVE" class="w-10 h-10 rounded-full"/>
              <div>
                <h1 class="text-xl font-bold text-gray-900">Administration PBVE</h1>
                <p class="text-sm text-gray-500">Espace administrateur</p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-600"><i class="fas fa-user mr-1"></i>admin@pourbienvivreensemble.fr</span>
              <form method="POST" action="/auth/logout" class="inline">
                <button type="submit" class="text-red-600 hover:text-red-800 text-sm font-medium">
                  <i class="fas fa-sign-out-alt mr-1"></i>Déconnexion
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>
      {/* ... reste du contenu stylé ... */}
    </div>
  </Layout>
))