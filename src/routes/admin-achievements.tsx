import { Hono } from 'hono'
import { requireAuth } from './auth'

const app = new Hono()

// Données simulées des réalisations (en production, viendraient de la base de données)
const mockAchievements = [
  {
    id: 1,
    titre: "Guide de la Solidarité 2024",
    categorie: "textes",
    url_contenu: "/static/documents/guide-solidarite-2024.pdf",
    en_vedette: true,
    statut: "publie",
    auteur: "Marie Cappello",
    date_creation: "2024-10-01",
    vues: 245
  },
  {
    id: 2,
    titre: "Atelier Cuisine Communautaire",
    categorie: "videos",
    url_contenu: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    en_vedette: false,
    statut: "publie",
    auteur: "Atelier Cuisine PBVE",
    date_creation: "2024-09-15",
    vues: 89
  },
  {
    id: 3,
    titre: "Histoires de Lille Sud",
    categorie: "livres_audio",
    url_contenu: "/static/audio/histoires-lille-sud.mp3",
    en_vedette: false,
    statut: "publie",
    auteur: "Groupe Histoire Locale",
    date_creation: "2024-08-20",
    vues: 156
  },
  {
    id: 4,
    titre: "PBVE Radio - Episode 1",
    categorie: "podcasts",
    url_contenu: "/static/audio/pbve-radio-ep1.mp3",
    en_vedette: false,
    statut: "publie",
    auteur: "Radio PBVE",
    date_creation: "2024-09-01",
    vues: 78
  },
  {
    id: 5,
    titre: "Rapport Activité 2023",
    categorie: "flipbooks",
    url_contenu: "https://online.fliphtml5.com/example1",
    en_vedette: false,
    statut: "publie",
    auteur: "Bureau PBVE",
    date_creation: "2024-01-15",
    vues: 312
  }
]

const categories = [
  { id: 'textes', label: 'Textes', icon: 'fas fa-file-alt', color: 'yellow' },
  { id: 'videos', label: 'Vidéos', icon: 'fas fa-video', color: 'red' },
  { id: 'livres_audio', label: 'Livres Audio', icon: 'fas fa-headphones', color: 'green' },
  { id: 'podcasts', label: 'Podcasts', icon: 'fas fa-podcast', color: 'purple' },
  { id: 'flipbooks', label: 'Flipbooks', icon: 'fas fa-book-open', color: 'orange' }
]

// Layout administrateur spécialisé
const AdminLayout = ({ children, title = "Administration PBVE", currentPath = "/admin" }) => `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="/static/style.css" rel="stylesheet">
</head>
<body class="bg-gray-50 font-sans">
    <div class="min-h-screen">
        <!-- Header Admin -->
        <header class="bg-white shadow-sm border-b">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center py-4">
                    <div class="flex items-center space-x-3">
                        <img src="/static/logo-pbve-authentique.png" alt="Logo PBVE" class="w-10 h-10 rounded-full">
                        <div>
                            <h1 class="text-xl font-bold text-gray-900">Administration PBVE</h1>
                            <p class="text-sm text-gray-500">Espace administrateur</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-4">
                        <span class="text-sm text-gray-600">
                            <i class="fas fa-user mr-1"></i>
                            admin@pourbienvivreensemble.fr
                        </span>
                        <form method="POST" action="/auth/logout" class="inline">
                            <button type="submit" class="text-red-600 hover:text-red-800 text-sm font-medium">
                                <i class="fas fa-sign-out-alt mr-1"></i>
                                Déconnexion
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </header>

        <!-- Navigation Admin -->
        <nav class="bg-white shadow-sm">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex space-x-8">
                    <a href="/admin" class="px-3 py-4 text-sm font-medium border-b-2 ${currentPath === '/admin' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-700 hover:text-blue-600 hover:border-blue-300'}">
                        <i class="fas fa-tachometer-alt mr-2"></i>
                        Dashboard
                    </a>
                    <a href="/admin/achievements" class="px-3 py-4 text-sm font-medium border-b-2 ${currentPath === '/admin/achievements' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-700 hover:text-blue-600 hover:border-blue-300'}">
                        <i class="fas fa-star mr-2"></i>
                        Réalisations
                    </a>
                    <a href="/admin/gallery" class="px-3 py-4 text-sm font-medium border-b-2 ${currentPath === '/admin/gallery' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-700 hover:text-blue-600 hover:border-blue-300'}">
                        <i class="fas fa-images mr-2"></i>
                        Galerie
                    </a>
                </div>
            </div>
        </nav>

        <!-- Contenu principal -->
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            ${children}
        </main>
    </div>

    <script src="/static/app.js"></script>
</body>
</html>
`

// Appliquer le middleware d'authentification
// Note: Global auth middleware removed to avoid protecting the login route and creating redirect loops.
// Apply `requireAuth` explicitly to routes that require authentication.

// Liste des réalisations
app.get('/', (c) => {
  const search = c.req.query('search') || ''
  const categoryFilter = c.req.query('category') || ''
  
  let filteredAchievements = mockAchievements
  
  if (search) {
    filteredAchievements = filteredAchievements.filter(item => 
      item.titre.toLowerCase().includes(search.toLowerCase()) ||
      item.auteur.toLowerCase().includes(search.toLowerCase())
    )
  }
  
  if (categoryFilter) {
    filteredAchievements = filteredAchievements.filter(item => 
      item.categorie === categoryFilter
    )
  }

  const content = `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">
            <i class="fas fa-star mr-3"></i>
            Gestion des Réalisations
          </h1>
          <p class="text-gray-600 mt-1">Gérez les contenus de la section réalisations</p>
        </div>
        <a href="/admin/achievements/new" class="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
          <i class="fas fa-plus mr-2"></i>
          Nouvelle réalisation
        </a>
      </div>

      <!-- Filtres et recherche -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <form method="GET" class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <input 
              type="text" 
              name="search" 
              value="${search}"
              placeholder="Rechercher par titre ou auteur..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          <div>
            <select name="category" class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Toutes les catégories</option>
              ${categories.map(cat => `
                <option value="${cat.id}" ${categoryFilter === cat.id ? 'selected' : ''}>
                  ${cat.label}
                </option>
              `).join('')}
            </select>
          </div>
          <button type="submit" class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            <i class="fas fa-search mr-2"></i>
            Filtrer
          </button>
        </form>
      </div>

      <!-- Statistiques -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        ${categories.map(cat => {
          const count = mockAchievements.filter(item => item.categorie === cat.id).length
          return `
            <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <div class="flex items-center">
                <div class="w-8 h-8 bg-${cat.color}-100 rounded-lg flex items-center justify-center">
                  <i class="${cat.icon} text-${cat.color}-600"></i>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-500">${cat.label}</p>
                  <p class="text-xl font-semibold text-gray-900">${count}</p>
                </div>
              </div>
            </div>
          `
        }).join('')}
      </div>

      <!-- Liste des réalisations -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100">
        <div class="px-6 py-4 border-b border-gray-100">
          <h2 class="text-lg font-semibold text-gray-900">
            Réalisations (${filteredAchievements.length})
          </h2>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Réalisation
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Auteur
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vues
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              ${filteredAchievements.map(item => {
                const category = categories.find(cat => cat.id === item.categorie)
                return `
                  <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="w-10 h-10 bg-${category?.color}-100 rounded-lg flex items-center justify-center mr-4">
                          <i class="${category?.icon} text-${category?.color}-600"></i>
                        </div>
                        <div>
                          <div class="text-sm font-medium text-gray-900">${item.titre}</div>
                          <div class="text-sm text-gray-500">${item.date_creation}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${category?.color}-100 text-${category?.color}-800">
                        ${category?.label}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${item.auteur}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div class="flex items-center">
                        <i class="fas fa-eye mr-1 text-gray-400"></i>
                        ${item.vues}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        ${item.en_vedette ? '<i class="fas fa-star text-yellow-500 mr-2" title="En vedette"></i>' : ''}
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ${item.statut === 'publie' ? 'Publié' : 'Brouillon'}
                        </span>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <a href="/admin/achievements/${item.id}/edit" class="text-blue-600 hover:text-blue-900">
                        <i class="fas fa-edit"></i>
                      </a>
                      <a href="${item.url_contenu}" target="_blank" class="text-green-600 hover:text-green-900">
                        <i class="fas fa-external-link-alt"></i>
                      </a>
                      <button onclick="deleteAchievement(${item.id})" class="text-red-600 hover:text-red-900">
                        <i class="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                `
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <script>
      function deleteAchievement(id) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette réalisation ?')) {
          // En production, appel API pour supprimer
          alert('Réalisation supprimée (simulation)');
          location.reload();
        }
      }
    </script>
  `

  return c.html(AdminLayout({ children: content, title: "Réalisations - Administration PBVE", currentPath: "/admin/achievements" }))
})

// Formulaire nouvelle réalisation
app.get('/new', (c) => {
  const content = `
    <div class="max-w-2xl mx-auto">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">
          <i class="fas fa-plus mr-3"></i>
          Nouvelle Réalisation
        </h1>
        <p class="text-gray-600 mt-1">Ajouter un nouveau contenu à la section réalisations</p>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <form method="POST" action="/admin/achievements" class="space-y-6">
          <div>
            <label for="titre" class="block text-sm font-medium text-gray-700 mb-2">
              Titre de la réalisation
            </label>
            <input 
              type="text" 
              id="titre" 
              name="titre" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Atelier créatif de novembre"
            >
          </div>

          <div>
            <label for="categorie" class="block text-sm font-medium text-gray-700 mb-2">
              Catégorie
            </label>
            <select 
              id="categorie" 
              name="categorie" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner une catégorie</option>
              ${categories.map(cat => `
                <option value="${cat.id}">${cat.label}</option>
              `).join('')}
            </select>
          </div>

          <div>
            <label for="auteur" class="block text-sm font-medium text-gray-700 mb-2">
              Auteur
            </label>
            <input 
              type="text" 
              id="auteur" 
              name="auteur" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Marie Cappello"
            >
          </div>

          <div>
            <label for="url_contenu" class="block text-sm font-medium text-gray-700 mb-2">
              URL du contenu
            </label>
            <input 
              type="url" 
              id="url_contenu" 
              name="url_contenu" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: https://example.com/document.pdf"
            >
            <p class="text-xs text-gray-500 mt-1">
              URL vers le fichier PDF, vidéo YouTube, fichier audio, etc.
            </p>
          </div>

          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
              Description (optionnelle)
            </label>
            <textarea 
              id="description" 
              name="description" 
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Description courte de la réalisation..."
            ></textarea>
          </div>

          <div class="flex items-center">
            <input 
              type="checkbox" 
              id="en_vedette" 
              name="en_vedette" 
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            >
            <label for="en_vedette" class="ml-2 block text-sm text-gray-700">
              Mettre en vedette sur la page d'accueil
            </label>
          </div>

          <div class="flex items-center justify-between pt-6 border-t border-gray-100">
            <a 
              href="/admin/achievements" 
              class="text-gray-600 hover:text-gray-800 font-medium"
            >
              <i class="fas fa-arrow-left mr-2"></i>
              Retour à la liste
            </a>
            <button 
              type="submit"
              class="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <i class="fas fa-save mr-2"></i>
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  `

  return c.html(AdminLayout({ children: content, title: "Nouvelle Réalisation - Administration PBVE", currentPath: "/admin/achievements" }))
})

// Traitement création nouvelle réalisation
app.post('/', async (c) => {
  try {
    const body = await c.req.formData()
    const data = {
      titre: body.get('titre') as string,
      categorie: body.get('categorie') as string,
      auteur: body.get('auteur') as string,
      url_contenu: body.get('url_contenu') as string,
      description: body.get('description') as string,
      en_vedette: body.get('en_vedette') === 'on'
    }

    // En production, sauvegarder en base de données
    console.log('Nouvelle réalisation:', data)

    return c.redirect('/admin/achievements?success=created')
  } catch (error) {
    return c.redirect('/admin/achievements/new?error=creation_failed')
  }
})

export default app