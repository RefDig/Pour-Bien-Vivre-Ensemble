import { Hono } from 'hono'
import { renderer } from '../renderer'
import { Layout } from '../components/Layout'
import { getCookie, setCookie } from 'hono/cookie'

type Bindings = {
  DB?: any
}

type Realisation = {
  id?: number
  titre: string
  description: string
  categorie: string
  url_contenu: string
  url_thumbnail?: string
  en_vedette: boolean
  auteur: string
  duree?: number
  statut: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.use(renderer)

// Middleware d'authentification
async function requireAuth(c: any, next: any) {
  const sessionId = getCookie(c, 'admin_session')
  if (!sessionId) {
    return c.render(
      <div class="min-h-screen flex items-center justify-center bg-red-50">
        <div class="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <h2 class="text-xl font-bold text-red-600 mb-4">Session non trouvée</h2>
          <p class="text-gray-700 mb-4">Le cookie de session admin n'a pas été détecté. Activez les cookies et réessayez.</p>
          <a href="/admin/realisations/login" class="text-blue-600 hover:underline">Retour à la connexion</a>
        </div>
      </div>
    )
  }
  // Vérifier la session en base (si DB disponible)
  if (c.env?.DB) {
    try {
      const session = await c.env.DB.prepare(
        'SELECT s.*, u.email, u.nom FROM admin_sessions s JOIN admin_users u ON s.user_id = u.id WHERE s.id = ? AND s.expires_at > datetime("now")'
      ).bind(sessionId).first()
      if (!session) {
        return c.render(
          <div class="min-h-screen flex items-center justify-center bg-red-50">
            <div class="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
              <h2 class="text-xl font-bold text-red-600 mb-4">Session invalide</h2>
              <p class="text-gray-700 mb-4">La session admin n'a pas été trouvée ou a expiré.<br/>Essayez de vous reconnecter.</p>
              <a href="/admin/realisations/login" class="text-blue-600 hover:underline">Retour à la connexion</a>
            </div>
          </div>
        )
      }
      c.set('user', session)
    } catch (error) {
      return c.render(
        <div class="min-h-screen flex items-center justify-center bg-red-50">
          <div class="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
            <h2 class="text-xl font-bold text-red-600 mb-4">Erreur de connexion</h2>
            <p class="text-gray-700 mb-4">Impossible de vérifier la session admin.<br/>Erreur technique côté serveur.</p>
            <a href="/admin/realisations/login" class="text-blue-600 hover:underline">Retour à la connexion</a>
          </div>
        </div>
      )
    }
  }
  await next()
}

// Données d'exemple pour les réalisations
const realisationsExemple = [
  {
    id: 1,
    titre: "Guide de la Solidarité 2024",
    description: "Manuel pratique pour développer l'entraide dans le quartier de Lille Sud",
    categorie: "textes",
    url_contenu: "/static/documents/guide-solidarite-2024.pdf",
    en_vedette: true,
    auteur: "Marie Cappello",
    statut: "publie"
  },
  {
    id: 2,
    titre: "Atelier Cuisine Communautaire", 
    description: "Vidéo des ateliers cuisine du mois de septembre",
    categorie: "videos",
    url_contenu: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    en_vedette: false,
    auteur: "Atelier Cuisine PBVE",
    duree: 1800,
    statut: "publie"
  }
]

// Route de connexion admin
app.get('/login', (c) => {
  const error = c.req.query('error')
  return c.render(
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-user-shield text-white text-2xl"></i>
          </div>
          <h1 class="text-2xl font-bold text-gray-900">Administration PBVE</h1>
          <p class="text-gray-600 mt-2">Gestion des réalisations</p>
        </div>
        {error && (
          <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            <div class="flex">
              <i class="fas fa-exclamation-triangle mr-2 mt-0.5"></i>
              <span class="text-sm">Identifiants incorrects. Veuillez réessayer.</span>
            </div>
          </div>
        )}
        <form method="post" action="/admin/realisations/login" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email administrateur
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="admin@pbve.fr"
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
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            class="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors"
          >
            <i class="fas fa-sign-in-alt mr-2"></i>
            Se connecter
          </button>
        </form>
        <div class="mt-6 text-center text-sm text-gray-500">
          <p>Compte de démonstration :</p>
          <p><strong>Email :</strong> admin@pbve.fr</p>
          <p><strong>Mot de passe :</strong> pbve2024!</p>
        </div>
      </div>
    </div>
  )
})

// Traitement de la connexion
app.post('/login', async (c) => {
  const { email, password } = await c.req.parseBody()
  
  // Validation simple pour la démo
  if (email === 'admin@pbve.fr' && password === 'pbve2024!') {
    // Générer un ID de session
    const sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    
    // Enregistrer la session en base si DB disponible
    if (c.env?.DB) {
      try {
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24h
        await c.env.DB.prepare(
          'INSERT INTO admin_sessions (id, user_id, expires_at) VALUES (?, 1, ?)'
        ).bind(sessionId, expiresAt).run()
      } catch (error) {
        // Log error silently (console not available in worker context)
      }
    }
    
    // Définir le cookie de session (Cloudflare: secure=false, sameSite=Lax pour compatibilité)
    setCookie(c, 'admin_session', sessionId, {
      maxAge: 24 * 60 * 60, // 24h
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      path: '/'
    })
    
    return c.redirect('/admin/realisations')
  }
  
  return c.redirect('/admin/realisations/login?error=1')
})

// Dashboard admin avec middleware d'auth
app.get('/', requireAuth, async (c) => {
  let realisations = realisationsExemple
  
  // Récupérer les réalisations depuis la base si disponible
  if (c.env?.DB) {
    try {
      const result = await c.env.DB.prepare(
        'SELECT * FROM realisations ORDER BY date_creation DESC'
      ).all()
      realisations = result.results as any[]
    } catch (error) {
      // Log error silently (console not available in worker context)
    }
  }
  
  const stats = {
  total: (realisations ?? []).length,
  publies: (realisations ?? []).filter(r => r.statut === 'publie').length,
  brouillons: (realisations ?? []).filter(r => r.statut === 'brouillon').length,
  vedette: (realisations ?? []).filter(r => r.en_vedette).length
  }

  return c.render(
    <Layout activeMenu="admin">
      <div class="min-h-screen bg-gray-50">
        {/* Header admin */}
        <div class="bg-white shadow-sm border-b">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
              <h1 class="text-xl font-semibold text-gray-900">
                <i class="fas fa-star mr-2 text-purple-600"></i>
                Administration - Réalisations
              </h1>
              <div class="flex items-center space-x-4">
                <a
                  href="/admin-galerie-corrigee"
                  class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
                >
                  <i class="fas fa-images mr-2"></i>
                  Galerie
                </a>
                <span class="text-sm text-gray-600">
                  Connecté en tant qu'admin
                </span>
                <a
                  href="/admin/realisations/logout"
                  class="text-red-600 hover:text-red-800 text-sm"
                >
                  <i class="fas fa-sign-out-alt mr-1"></i>
                  Déconnexion
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Statistiques */}
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i class="fas fa-list text-blue-600 text-xl"></i>
                </div>
                <div class="ml-4">
                  <p class="text-sm text-gray-600">Total</p>
                  <p class="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>
            
            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center">
                <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <i class="fas fa-check-circle text-green-600 text-xl"></i>
                </div>
                <div class="ml-4">
                  <p class="text-sm text-gray-600">Publiées</p>
                  <p class="text-2xl font-bold text-gray-900">{stats.publies}</p>
                </div>
              </div>
            </div>
            
            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center">
                <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <i class="fas fa-edit text-yellow-600 text-xl"></i>
                </div>
                <div class="ml-4">
                  <p class="text-sm text-gray-600">Brouillons</p>
                  <p class="text-2xl font-bold text-gray-900">{stats.brouillons}</p>
                </div>
              </div>
            </div>
            
            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center">
                <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i class="fas fa-star text-purple-600 text-xl"></i>
                </div>
                <div class="ml-4">
                  <p class="text-sm text-gray-600">En vedette</p>
                  <p class="text-2xl font-bold text-gray-900">{stats.vedette}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions principales */}
          <div class="bg-white rounded-lg shadow mb-8">
            <div class="px-6 py-4 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-medium text-gray-900">
                  Gestion des Réalisations
                </h2>
                <a
                  href="/admin/realisations/nouveau"
                  class="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-colors"
                >
                  <i class="fas fa-plus mr-2"></i>
                  Nouvelle réalisation
                </a>
              </div>
            </div>
            
            {/* Liste des réalisations */}
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Titre
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Catégorie
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  {(realisations ?? []).map(realisation => (
                    <tr class="hover:bg-gray-50">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          {realisation.en_vedette && (
                            <i class="fas fa-star text-yellow-500 mr-2"></i>
                          )}
                          <div>
                            <div class="text-sm font-medium text-gray-900">
                              {realisation.titre}
                            </div>
                            <div class="text-sm text-gray-500">
                              Par {realisation.auteur}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          realisation.categorie === 'textes' ? 'bg-blue-100 text-blue-800' :
                          realisation.categorie === 'videos' ? 'bg-red-100 text-red-800' :
                          realisation.categorie === 'livres_audio' ? 'bg-green-100 text-green-800' :
                          realisation.categorie === 'podcasts' ? 'bg-purple-100 text-purple-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {realisation.categorie.replace('_', ' ')}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          realisation.statut === 'publie' ? 'bg-green-100 text-green-800' :
                          realisation.statut === 'brouillon' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {realisation.statut}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date().toLocaleDateString('fr-FR')}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <a
                          href={`/admin/realisations/modifier/${realisation.id}`}
                          class="text-indigo-600 hover:text-indigo-900"
                        >
                          <i class="fas fa-edit mr-1"></i>Modifier
                        </a>
                        <a
                          href={`/admin/realisations/supprimer/${realisation.id}`}
                          class="text-red-600 hover:text-red-900"
                          onclick="return confirm('Êtes-vous sûr de vouloir supprimer cette réalisation ?')"
                        >
                          <i class="fas fa-trash mr-1"></i>Supprimer
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
})

// Route pour créer une nouvelle réalisation
app.get('/nouveau', requireAuth, (c) => {
  return c.render(
    <Layout activeMenu="admin">
      <div class="min-h-screen bg-gray-50">
        <div class="bg-white shadow-sm border-b">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
              <h1 class="text-xl font-semibold text-gray-900">
                <i class="fas fa-plus mr-2 text-purple-600"></i>
                Nouvelle Réalisation
              </h1>
              <a
                href="/admin/realisations"
                class="text-gray-600 hover:text-gray-800"
              >
                <i class="fas fa-arrow-left mr-1"></i>
                Retour
              </a>
            </div>
          </div>
        </div>

        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="bg-white rounded-lg shadow">
            <form method="post" action="/admin/realisations/creer" class="p-6 space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Titre *
                  </label>
                  <input
                    type="text"
                    name="titre"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Titre de la réalisation"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie *
                  </label>
                  <select title="Catégorie"
                    name="categorie"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    <option value="textes">Textes</option>
                    <option value="videos">Vidéos</option>
                    <option value="livres_audio">Livres Audio</option>
                    <option value="podcasts">Podcasts</option>
                    <option value="flipbooks">Flipbooks</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={4}
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Description de la réalisation"
                ></textarea>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  URL du contenu *
                </label>
                <input
                  type="url"
                  name="url_contenu"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://... ou /static/..."
                />
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Auteur
                  </label>
                  <input
                    type="text"
                    name="auteur"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Nom de l'auteur"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Durée (minutes)
                  </label>
                  <input
                    type="number"
                    name="duree"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div class="flex items-center space-x-6">
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    name="en_vedette"
                    class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <span class="ml-2 text-sm text-gray-700">Mettre en vedette</span>
                </label>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Statut
                  </label>
                  <select title="Statut"
                    name="statut"
                    class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="brouillon">Brouillon</option>
                    <option value="publie">Publié</option>
                  </select>
                </div>
              </div>
              
              <div class="flex items-center justify-end space-x-4 pt-6 border-t">
                <a
                  href="/admin/realisations"
                  class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </a>
                <button
                  type="submit"
                  class="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-colors"
                >
                  <i class="fas fa-save mr-2"></i>
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
})

// Traitement de création d'une réalisation
app.post('/creer', requireAuth, async (c) => {
  const formData = await c.req.parseBody()

  const realisation: Realisation = {
    titre: formData.titre as string,
    description: formData.description as string || '',
    categorie: formData.categorie as string,
    url_contenu: formData.url_contenu as string,
    en_vedette: formData.en_vedette === 'on',
    auteur: formData.auteur as string || 'PBVE',
    duree: formData.duree ? parseInt(formData.duree as string) * 60 : undefined,
    statut: formData.statut as string || 'brouillon'
  }

  let erreur = ''
  let success = false

  if (c.env?.DB) {
    try {
      await c.env.DB.prepare(`
        INSERT INTO realisations (titre, description, categorie, url_contenu, en_vedette, auteur, duree, statut)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        realisation.titre,
        realisation.description,
        realisation.categorie,
        realisation.url_contenu,
        realisation.en_vedette ? 1 : 0,
        realisation.auteur,
        realisation.duree || null,
        realisation.statut
      ).run()
      success = true
    } catch (error) {
      // Log error silently (console not available in worker context)
      if (typeof error === 'object' && error !== null && 'message' in error) {
        erreur = "Erreur lors de l'enregistrement en base : " + (error as any).message
      } else {
        erreur = "Erreur lors de l'enregistrement en base : " + String(error)
      }
    }
  } else {
    erreur = "Base de données D1 non accessible. Contactez l'administrateur."
  }

  if (success) {
    return c.redirect('/admin/realisations?success=1')
  } else {
    // Afficher le formulaire avec le message d'erreur
    return c.render(
      <Layout activeMenu="admin">
        <div class="max-w-2xl mx-auto mt-10 bg-white rounded-lg shadow p-8">
          <h2 class="text-xl font-bold mb-4 text-red-600">Erreur lors de la création de la réalisation</h2>
          <div class="mb-6 text-red-700 bg-red-100 border border-red-300 rounded p-4">
            {erreur}
          </div>
          <a href="/admin/realisations" class="text-blue-600 hover:underline">Retour à la liste des réalisations</a>
        </div>
      </Layout>
    )
  }
})


// Route de modification d'une réalisation (POST)
app.post('/modifier/:id', requireAuth, async (c) => {
  const id = c.req.param('id')
  const formData = await c.req.parseBody()
  let erreur = ''
  let success = false

  const realisation: Realisation = {
    titre: formData.titre as string,
    description: formData.description as string || '',
    categorie: formData.categorie as string,
    url_contenu: formData.url_contenu as string,
    en_vedette: formData.en_vedette === 'on',
    auteur: formData.auteur as string || 'PBVE',
    duree: formData.duree ? parseInt(formData.duree as string) * 60 : undefined,
    statut: formData.statut as string || 'brouillon'
  }

  if (c.env?.DB) {
    try {
      await c.env.DB.prepare(`
        UPDATE realisations SET titre=?, description=?, categorie=?, url_contenu=?, en_vedette=?, auteur=?, duree=?, statut=? WHERE id=?
      `).bind(
        realisation.titre,
        realisation.description,
        realisation.categorie,
        realisation.url_contenu,
        realisation.en_vedette ? 1 : 0,
        realisation.auteur,
        realisation.duree || null,
        realisation.statut,
        id
      ).run()
      success = true
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'message' in error) {
        erreur = "Erreur lors de la modification en base : " + (error as any).message
      } else {
        erreur = "Erreur lors de la modification en base : " + String(error)
      }
    }
  } else {
    erreur = "Base de données D1 non accessible. Contactez l'administrateur."
  }

  if (success) {
    return c.redirect('/admin/realisations?success=1')
  } else {
    return c.render(
      <Layout activeMenu="admin">
        <div class="max-w-2xl mx-auto mt-10 bg-white rounded-lg shadow p-8">
          <h2 class="text-xl font-bold mb-4 text-red-600">Erreur lors de la modification de la réalisation</h2>
          <div class="mb-6 text-red-700 bg-red-100 border border-red-300 rounded p-4">
            {erreur}
          </div>
          <a href="/admin/realisations" class="text-blue-600 hover:underline">Retour à la liste des réalisations</a>
        </div>
      </Layout>
    )
  }
})

// Route de suppression d'une réalisation (GET)
app.get('/supprimer/:id', requireAuth, async (c) => {
  const id = c.req.param('id')
  let erreur = ''
  let success = false

  if (c.env?.DB) {
    try {
      await c.env.DB.prepare('DELETE FROM realisations WHERE id=?').bind(id).run()
      success = true
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'message' in error) {
        erreur = "Erreur lors de la suppression en base : " + (error as any).message
      } else {
        erreur = "Erreur lors de la suppression en base : " + String(error)
      }
    }
  } else {
    erreur = "Base de données D1 non accessible. Contactez l'administrateur."
  }

  if (success) {
    return c.redirect('/admin/realisations?success=1')
  } else {
    return c.render(
      <Layout activeMenu="admin">
        <div class="max-w-2xl mx-auto mt-10 bg-white rounded-lg shadow p-8">
          <h2 class="text-xl font-bold mb-4 text-red-600">Erreur lors de la suppression de la réalisation</h2>
          <div class="mb-6 text-red-700 bg-red-100 border border-red-300 rounded p-4">
            {erreur}
          </div>
          <a href="/admin/realisations" class="text-blue-600 hover:underline">Retour à la liste des réalisations</a>
        </div>
      </Layout>
    )
  }
})

// Route de déconnexion
app.get('/logout', (c) => {
  setCookie(c, 'admin_session', '', { maxAge: 0 })
  return c.redirect('/admin/realisations/login')
})

export default app