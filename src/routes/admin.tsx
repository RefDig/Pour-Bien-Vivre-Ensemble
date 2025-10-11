import { Hono } from 'hono'
import { Layout } from '../components/Layout'

interface HonoContext {
  Bindings: {
    DB: D1Database;
  };
}

const admin = new Hono<HonoContext>()

// Middleware d'authentification simple
const requireAuth = async (c: any, next: any) => {
  const cookie = c.req.header('Cookie') || ''
  const isAuthenticated = cookie.includes('admin_session=true')
  
  if (!isAuthenticated) {
    return c.redirect('/auth/login?error=admin_required')
  }
  
  await next()
}

admin.use('*', requireAuth)

// Tableau de bord principal
admin.get('/', async (c) => {
  try {
    // Récupérer les statistiques de base
    const stats = await c.env.DB.prepare(`
      SELECT 
        COUNT(*) as total_achievements,
        COUNT(CASE WHEN is_published = 1 THEN 1 END) as published_achievements,
        COUNT(CASE WHEN is_featured = 1 THEN 1 END) as featured_achievements
      FROM achievements
    `).first()

    return c.html(`
      <!DOCTYPE html>
      <html lang="fr">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Administration PBVE</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
          <link href="/static/pbve-colors.css" rel="stylesheet">
      </head>
      <body class="pbve-page-bg min-h-screen">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div class="mb-8">
                  <h1 class="text-4xl font-bold pbve-gradient-text mb-2">
                      <i class="fas fa-tachometer-alt mr-3"></i>
                      Administration PBVE
                  </h1>
                  <p class="text-gray-600">Tableau de bord - Pour Bien Vivre Ensemble</p>
              </div>

              <!-- Statistiques -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div class="bg-white rounded-xl shadow-lg p-6 text-center">
                      <div class="w-16 h-16 pbve-gradient-bg rounded-full flex items-center justify-center mx-auto mb-4">
                          <i class="fas fa-trophy text-2xl text-white"></i>
                      </div>
                      <h3 class="text-2xl font-bold text-gray-900">${stats?.total_achievements || 0}</h3>
                      <p class="text-gray-600">Réalisations totales</p>
                  </div>

                  <div class="bg-white rounded-xl shadow-lg p-6 text-center">
                      <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <i class="fas fa-eye text-2xl text-white"></i>
                      </div>
                      <h3 class="text-2xl font-bold text-gray-900">${stats?.published_achievements || 0}</h3>
                      <p class="text-gray-600">Publiées</p>
                  </div>

                  <div class="bg-white rounded-xl shadow-lg p-6 text-center">
                      <div class="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <i class="fas fa-star text-2xl text-white"></i>
                      </div>
                      <h3 class="text-2xl font-bold text-gray-900">${stats?.featured_achievements || 0}</h3>
                      <p class="text-gray-600">En vedette</p>
                  </div>
              </div>

              <!-- Actions rapides -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div class="bg-white rounded-xl shadow-lg p-6">
                      <h3 class="text-xl font-bold text-gray-900 mb-4">
                          <i class="fas fa-plus-circle mr-2"></i>
                          Actions Rapides
                      </h3>
                      <div class="space-y-3">
                          <a href="/admin/achievements/create" 
                             class="block w-full pbve-gradient-bg text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity text-center">
                              <i class="fas fa-plus mr-2"></i>
                              Nouvelle Réalisation
                          </a>
                          <a href="/admin/achievements" 
                             class="block w-full bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors text-center">
                              <i class="fas fa-list mr-2"></i>
                              Gérer les Réalisations
                          </a>
                      </div>
                  </div>

                  <div class="bg-white rounded-xl shadow-lg p-6">
                      <h3 class="text-xl font-bold text-gray-900 mb-4">
                          <i class="fas fa-link mr-2"></i>
                          Liens Utiles
                      </h3>
                      <div class="space-y-3">
                          <a href="/realisations" target="_blank"
                             class="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center">
                              <i class="fas fa-external-link-alt mr-2"></i>
                              Voir le Site Public
                          </a>
                          <a href="/" 
                             class="block w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors text-center">
                              <i class="fas fa-home mr-2"></i>
                              Retour à l'Accueil
                          </a>
                      </div>
                  </div>
              </div>

              <!-- Déconnexion -->
              <div class="text-center">
                  <form method="POST" action="/auth/logout" class="inline">
                      <button type="submit" 
                              class="bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                          <i class="fas fa-sign-out-alt mr-2"></i>
                          Se Déconnecter
                      </button>
                  </form>
              </div>
          </div>
      </body>
      </html>
    `)
  } catch (error) {
    console.error('Erreur dans le dashboard admin:', error)
    return c.html(`
      <div class="text-center p-8">
        <h1 class="text-2xl font-bold text-red-600 mb-4">Erreur</h1>
        <p class="text-gray-600">Impossible de charger les statistiques.</p>
        <a href="/auth/login" class="text-blue-600 hover:underline">Retour à la connexion</a>
      </div>
    `)
  }
})

// Gestion des réalisations - page simple de listing
admin.get('/achievements', async (c) => {
  try {
    const achievements = await c.env.DB.prepare(`
      SELECT id, title, category, year, is_published, is_featured, views_count
      FROM achievements 
      ORDER BY created_at DESC
    `).all()

    return c.html(`
      <!DOCTYPE html>
      <html lang="fr">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Gestion des Réalisations - PBVE</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
          <link href="/static/pbve-colors.css" rel="stylesheet">
      </head>
      <body class="pbve-page-bg min-h-screen">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div class="mb-8 flex justify-between items-center">
                  <div>
                      <h1 class="text-4xl font-bold pbve-gradient-text mb-2">
                          <i class="fas fa-trophy mr-3"></i>
                          Gestion des Réalisations
                      </h1>
                      <p class="text-gray-600">Administrer les réalisations PBVE</p>
                  </div>
                  <div class="flex gap-4">
                      <a href="/admin/achievements/create" 
                         class="pbve-gradient-bg text-white py-2 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                          <i class="fas fa-plus mr-2"></i>
                          Nouvelle
                      </a>
                      <a href="/admin" 
                         class="bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors">
                          <i class="fas fa-arrow-left mr-2"></i>
                          Tableau de bord
                      </a>
                  </div>
              </div>

              <div class="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div class="overflow-x-auto">
                      <table class="w-full">
                          <thead class="bg-gray-50">
                              <tr>
                                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Année</th>
                                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vues</th>
                              </tr>
                          </thead>
                          <tbody class="bg-white divide-y divide-gray-200">
                              ${achievements.results.map(achievement => `
                                  <tr class="hover:bg-gray-50">
                                      <td class="px-6 py-4 whitespace-nowrap">
                                          <div class="font-medium text-gray-900">${achievement.title}</div>
                                          ${achievement.is_featured ? '<span class="text-yellow-500"><i class="fas fa-star mr-1"></i>En vedette</span>' : ''}
                                      </td>
                                      <td class="px-6 py-4 whitespace-nowrap">
                                          <span class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                              ${achievement.category}
                                          </span>
                                      </td>
                                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${achievement.year}</td>
                                      <td class="px-6 py-4 whitespace-nowrap">
                                          ${achievement.is_published ? 
                                            '<span class="text-green-600"><i class="fas fa-eye mr-1"></i>Publié</span>' : 
                                            '<span class="text-gray-500"><i class="fas fa-eye-slash mr-1"></i>Brouillon</span>'
                                          }
                                      </td>
                                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${achievement.views_count || 0}</td>
                                  </tr>
                              `).join('')}
                          </tbody>
                      </table>
                  </div>
              </div>
          </div>
      </body>
      </html>
    `)
  } catch (error) {
    console.error('Erreur chargement réalisations:', error)
    return c.html('<div>Erreur de chargement des réalisations</div>')
  }
})

// Formulaire de création d'une réalisation
admin.get('/achievements/create', async (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nouvelle Réalisation - PBVE</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <link href="/static/pbve-colors.css" rel="stylesheet">
    </head>
    <body class="pbve-page-bg min-h-screen">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="text-center mb-8">
                <h1 class="text-4xl font-bold pbve-gradient-text mb-2">
                    ✨ Nouvelle Réalisation PBVE
                </h1>
                <p class="text-gray-600">Ajoutez une nouvelle réalisation à l'association</p>
            </div>

            <div class="bg-white rounded-xl shadow-lg p-8">
                <form method="POST" action="/admin/achievements" class="space-y-6">
                    <div>
                        <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                            Titre de la réalisation *
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            required
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ex: Guide du Bien Vivre Ensemble"
                        />
                    </div>

                    <div>
                        <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                            Description *
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            required
                            rows="4"
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Description détaillée de la réalisation..."
                        ></textarea>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
                                Catégorie *
                            </label>
                            <select
                                id="category"
                                name="category"
                                required
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Choisir une catégorie</option>
                                <option value="texte">📄 Texte</option>
                                <option value="video">🎥 Vidéos</option>
                                <option value="livre_audio">🎧 Livre Audios</option>
                                <option value="podcast">🎙️ Podcast</option>
                                <option value="flipbook">📖 Flipbook</option>
                            </select>
                        </div>

                        <div>
                            <label for="year" class="block text-sm font-medium text-gray-700 mb-2">
                                Année
                            </label>
                            <input
                                type="number"
                                id="year"
                                name="year"
                                min="2020"
                                max="2025"
                                value="2024"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div>
                        <label for="file_url" class="block text-sm font-medium text-gray-700 mb-2">
                            URL du fichier
                        </label>
                        <input
                            type="url"
                            id="file_url"
                            name="file_url"
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://exemple.com/fichier.pdf"
                        />
                    </div>

                    <div class="flex items-center space-x-6">
                        <label class="flex items-center">
                            <input type="checkbox" name="is_published" value="1" class="mr-2" />
                            <span class="text-sm font-medium text-gray-700">Publier immédiatement</span>
                        </label>
                        
                        <label class="flex items-center">
                            <input type="checkbox" name="is_featured" value="1" class="mr-2" />
                            <span class="text-sm font-medium text-gray-700">Mettre en vedette</span>
                        </label>
                    </div>

                    <div class="flex gap-4">
                        <button
                            type="submit"
                            class="flex-1 pbve-gradient-bg text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                        >
                            <i class="fas fa-save mr-2"></i>
                            Créer la réalisation
                        </button>
                        <a
                            href="/admin/achievements"
                            class="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors text-center"
                        >
                            <i class="fas fa-times mr-2"></i>
                            Annuler
                        </a>
                    </div>
                </form>
            </div>
        </div>
    </body>
    </html>
  `)
})

// Traitement création d'une réalisation
admin.post('/achievements', async (c) => {
  try {
    const formData = await c.req.parseBody()
    
    const result = await c.env.DB.prepare(`
      INSERT INTO achievements (title, description, category, year, file_url, is_published, is_featured, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1)
    `).bind(
      formData.title,
      formData.description,
      formData.category,
      formData.year || 2024,
      formData.file_url || null,
      formData.is_published ? 1 : 0,
      formData.is_featured ? 1 : 0
    ).run()

    return c.redirect('/admin/achievements')
  } catch (error) {
    console.error('Erreur création réalisation:', error)
    return c.redirect('/admin/achievements/create')
  }
})

export default admin