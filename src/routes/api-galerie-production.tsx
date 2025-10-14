import { Hono } from 'hono'
import { cors } from 'hono/cors'

type Bindings = {
  GALERIE_DATA: KVNamespace;
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('/*', cors())

// Clés de stockage KV
const PHOTOS_KEY = 'galerie_photos'
const CATEGORIES_KEY = 'galerie_categories'

// Initialiser les catégories par défaut
const CATEGORIES_DEFAULT = ['ateliers', 'sorties', 'fetes', 'portraits', 'activites', 'evenements']

// Helper functions
async function getPhotos(kv: KVNamespace): Promise<any[]> {
  const photos = await kv.get(PHOTOS_KEY, 'json')
  return photos || []
}

async function savePhotos(kv: KVNamespace, photos: any[]): Promise<void> {
  await kv.put(PHOTOS_KEY, JSON.stringify(photos))
}

async function getCategories(kv: KVNamespace): Promise<string[]> {
  const categories = await kv.get(CATEGORIES_KEY, 'json')
  return categories || CATEGORIES_DEFAULT
}

async function saveCategories(kv: KVNamespace, categories: string[]): Promise<void> {
  await kv.put(CATEGORIES_KEY, JSON.stringify(categories))
}

// Routes API

// GET /photos - Récupérer toutes les photos
app.get('/photos', async (c) => {
  try {
    const photos = await getPhotos(c.env.GALERIE_DATA)
    console.log(`📸 ${photos.length} photos récupérées`)
    return c.json(photos)
  } catch (error) {
    console.error('❌ Erreur récupération photos:', error)
    return c.json({ error: 'Erreur serveur' }, 500)
  }
})

// POST /photos - Ajouter une photo
app.post('/photos', async (c) => {
  try {
    const photoData = await c.req.json()
    
    // Validation
    if (!photoData.titre || !photoData.categorie || !photoData.src) {
      return c.json({ error: 'Données manquantes' }, 400)
    }
    
    // Récupérer photos existantes
    const photos = await getPhotos(c.env.GALERIE_DATA)
    
    // Ajouter la nouvelle photo
    const nouvellePhoto = {
      id: photoData.id || Date.now(),
      titre: photoData.titre.trim(),
      description: photoData.description?.trim() || '',
      categorie: photoData.categorie.toLowerCase().trim(),
      src: photoData.src,
      dateAjout: photoData.dateAjout || new Date().toLocaleDateString('fr-FR'),
      vues: photoData.vues || 0
    }
    
    photos.push(nouvellePhoto)
    
    // Sauvegarder
    await savePhotos(c.env.GALERIE_DATA, photos)
    
    console.log(`✅ Photo "${nouvellePhoto.titre}" ajoutée (catégorie: ${nouvellePhoto.categorie})`)
    return c.json({ 
      success: true, 
      photo: nouvellePhoto,
      totalPhotos: photos.length
    })
    
  } catch (error) {
    console.error('❌ Erreur ajout photo:', error)
    return c.json({ error: 'Erreur serveur' }, 500)
  }
})

// DELETE /photos/:id - Supprimer une photo
app.delete('/photos/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const photos = await getPhotos(c.env.GALERIE_DATA)
    
    const photoIndex = photos.findIndex(p => p.id.toString() === id)
    if (photoIndex === -1) {
      return c.json({ error: 'Photo introuvable' }, 404)
    }
    
    const photoSupprimee = photos[photoIndex]
    photos.splice(photoIndex, 1)
    
    await savePhotos(c.env.GALERIE_DATA, photos)
    
    console.log(`🗑️ Photo "${photoSupprimee.titre}" supprimée`)
    return c.json({ 
      success: true, 
      message: 'Photo supprimée',
      totalPhotos: photos.length
    })
    
  } catch (error) {
    console.error('❌ Erreur suppression photo:', error)
    return c.json({ error: 'Erreur serveur' }, 500)
  }
})

// DELETE /photos/clear - Vider toute la galerie
app.delete('/photos/clear', async (c) => {
  try {
    await savePhotos(c.env.GALERIE_DATA, [])
    console.log('🧹 Galerie vidée')
    return c.json({ 
      success: true, 
      message: 'Galerie vidée',
      totalPhotos: 0
    })
  } catch (error) {
    console.error('❌ Erreur vidage galerie:', error)
    return c.json({ error: 'Erreur serveur' }, 500)
  }
})

// GET /categories - Récupérer toutes les catégories
app.get('/categories', async (c) => {
  try {
    const categories = await getCategories(c.env.GALERIE_DATA)
    console.log(`📂 ${categories.length} catégories récupérées`)
    return c.json(categories)
  } catch (error) {
    console.error('❌ Erreur récupération catégories:', error)
    return c.json({ error: 'Erreur serveur' }, 500)
  }
})

// POST /categories - Ajouter une catégorie
app.post('/categories', async (c) => {
  try {
    const { nom } = await c.req.json()
    
    if (!nom || typeof nom !== 'string') {
      return c.json({ error: 'Nom de catégorie invalide' }, 400)
    }
    
    const nomNormalise = nom.toLowerCase().trim()
    const categories = await getCategories(c.env.GALERIE_DATA)
    
    if (categories.includes(nomNormalise)) {
      return c.json({ error: 'Catégorie déjà existante' }, 400)
    }
    
    categories.push(nomNormalise)
    await saveCategories(c.env.GALERIE_DATA, categories)
    
    console.log(`✅ Catégorie "${nomNormalise}" ajoutée`)
    return c.json({ 
      success: true, 
      categorie: nomNormalise,
      totalCategories: categories.length
    })
    
  } catch (error) {
    console.error('❌ Erreur ajout catégorie:', error)
    return c.json({ error: 'Erreur serveur' }, 500)
  }
})

// DELETE /categories/:nom - Supprimer une catégorie
app.delete('/categories/:nom', async (c) => {
  try {
    const nom = decodeURIComponent(c.req.param('nom')).toLowerCase().trim()
    const categories = await getCategories(c.env.GALERIE_DATA)
    
    const index = categories.indexOf(nom)
    if (index === -1) {
      return c.json({ error: 'Catégorie introuvable' }, 404)
    }
    
    // Vérifier s'il y a des photos dans cette catégorie
    const photos = await getPhotos(c.env.GALERIE_DATA)
    const photosCategorie = photos.filter(p => p.categorie === nom)
    
    if (photosCategorie.length > 0) {
      return c.json({ 
        error: `Impossible de supprimer la catégorie "${nom}" : ${photosCategorie.length} photo(s) l'utilisent`
      }, 400)
    }
    
    categories.splice(index, 1)
    await saveCategories(c.env.GALERIE_DATA, categories)
    
    console.log(`🗑️ Catégorie "${nom}" supprimée`)
    return c.json({ 
      success: true, 
      message: 'Catégorie supprimée',
      totalCategories: categories.length
    })
    
  } catch (error) {
    console.error('❌ Erreur suppression catégorie:', error)
    return c.json({ error: 'Erreur serveur' }, 500)
  }
})

// GET /stats - Statistiques de la galerie
app.get('/stats', async (c) => {
  try {
    const photos = await getPhotos(c.env.GALERIE_DATA)
    const categories = await getCategories(c.env.GALERIE_DATA)
    
    const stats = {
      totalPhotos: photos.length,
      totalCategories: categories.length,
      categoriesAvecPhotos: categories.filter(cat => 
        photos.some(p => p.categorie === cat)
      ).length,
      dernierePhoto: photos.length > 0 ? 
        photos[photos.length - 1].dateAjout : null,
      photosParCategorie: categories.reduce((acc, cat) => {
        acc[cat] = photos.filter(p => p.categorie === cat).length
        return acc
      }, {} as Record<string, number>)
    }
    
    return c.json(stats)
    
  } catch (error) {
    console.error('❌ Erreur récupération stats:', error)
    return c.json({ error: 'Erreur serveur' }, 500)
  }
})

// GET /photos/by-category/:category - Photos par catégorie
app.get('/photos/by-category/:category', async (c) => {
  try {
    const category = decodeURIComponent(c.req.param('category')).toLowerCase().trim()
    const photos = await getPhotos(c.env.GALERIE_DATA)
    
    const photosCategorie = photos.filter(p => p.categorie === category)
    
    console.log(`📸 ${photosCategorie.length} photos trouvées pour la catégorie "${category}"`)
    return c.json(photosCategorie)
    
  } catch (error) {
    console.error('❌ Erreur récupération photos par catégorie:', error)
    return c.json({ error: 'Erreur serveur' }, 500)
  }
})

// PUT /photos/:id - Mettre à jour une photo
app.put('/photos/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const updates = await c.req.json()
    const photos = await getPhotos(c.env.GALERIE_DATA)
    
    const photoIndex = photos.findIndex(p => p.id.toString() === id)
    if (photoIndex === -1) {
      return c.json({ error: 'Photo introuvable' }, 404)
    }
    
    // Mettre à jour les champs modifiables
    const photo = photos[photoIndex]
    if (updates.titre) photo.titre = updates.titre.trim()
    if (updates.description !== undefined) photo.description = updates.description.trim()
    if (updates.categorie) photo.categorie = updates.categorie.toLowerCase().trim()
    
    await savePhotos(c.env.GALERIE_DATA, photos)
    
    console.log(`✏️ Photo "${photo.titre}" mise à jour`)
    return c.json({ 
      success: true, 
      photo: photo
    })
    
  } catch (error) {
    console.error('❌ Erreur mise à jour photo:', error)
    return c.json({ error: 'Erreur serveur' }, 500)
  }
})

export default app