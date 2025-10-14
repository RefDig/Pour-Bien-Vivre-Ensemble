import { Hono } from 'hono'
import { getCookie } from 'hono/cookie'
import { requireAuth } from './auth'
import { Layout } from '../components/Layout'

const app = new Hono()

// Layout administrateur
const AdminLayout = ({ children, title = "Administration PBVE", currentPath = "/admin" }) => (
  <Layout title={title} currentPath={currentPath}>
    <div className="min-h-screen bg-gray-50">
      {/* Header Admin */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/static/logo-pbve-authentique.png" 
                alt="Logo PBVE" 
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Administration PBVE</h1>
                <p className="text-sm text-gray-500">Espace administrateur</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                <i className="fas fa-user mr-1"></i>
                admin@pourbienvivreensemble.fr
              </span>
              <form method="POST" action="/auth/logout" className="inline">
                <button 
                  type="submit"
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  <i className="fas fa-sign-out-alt mr-1"></i>
                  Déconnexion
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Admin */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <a 
              href="/admin"
              className={`px-3 py-4 text-sm font-medium border-b-2 ${
                currentPath === '/admin' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-700 hover:text-blue-600 hover:border-blue-300'
              }`}
            >
              <i className="fas fa-tachometer-alt mr-2"></i>
              Dashboard
            </a>
            <a 
              href="/admin/achievements"
              className={`px-3 py-4 text-sm font-medium border-b-2 ${
                currentPath === '/admin/achievements' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-700 hover:text-blue-600 hover:border-blue-300'
              }`}
            >
              <i className="fas fa-star mr-2"></i>
              Réalisations
            </a>
            <a 
              href="/admin/gallery"
              className={`px-3 py-4 text-sm font-medium border-b-2 ${
                currentPath === '/admin/gallery' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-700 hover:text-blue-600 hover:border-blue-300'
              }`}
            >
              <i className="fas fa-images mr-2"></i>
              Galerie
            </a>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  </Layout>
)

// Appliquer le middleware d'authentification à toutes les routes
app.use('*', requireAuth)

// Dashboard principal
app.get('/', (c) => {
  return c.html(
    <AdminLayout title="Dashboard - Administration PBVE" currentPath="/admin">
      <div className="space-y-8">
        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-star text-blue-600"></i>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Réalisations</p>
                <p className="text-2xl font-semibold text-gray-900">5</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-images text-green-600"></i>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Photos</p>
                <p className="text-2xl font-semibold text-gray-900">24</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-eye text-purple-600"></i>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Vues totales</p>
                <p className="text-2xl font-semibold text-gray-900">1,248</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-calendar text-orange-600"></i>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Ce mois</p>
                <p className="text-2xl font-semibold text-gray-900">+12</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Upload d'images */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-cloud-upload-alt text-blue-600 text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Images</h3>
              <p className="text-sm text-gray-500 mb-4">
                Téléversez vos photos pour la galerie
              </p>
              <form enctype="multipart/form-data" method="POST" action="/admin/upload">
                <div className="mb-4">
                  <input 
                    type="file" 
                    name="images" 
                    multiple 
                    accept="image/*"
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                <select name="category" className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option value="">Sélectionner une catégorie</option>
                  <option value="ateliers">Ateliers</option>
                  <option value="sorties">Sorties</option>
                  <option value="fetes">Fêtes</option>
                  <option value="portraits">Portraits</option>
                  <option value="activites">Activités</option>
                  <option value="evenements">Événements</option>
                </select>
                <button 
                  type="submit"
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  Téléverser
                </button>
              </form>
            </div>
          </div>

          {/* Nouvelle réalisation */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-plus text-purple-600 text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestion Réalisations</h3>
              <p className="text-sm text-gray-500 mb-4">
                Gérer les contenus (KV Production)
              </p>
              <div className="space-y-2">
                <a 
                  href="/admin/realisations-production"
                  className="inline-flex items-center bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 w-full justify-center"
                >
                  <i className="fas fa-cloud mr-2"></i>
                  Réalisations Production
                </a>
                <a 
                  href="/admin/achievements"
                  className="inline-flex items-center bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-500 w-full justify-center"
                >
                  <i className="fas fa-plus mr-2"></i>
                  Réalisations (anciennes)
                </a>
              </div>
            </div>
          </div>

          {/* Gestion galerie */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-images text-green-600 text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Organiser Galerie</h3>
              <p className="text-sm text-gray-500 mb-4">
                Gérer les catégories et photos (KV Production)
              </p>
              <div className="space-y-2">
                <a 
                  href="/admin/galerie-production"
                  className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 w-full justify-center"
                >
                  <i className="fas fa-cloud mr-2"></i>
                  Galerie Production
                </a>
                <a 
                  href="/admin/galerie"
                  className="inline-flex items-center bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-500 w-full justify-center"
                >
                  <i className="fas fa-cog mr-2"></i>
                  Galerie (ancienne)
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Activités récentes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              <i className="fas fa-clock mr-2"></i>
              Activités Récentes
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-star text-blue-600 text-xs"></i>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Nouvelle réalisation ajoutée</p>
                  <p className="text-xs text-gray-500">Guide de la Solidarité 2024 - il y a 2 jours</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-images text-green-600 text-xs"></i>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">12 photos téléversées</p>
                  <p className="text-xs text-gray-500">Catégorie "Ateliers" - il y a 1 semaine</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-eye text-purple-600 text-xs"></i>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Pic de consultation</p>
                  <p className="text-xs text-gray-500">+156 vues sur la galerie - il y a 3 jours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
})

// Route d'upload d'images
app.post('/upload', async (c) => {
  try {
    // En production avec Cloudflare Pages, utiliser R2 Storage
    // Pour l'instant, simulation du traitement
    
    return c.html(`
      <div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
        <div class="flex">
          <i class="fas fa-check-circle mr-2 mt-0.5"></i>
          <span class="text-sm">Images téléversées avec succès !</span>
        </div>
      </div>
      <script>
        setTimeout(() => {
          window.location.href = '/admin';
        }, 2000);
      </script>
    `)
  } catch (error) {
    return c.html(`
      <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
        <div class="flex">
          <i class="fas fa-exclamation-triangle mr-2 mt-0.5"></i>
          <span class="text-sm">Erreur lors du téléversement. Veuillez réessayer.</span>
        </div>
      </div>
      <script>
        setTimeout(() => {
          window.location.href = '/admin';
        }, 2000);
      </script>
    `)
  }
})

export default app