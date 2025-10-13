import { Hono } from 'hono'
import { renderer } from '../renderer'
import { Layout } from '../components/Layout'

type Realisation = {
  id: number
  titre: string
  description: string
  categorie: string
  url_contenu: string
  url_thumbnail?: string
  en_vedette: boolean
  date_creation: string
  auteur: string
  duree?: number
  nombre_vues: number
}

type Bindings = {
  DB?: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app.use(renderer)

// Données d'exemple (en attendant la base D1)
const realisationsExemple: Realisation[] = [
  {
    id: 1,
    titre: "Guide de la Solidarité 2024",
    description: "Manuel pratique pour développer l'entraide dans le quartier de Lille Sud",
    categorie: "textes",
    url_contenu: "/static/documents/guide-solidarite-2024.pdf",
    en_vedette: true,
    date_creation: "2024-10-01",
    auteur: "Marie Cappello",
    nombre_vues: 245
  },
  {
    id: 2,
    titre: "Atelier Cuisine Communautaire",
    description: "Vidéo des ateliers cuisine du mois de septembre",
    categorie: "videos",
    url_contenu: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    en_vedette: false,
    date_creation: "2024-09-15",
    auteur: "Atelier Cuisine PBVE",
    duree: 1800,
    nombre_vues: 89
  },
  {
    id: 3,
    titre: "Histoires de Lille Sud",
    description: "Livre audio racontant l'histoire du quartier par ses habitants",
    categorie: "livres_audio",
    url_contenu: "/static/audio/histoires-lille-sud.mp3",
    en_vedette: false,
    date_creation: "2024-08-20",
    auteur: "Groupe Histoire Locale",
    duree: 3600,
    nombre_vues: 156
  },
  {
    id: 4,
    titre: "PBVE Radio - Episode 1",
    description: "Premier épisode de notre podcast associatif",
    categorie: "podcasts",
    url_contenu: "/static/audio/pbve-radio-ep1.mp3",
    en_vedette: false,
    date_creation: "2024-09-01",
    auteur: "Radio PBVE",
    duree: 2400,
    nombre_vues: 78
  },
  {
    id: 5,
    titre: "Rapport Activité 2023",
    description: "Bilan complet des actions menées en 2023",
    categorie: "flipbooks",
    url_contenu: "https://online.fliphtml5.com/example1",
    en_vedette: false,
    date_creation: "2024-01-15",
    auteur: "Bureau PBVE",
    nombre_vues: 312
  }
]

// Fonction pour obtenir les réalisations (avec DB ou données d'exemple)
async function getRealisations(db?: D1Database, categorie?: string): Promise<Realisation[]> {
  if (db) {
    try {
      let query = 'SELECT * FROM realisations WHERE statut = ? ORDER BY en_vedette DESC, date_creation DESC'
      let params = ['publie']
      
      if (categorie && categorie !== 'all') {
        query = 'SELECT * FROM realisations WHERE statut = ? AND categorie = ? ORDER BY en_vedette DESC, date_creation DESC'
        params = ['publie', categorie]
      }
      
      const result = await db.prepare(query).bind(...params).all()
      return result.results as Realisation[]
    } catch (error) {
      console.error('Erreur base de données:', error)
      return realisationsExemple.filter(r => !categorie || categorie === 'all' || r.categorie === categorie)
    }
  }
  
  return realisationsExemple.filter(r => !categorie || categorie === 'all' || r.categorie === categorie)
}

// Fonction pour formater la durée
function formatDuree(seconds?: number): string {
  if (!seconds) return ''
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

// Fonction pour formater la date
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

// Route principale des réalisations
app.get('/', async (c) => {
  const categorie = c.req.query('categorie') || 'all'
  const realisations = await getRealisations(c.env?.DB, categorie)
  
  const realisationVedette = realisations.find(r => r.en_vedette)
  const autresRealisations = realisations.filter(r => !r.en_vedette)
  
  const categories = [
    { id: 'all', label: 'Toutes', icon: 'fas fa-th-large', count: realisations.length },
    { id: 'textes', label: 'Textes', icon: 'fas fa-file-alt', count: realisations.filter(r => r.categorie === 'textes').length },
    { id: 'videos', label: 'Vidéos', icon: 'fas fa-video', count: realisations.filter(r => r.categorie === 'videos').length },
    { id: 'livres_audio', label: 'Livres Audio', icon: 'fas fa-headphones', count: realisations.filter(r => r.categorie === 'livres_audio').length },
    { id: 'podcasts', label: 'Podcasts', icon: 'fas fa-podcast', count: realisations.filter(r => r.categorie === 'podcasts').length },
    { id: 'flipbooks', label: 'Flipbooks', icon: 'fas fa-book-open', count: realisations.filter(r => r.categorie === 'flipbooks').length }
  ]

  return c.render(
    <Layout activeMenu="realisations">
      {/* Hero Section */}
      <section class="bg-gradient-to-r from-purple-600 to-pink-700 text-white py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center">
            <h1 class="text-4xl md:text-5xl font-bold mb-6">
              <i class="fas fa-star mr-4"></i>
              Nos Réalisations
            </h1>
            <p class="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Découvrez les créations et projets de l'association PBVE
            </p>
            <div class="flex items-center justify-center text-lg">
              <i class="fas fa-trophy mr-2"></i>
              <span>{realisations.length} réalisations publiées</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filtres par catégorie */}
      <section class="py-8 bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex flex-wrap justify-center gap-4">
            {categories.map(cat => (
              <a
                href={`/realisations${cat.id !== 'all' ? '?categorie=' + cat.id : ''}`}
                class={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  categorie === cat.id 
                    ? 'bg-purple-500 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-700 hover:bg-purple-100 hover:text-purple-700'
                }`}
              >
                <i class={`${cat.icon} mr-2`}></i>
                {cat.label}
                <span class="ml-2 bg-white bg-opacity-20 text-xs px-2 py-1 rounded-full">
                  {cat.count}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Réalisation en vedette */}
      {realisationVedette && (
        <section class="py-16 bg-gradient-to-br from-yellow-50 to-orange-50">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-8">
              <h2 class="text-3xl font-bold text-gray-900 mb-4">
                <i class="fas fa-star text-yellow-500 mr-2"></i>
                Réalisation En Vedette
              </h2>
            </div>
            
            <div class="bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl mx-auto">
              <div class="md:flex">
                <div class="md:flex-1 p-8">
                  <div class="flex items-center mb-4">
                    <span class="bg-yellow-100 text-yellow-800 text-xs font-medium px-3 py-1 rounded-full">
                      {categories.find(c => c.id === realisationVedette.categorie)?.label}
                    </span>
                    <span class="ml-3 text-sm text-gray-500">
                      {formatDate(realisationVedette.date_creation)}
                    </span>
                  </div>
                  
                  <h3 class="text-2xl font-bold text-gray-900 mb-4">
                    {realisationVedette.titre}
                  </h3>
                  
                  <p class="text-gray-600 mb-6 leading-relaxed">
                    {realisationVedette.description}
                  </p>
                  
                  <div class="flex items-center text-sm text-gray-500 mb-6">
                    <i class="fas fa-user mr-2"></i>
                    <span class="mr-4">{realisationVedette.auteur}</span>
                    {realisationVedette.duree && (
                      <>
                        <i class="fas fa-clock mr-2"></i>
                        <span class="mr-4">{formatDuree(realisationVedette.duree)}</span>
                      </>
                    )}
                    <i class="fas fa-eye mr-2"></i>
                    <span>{realisationVedette.nombre_vues} vues</span>
                  </div>
                  
                  <a
                    href={realisationVedette.url_contenu}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors"
                  >
                    <i class="fas fa-play mr-2"></i>
                    Découvrir
                  </a>
                </div>
                
                {realisationVedette.categorie === 'videos' && (
                  <div class="md:flex-1 bg-gray-900">
                    <div class="aspect-video">
                      <iframe
                        src={realisationVedette.url_contenu}
                        class="w-full h-full"
                        allowfullscreen
                      ></iframe>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Grille des autres réalisations */}
      <section class="py-16 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">
              Toutes Nos Réalisations
            </h2>
            <p class="text-xl text-gray-600">
              {categorie !== 'all' 
                ? `${categories.find(c => c.id === categorie)?.label} (${autresRealisations.length})`
                : `${autresRealisations.length} réalisations disponibles`
              }
            </p>
          </div>

          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {autresRealisations.map(realisation => (
              <div class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <div class="p-6">
                  <div class="flex items-center justify-between mb-4">
                    <span class={`text-xs font-medium px-3 py-1 rounded-full ${
                      realisation.categorie === 'textes' ? 'bg-blue-100 text-blue-800' :
                      realisation.categorie === 'videos' ? 'bg-red-100 text-red-800' :
                      realisation.categorie === 'livres_audio' ? 'bg-green-100 text-green-800' :
                      realisation.categorie === 'podcasts' ? 'bg-purple-100 text-purple-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {categories.find(c => c.id === realisation.categorie)?.label}
                    </span>
                    <span class="text-xs text-gray-500">
                      {formatDate(realisation.date_creation)}
                    </span>
                  </div>
                  
                  <h3 class="text-lg font-semibold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                    {realisation.titre}
                  </h3>
                  
                  <p class="text-gray-600 text-sm mb-4 line-clamp-3">
                    {realisation.description}
                  </p>
                  
                  <div class="flex items-center text-xs text-gray-500 mb-4">
                    <i class="fas fa-user mr-1"></i>
                    <span class="mr-3">{realisation.auteur}</span>
                    {realisation.duree && (
                      <>
                        <i class="fas fa-clock mr-1"></i>
                        <span class="mr-3">{formatDuree(realisation.duree)}</span>
                      </>
                    )}
                    <i class="fas fa-eye mr-1"></i>
                    <span>{realisation.nombre_vues}</span>
                  </div>
                  
                  <a
                    href={realisation.url_contenu}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium text-sm transition-colors"
                  >
                    <i class={`${categories.find(c => c.id === realisation.categorie)?.icon} mr-2`}></i>
                    Consulter
                    <i class="fas fa-external-link-alt ml-2 text-xs"></i>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section class="py-16 bg-gradient-to-r from-purple-600 to-pink-700 text-white">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 class="text-3xl font-bold mb-6">
            Vous avez un projet à partager ?
          </h2>
          <p class="text-xl mb-8 opacity-90">
            L'association PBVE encourage la créativité et l'expression de tous ses membres.
          </p>
          <a
            href="/contact"
            class="inline-flex items-center bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            <i class="fas fa-plus mr-2"></i>
            Proposer un contenu
          </a>
        </div>
      </section>
    </Layout>,
    { title: 'Réalisations - Pour Bien Vivre Ensemble' }
  )
})

export default app