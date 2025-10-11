import { Hono } from 'hono'
import { Layout } from '../components/Layout'

interface HonoContext {
  Bindings: {
    DB: D1Database;
  };
}

const achievements = new Hono<HonoContext>()

// Page publique des réalisations
achievements.get('/', async (c) => {
  try {
    // Récupérer toutes les réalisations publiées
    const allAchievements = await c.env.DB.prepare(`
      SELECT * FROM achievements 
      WHERE is_published = 1 
      ORDER BY is_featured DESC, year DESC, month DESC, created_at DESC
    `).all()

    // Organiser par catégories
    const categories = {
      'texte': { name: 'Texte', icon: 'fas fa-file-text', achievements: [] },
      'video': { name: 'Vidéos', icon: 'fas fa-video', achievements: [] },
      'livre_audio': { name: 'Livre Audios', icon: 'fas fa-headphones', achievements: [] },
      'podcast': { name: 'Podcast', icon: 'fas fa-podcast', achievements: [] },
      'flipbook': { name: 'Flipbook', icon: 'fas fa-book-open', achievements: [] }
    }

    // Classer les réalisations par catégories
    allAchievements.results.forEach(achievement => {
      if (categories[achievement.category]) {
        categories[achievement.category].achievements.push(achievement)
      }
    })

    // Récupérer la réalisation en vedette
    const featuredAchievement = allAchievements.results.find(a => a.is_featured === 1)

    return c.html(`
      <!DOCTYPE html>
      <html lang="fr">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Nos Réalisations - Pour Bien Vivre Ensemble</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
          <link href="/static/pbve-colors.css" rel="stylesheet">
      </head>
      <body class="pbve-page-bg min-h-screen">
          <!-- Navigation -->
          <nav class="bg-white shadow-lg sticky top-0 z-50">
              <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div class="flex justify-between items-center h-16">
                      <div class="flex items-center space-x-3">
                          <img src="/static/logo-pbve-authentique.png" alt="Logo Pour Bien Vivre Ensemble - PBVE" class="w-12 h-12 rounded-full" />
                          <h1 class="text-lg font-bold pbve-gradient-text">Pour Bien Vivre Ensemble</h1>
                      </div>
                      <div class="flex space-x-6">
                          <a href="/" class="text-gray-600 hover:text-blue-600 font-medium">Accueil</a>
                          <a href="/a-propos" class="text-gray-600 hover:text-blue-600 font-medium">À Propos</a>
                          <a href="/realisations" class="text-blue-600 font-medium">Réalisations</a>
                          <a href="/contact" class="text-gray-600 hover:text-blue-600 font-medium">Contact</a>
                      </div>
                  </div>
              </div>
          </nav>

          <!-- Hero Section -->
          <section class="pbve-gradient-bg text-white py-16">
              <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <h1 class="text-4xl md:text-5xl font-bold mb-6">
                      <i class="fas fa-trophy mr-4"></i>
                      Nos Réalisations
                  </h1>
                  <p class="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                      Découvrez tout ce que nous avons accompli ensemble depuis 2020
                  </p>
              </div>
          </section>

          ${featuredAchievement ? `
          <!-- Réalisation en vedette -->
          <section class="py-16 bg-white">
              <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div class="text-center mb-12">
                      <h2 class="text-3xl font-bold text-gray-900 mb-4">
                          <i class="fas fa-star text-yellow-500 mr-2"></i>
                          Réalisation en Vedette
                      </h2>
                  </div>
                  
                  <div class="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 border-2 border-yellow-200">
                      <div class="grid lg:grid-cols-2 gap-8 items-center">
                          <div>
                              <div class="flex items-center mb-4">
                                  <span class="px-3 py-1 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800 mr-3">
                                      ${featuredAchievement.category}
                                  </span>
                                  <span class="text-gray-600">${featuredAchievement.year}</span>
                              </div>
                              <h3 class="text-3xl font-bold text-gray-900 mb-4">${featuredAchievement.title}</h3>
                              <p class="text-gray-600 mb-6 text-lg leading-relaxed">${featuredAchievement.description}</p>
                              ${featuredAchievement.file_url ? `
                                  <a href="${featuredAchievement.file_url}" target="_blank"
                                     class="inline-flex items-center pbve-gradient-bg text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                                      <i class="fas fa-external-link-alt mr-2"></i>
                                      Consulter
                                  </a>
                              ` : ''}
                          </div>
                          <div class="text-center">
                              <div class="w-32 h-32 pbve-gradient-bg rounded-full flex items-center justify-center mx-auto mb-4">
                                  <i class="fas fa-trophy text-4xl text-white"></i>
                              </div>
                              <div class="text-sm text-gray-600">
                                  <i class="fas fa-eye mr-1"></i>
                                  ${featuredAchievement.views_count || 0} vues
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </section>
          ` : ''}

          <!-- Réalisations par catégories -->
          <section class="py-16 pbve-page-bg">
              <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div class="text-center mb-12">
                      <h2 class="text-3xl font-bold text-gray-900 mb-4">Toutes Nos Réalisations</h2>
                      <p class="text-xl text-gray-600">Classées par catégories depuis 2020</p>
                  </div>

                  <!-- Navigation par onglets -->
                  <div class="border-b border-gray-200 mb-8">
                      <nav class="-mb-px flex justify-center space-x-8">
                          ${Object.entries(categories).map(([key, category], index) => `
                              <button onclick="showCategory('${key}')" 
                                      id="tab-${key}"
                                      class="category-tab py-2 px-4 border-b-2 font-medium text-sm ${index === 0 ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}">
                                  <i class="${category.icon} mr-2"></i>
                                  ${category.name} (${category.achievements.length})
                              </button>
                          `).join('')}
                      </nav>
                  </div>

                  <!-- Contenu des catégories -->
                  <div id="categories-content">
                      ${Object.entries(categories).map(([key, category], index) => `
                          <div id="category-${key}" class="category-content ${index !== 0 ? 'hidden' : ''}">
                              ${category.achievements.length > 0 ? `
                                  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                      ${category.achievements.map(achievement => `
                                          <div class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6">
                                              <div class="flex items-center justify-between mb-4">
                                                  <span class="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                      ${achievement.year}
                                                  </span>
                                                  ${achievement.is_featured ? '<i class="fas fa-star text-yellow-500"></i>' : ''}
                                              </div>
                                              
                                              <h3 class="text-xl font-semibold text-gray-900 mb-3">${achievement.title}</h3>
                                              <p class="text-gray-600 mb-4 text-sm leading-relaxed">${achievement.description.substring(0, 150)}${achievement.description.length > 150 ? '...' : ''}</p>
                                              
                                              <div class="flex items-center justify-between">
                                                  ${achievement.file_url ? `
                                                      <a href="${achievement.file_url}" target="_blank"
                                                         onclick="incrementViews(${achievement.id})"
                                                         class="text-blue-600 hover:text-blue-800 font-medium">
                                                          <i class="fas fa-external-link-alt mr-1"></i>
                                                          Consulter
                                                      </a>
                                                  ` : '<span class="text-gray-400">Pas de lien</span>'}
                                                  
                                                  <span class="text-xs text-gray-500">
                                                      <i class="fas fa-eye mr-1"></i>
                                                      ${achievement.views_count || 0}
                                                  </span>
                                              </div>
                                          </div>
                                      `).join('')}
                                  </div>
                              ` : `
                                  <div class="text-center py-16">
                                      <div class="text-gray-400 mb-4">
                                          <i class="${category.icon} text-6xl"></i>
                                      </div>
                                      <h3 class="text-xl font-semibold text-gray-600 mb-2">Aucune réalisation</h3>
                                      <p class="text-gray-500">Aucune réalisation dans cette catégorie pour le moment.</p>
                                  </div>
                              `}
                          </div>
                      `).join('')}
                  </div>
              </div>
          </section>

          <!-- Call to Action -->
          <section class="py-16 pbve-gradient-bg text-white">
              <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <h2 class="text-3xl font-bold mb-4">Rejoignez-Nous !</h2>
                  <p class="text-xl mb-8 max-w-2xl mx-auto">
                      Participez à nos prochaines réalisations et contribuez à la vie de notre communauté
                  </p>
                  <a href="/contact" 
                     class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center">
                      <i class="fas fa-users mr-2"></i>
                      Nous Rejoindre
                  </a>
              </div>
          </section>

          <script>
              function showCategory(categoryKey) {
                  // Masquer tous les contenus
                  document.querySelectorAll('.category-content').forEach(content => {
                      content.classList.add('hidden');
                  });
                  
                  // Réinitialiser tous les onglets
                  document.querySelectorAll('.category-tab').forEach(tab => {
                      tab.classList.remove('border-blue-500', 'text-blue-600');
                      tab.classList.add('border-transparent', 'text-gray-500');
                  });
                  
                  // Afficher le contenu sélectionné
                  document.getElementById('category-' + categoryKey).classList.remove('hidden');
                  
                  // Activer l'onglet sélectionné
                  const selectedTab = document.getElementById('tab-' + categoryKey);
                  selectedTab.classList.add('border-blue-500', 'text-blue-600');
                  selectedTab.classList.remove('border-transparent', 'text-gray-500');
              }

              function incrementViews(achievementId) {
                  // Cette fonction pourrait envoyer une requête pour incrémenter les vues
                  // Pour l'instant, c'est juste pour l'interface
                  console.log('Vue incrémentée pour la réalisation:', achievementId);
              }
          </script>
      </body>
      </html>
    `)
  } catch (error) {
    console.error('Erreur chargement réalisations:', error)
    return c.html('<div>Erreur de chargement des réalisations</div>')
  }
})

export default achievements