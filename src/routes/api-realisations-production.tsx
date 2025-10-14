import { Hono } from 'hono'
import { cors } from 'hono/cors'

type Bindings = {
  REALISATIONS_DATA: KVNamespace;
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('/*', cors())

// Clé de stockage KV
const REALISATIONS_KEY = 'pbve_realisations'

// Helper functions
async function getRealisations(kv: KVNamespace): Promise<any[]> {
  const realisations = await kv.get(REALISATIONS_KEY, 'json')
  return realisations || []
}

async function saveRealisations(kv: KVNamespace, realisations: any[]): Promise<void> {
  await kv.put(REALISATIONS_KEY, JSON.stringify(realisations))
}

// Validation des catégories autorisées
const CATEGORIES_AUTORISEES = ['textes', 'videos', 'livres-audio', 'podcasts', 'flipbooks']

function validerCategorie(categorie: string): boolean {
  return CATEGORIES_AUTORISEES.includes(categorie.toLowerCase().trim())
}

function validerUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Routes API

// GET /realisations - Récupérer toutes les réalisations
app.get('/realisations', async (c) => {
  try {
    const realisations = await getRealisations(c.env.REALISATIONS_DATA)
    console.log(`📚 ${realisations.length} réalisations récupérées`)
    
    // Trier par mise en avant puis par date de création (plus récent d'abord)
    const realisationsTries = realisations.sort((a, b) => {
      if (a.miseEnAvant && !b.miseEnAvant) return -1
      if (!a.miseEnAvant && b.miseEnAvant) return 1
      return new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime()
    })
    
    return c.json(realisationsTries)
  } catch (error) {
    console.error('❌ Erreur récupération réalisations:', error)
    return c.json({ error: 'Erreur serveur' }, 500)
  }
})

// POST /realisations - Ajouter une réalisation
app.post('/realisations', async (c) => {
  try {
    const data = await c.req.json()
    
    // Validation des champs obligatoires
    if (!data.titre || !data.description || !data.categorie || !data.url) {
      return c.json({ error: 'Champs obligatoires manquants' }, 400)
    }
    
    // Validation de la catégorie
    if (!validerCategorie(data.categorie)) {
      return c.json({ error: 'Catégorie non autorisée' }, 400)
    }
    
    // Validation de l'URL
    if (!validerUrl(data.url)) {
      return c.json({ error: 'URL invalide' }, 400)
    }
    
    // Récupérer réalisations existantes
    const realisations = await getRealisations(c.env.REALISATIONS_DATA)
    
    // Créer la nouvelle réalisation
    const nouvelleRealisation = {
      id: data.id || Date.now(),
      titre: data.titre.trim(),
      description: data.description.trim(),
      categorie: data.categorie.toLowerCase().trim(),
      url: data.url.trim(),
      auteur: data.auteur ? data.auteur.trim() : null,
      tags: Array.isArray(data.tags) ? data.tags.filter(tag => tag && tag.trim()) : [],
      miseEnAvant: Boolean(data.miseEnAvant),
      dateCreation: data.dateCreation || new Date().toLocaleDateString('fr-FR'),
      vues: data.vues || 0,
      dateMiseAJour: new Date().toISOString()
    }
    
    // Ajouter la nouvelle réalisation
    realisations.push(nouvelleRealisation)
    
    // Sauvegarder
    await saveRealisations(c.env.REALISATIONS_DATA, realisations)
    
    console.log(`✅ Réalisation "${nouvelleRealisation.titre}" ajoutée (catégorie: ${nouvelleRealisation.categorie})`)
    return c.json({ 
      success: true, 
      realisation: nouvelleRealisation,
      totalRealisations: realisations.length
    })
    
  } catch (error) {
    console.error('❌ Erreur ajout réalisation:', error)
    return c.json({ error: 'Erreur serveur' }, 500)
  }
})

// DELETE /realisations/:id - Supprimer une réalisation
app.delete('/realisations/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const realisations = await getRealisations(c.env.REALISATIONS_DATA)
    
    const realisationIndex = realisations.findIndex(r => r.id.toString() === id)
    if (realisationIndex === -1) {
      return c.json({ error: 'Réalisation introuvable' }, 404)
    }
    
    const realisationSupprimee = realisations[realisationIndex]
    realisations.splice(realisationIndex, 1)
    
    await saveRealisations(c.env.REALISATIONS_DATA, realisations)
    
    console.log(`🗑️ Réalisation "${realisationSupprimee.titre}" supprimée`)
    return c.json({ 
      success: true, 
      message: 'Réalisation supprimée',
      totalRealisations: realisations.length
    })
    
  } catch (error) {
    console.error('❌ Erreur suppression réalisation:', error)
    return c.json({ error: 'Erreur serveur' }, 500)
  }
})

// PUT /realisations/:id - Mettre à jour une réalisation
app.put('/realisations/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const updates = await c.req.json()
    const realisations = await getRealisations(c.env.REALISATIONS_DATA)
    
    const realisationIndex = realisations.findIndex(r => r.id.toString() === id)
    if (realisationIndex === -1) {
      return c.json({ error: 'Réalisation introuvable' }, 404)
    }
    
    const realisation = realisations[realisationIndex]
    
    // Valider et mettre à jour les champs modifiables
    if (updates.titre) realisation.titre = updates.titre.trim()
    if (updates.description) realisation.description = updates.description.trim()
    if (updates.categorie && validerCategorie(updates.categorie)) {
      realisation.categorie = updates.categorie.toLowerCase().trim()
    }
    if (updates.url && validerUrl(updates.url)) {
      realisation.url = updates.url.trim()
    }
    if (updates.auteur !== undefined) {
      realisation.auteur = updates.auteur ? updates.auteur.trim() : null
    }
    if (Array.isArray(updates.tags)) {
      realisation.tags = updates.tags.filter(tag => tag && tag.trim())
    }
    if (updates.miseEnAvant !== undefined) {
      realisation.miseEnAvant = Boolean(updates.miseEnAvant)
    }
    
    realisation.dateMiseAJour = new Date().toISOString()
    
    await saveRealisations(c.env.REALISATIONS_DATA, realisations)
    
    console.log(`✏️ Réalisation "${realisation.titre}" mise à jour`)
    return c.json({ 
      success: true, 
      realisation: realisation
    })
    
  } catch (error) {
    console.error('❌ Erreur mise à jour réalisation:', error)
    return c.json({ error: 'Erreur serveur' }, 500)
  }
})

// GET /realisations/by-category/:category - Réalisations par catégorie
app.get('/realisations/by-category/:category', async (c) => {
  try {
    const category = decodeURIComponent(c.req.param('category')).toLowerCase().trim()
    
    if (!validerCategorie(category)) {
      return c.json({ error: 'Catégorie non autorisée' }, 400)
    }
    
    const realisations = await getRealisations(c.env.REALISATIONS_DATA)
    const realisationsCategorie = realisations.filter(r => r.categorie === category)
    
    // Trier par mise en avant puis par date
    realisationsCategorie.sort((a, b) => {
      if (a.miseEnAvant && !b.miseEnAvant) return -1
      if (!a.miseEnAvant && b.miseEnAvant) return 1
      return new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime()
    })
    
    console.log(`📚 ${realisationsCategorie.length} réalisations trouvées pour la catégorie "${category}"`)
    return c.json(realisationsCategorie)
    
  } catch (error) {
    console.error('❌ Erreur récupération réalisations par catégorie:', error)
    return c.json({ error: 'Erreur serveur' }, 500)
  }
})

// GET /realisations/featured - Réalisations mises en avant
app.get('/realisations/featured', async (c) => {
  try {
    const realisations = await getRealisations(c.env.REALISATIONS_DATA)
    const realisationsMiseEnAvant = realisations.filter(r => r.miseEnAvant)
    
    // Trier par date de création (plus récent d'abord)
    realisationsMiseEnAvant.sort((a, b) => 
      new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime()
    )
    
    console.log(`⭐ ${realisationsMiseEnAvant.length} réalisations mises en avant`)
    return c.json(realisationsMiseEnAvant)
    
  } catch (error) {
    console.error('❌ Erreur récupération réalisations mises en avant:', error)
    return c.json({ error: 'Erreur serveur' }, 500)
  }
})

// GET /stats - Statistiques des réalisations
app.get('/stats', async (c) => {
  try {
    const realisations = await getRealisations(c.env.REALISATIONS_DATA)
    
    const stats = {
      totalRealisations: realisations.length,
      totalMiseEnAvant: realisations.filter(r => r.miseEnAvant).length,
      derniereRealisation: realisations.length > 0 ? 
        realisations.sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime())[0].dateCreation 
        : null,
      realisationsParCategorie: {
        textes: realisations.filter(r => r.categorie === 'textes').length,
        videos: realisations.filter(r => r.categorie === 'videos').length,
        'livres-audio': realisations.filter(r => r.categorie === 'livres-audio').length,
        podcasts: realisations.filter(r => r.categorie === 'podcasts').length,
        flipbooks: realisations.filter(r => r.categorie === 'flipbooks').length
      },
      categoriesDisponibles: CATEGORIES_AUTORISEES
    }
    
    return c.json(stats)
    
  } catch (error) {
    console.error('❌ Erreur récupération stats réalisations:', error)
    return c.json({ error: 'Erreur serveur' }, 500)
  }
})

// POST /realisations/:id/increment-views - Incrémenter les vues d'une réalisation
app.post('/realisations/:id/increment-views', async (c) => {
  try {
    const id = c.req.param('id')
    const realisations = await getRealisations(c.env.REALISATIONS_DATA)
    
    const realisationIndex = realisations.findIndex(r => r.id.toString() === id)
    if (realisationIndex === -1) {
      return c.json({ error: 'Réalisation introuvable' }, 404)
    }
    
    realisations[realisationIndex].vues = (realisations[realisationIndex].vues || 0) + 1
    await saveRealisations(c.env.REALISATIONS_DATA, realisations)
    
    return c.json({ 
      success: true, 
      vues: realisations[realisationIndex].vues
    })
    
  } catch (error) {
    console.error('❌ Erreur incrémentation vues:', error)
    return c.json({ error: 'Erreur serveur' }, 500)
  }
})

// DELETE /realisations/clear - Vider toutes les réalisations (fonction d'administration)
app.delete('/realisations/clear', async (c) => {
  try {
    await saveRealisations(c.env.REALISATIONS_DATA, [])
    console.log('🧹 Toutes les réalisations supprimées')
    return c.json({ 
      success: true, 
      message: 'Toutes les réalisations supprimées',
      totalRealisations: 0
    })
  } catch (error) {
    console.error('❌ Erreur vidage réalisations:', error)
    return c.json({ error: 'Erreur serveur' }, 500)
  }
})

// GET /search - Recherche dans les réalisations
app.get('/search', async (c) => {
  try {
    const query = c.req.query('q')?.toLowerCase().trim()
    const category = c.req.query('category')?.toLowerCase().trim()
    
    if (!query || query.length < 2) {
      return c.json({ error: 'Requête de recherche trop courte (min 2 caractères)' }, 400)
    }
    
    const realisations = await getRealisations(c.env.REALISATIONS_DATA)
    
    let resultats = realisations.filter(r => {
      // Recherche dans le titre, description et tags
      const rechercheTexte = 
        r.titre.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query) ||
        (r.auteur && r.auteur.toLowerCase().includes(query)) ||
        (r.tags && r.tags.some(tag => tag.toLowerCase().includes(query)))
      
      // Filtre par catégorie si spécifié
      const filtreCategorie = !category || r.categorie === category
      
      return rechercheTexte && filtreCategorie
    })
    
    // Trier par pertinence (titre d'abord, puis mise en avant, puis date)
    resultats.sort((a, b) => {
      const aTitle = a.titre.toLowerCase().includes(query)
      const bTitle = b.titre.toLowerCase().includes(query)
      
      if (aTitle && !bTitle) return -1
      if (!aTitle && bTitle) return 1
      if (a.miseEnAvant && !b.miseEnAvant) return -1
      if (!a.miseEnAvant && b.miseEnAvant) return 1
      
      return new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime()
    })
    
    console.log(`🔍 ${resultats.length} résultats trouvés pour "${query}"`)
    return c.json({
      query,
      category: category || null,
      resultats,
      total: resultats.length
    })
    
  } catch (error) {
    console.error('❌ Erreur recherche réalisations:', error)
    return c.json({ error: 'Erreur serveur' }, 500)
  }
})

export default app