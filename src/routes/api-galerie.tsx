import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

// Activer CORS
app.use('/api/*', cors())

// Stockage en mémoire (temporaire pour cette démo)
// En production, utiliser une vraie base de données
let photosStorage: any[] = []
let categoriesStorage: string[] = ['ateliers', 'sorties', 'fetes', 'portraits', 'activites', 'evenements']

// Photos de démonstration par défaut
const photosDemo = [
    {
        id: 1,
        titre: "Atelier Écriture Créative",
        description: "Séance d'écriture collective avec nos membres",
        categorie: "ateliers",
        src: "/static/photo-enfant-ecriture.jpg",
        dateAjout: "20/10/2024",
        vues: 45
    },
    {
        id: 2,
        titre: "Marie Cappello - Présidente",
        description: "Portrait officiel de notre présidente",
        categorie: "portraits",
        src: "/static/photo-marie-cappello.jpg",
        dateAjout: "15/10/2024",
        vues: 123
    },
    {
        id: 3,
        titre: "Atelier Créatif Intergénérationnel",
        description: "Partage entre générations lors de nos ateliers",
        categorie: "ateliers",
        src: "/static/photo-atelier-creatif.jpg",
        dateAjout: "18/10/2024",
        vues: 67
    },
    {
        id: 4,
        titre: "Nos Petits Héros",
        description: "Groupe d'enfants joyeux de l'association",
        categorie: "portraits",
        src: "/static/photo-groupe-enfants.jpg",
        dateAjout: "12/10/2024",
        vues: 98
    },
    {
        id: 5,
        titre: "Sport & Bien-être",
        description: "Activités physiques adaptées à tous",
        categorie: "activites",
        src: "/static/photo-activite-sport.jpg",
        dateAjout: "10/10/2024",
        vues: 89
    },
    {
        id: 6,
        titre: "Danse et Mouvement",
        description: "Expression corporelle et créativité",
        categorie: "activites",
        src: "/static/photo-danse-mouvement.jpg",
        dateAjout: "08/10/2024",
        vues: 76
    },
    {
        id: 7,
        titre: "Moments de Joie",
        description: "Célébration communautaire pleine de bonheur",
        categorie: "fetes",
        src: "/static/photo-celebration-joie.jpg",
        dateAjout: "05/10/2024",
        vues: 145
    }
]

// Initialiser avec les photos de démo si vide
if (photosStorage.length === 0) {
    photosStorage = [...photosDemo]
}

// GET /api/photos - Récupérer toutes les photos
app.get('/photos', (c) => {
    return c.json({
        success: true,
        photos: photosStorage,
        count: photosStorage.length
    })
})

// GET /api/categories - Récupérer toutes les catégories
app.get('/categories', (c) => {
    return c.json({
        success: true,
        categories: categoriesStorage
    })
})

// POST /api/photos - Ajouter une photo
app.post('/photos', async (c) => {
    try {
        const data = await c.req.json()
        const { titre, description, categorie, src } = data
        
        if (!titre || !src) {
            return c.json({ 
                success: false, 
                error: 'Titre et image requis' 
            }, 400)
        }
        
        const nouvellePhoto = {
            id: Date.now(),
            titre: titre.trim(),
            description: description?.trim() || '',
            categorie: categorie || 'ateliers',
            src: src,
            dateAjout: new Date().toLocaleDateString('fr-FR'),
            vues: Math.floor(Math.random() * 50) + 10
        }
        
        photosStorage.push(nouvellePhoto)
        
        return c.json({
            success: true,
            photo: nouvellePhoto,
            message: 'Photo ajoutée avec succès'
        })
    } catch (error) {
        return c.json({ 
            success: false, 
            error: 'Erreur lors de l\'ajout de la photo' 
        }, 500)
    }
})

// DELETE /api/photos/:id - Supprimer une photo
app.delete('/photos/:id', (c) => {
    try {
        const id = parseInt(c.req.param('id'))
        const index = photosStorage.findIndex(photo => photo.id === id)
        
        if (index === -1) {
            return c.json({ 
                success: false, 
                error: 'Photo non trouvée' 
            }, 404)
        }
        
        const photoSupprimee = photosStorage.splice(index, 1)[0]
        
        return c.json({
            success: true,
            message: 'Photo supprimée',
            photo: photoSupprimee
        })
    } catch (error) {
        return c.json({ 
            success: false, 
            error: 'Erreur lors de la suppression' 
        }, 500)
    }
})

// POST /api/categories - Ajouter une catégorie
app.post('/categories', async (c) => {
    try {
        const data = await c.req.json()
        const { nom } = data
        
        if (!nom) {
            return c.json({ 
                success: false, 
                error: 'Nom de catégorie requis' 
            }, 400)
        }
        
        const nomNormalise = nom.toLowerCase().trim()
        
        if (categoriesStorage.includes(nomNormalise)) {
            return c.json({ 
                success: false, 
                error: 'Cette catégorie existe déjà' 
            }, 400)
        }
        
        categoriesStorage.push(nomNormalise)
        
        return c.json({
            success: true,
            categories: categoriesStorage,
            message: 'Catégorie ajoutée'
        })
    } catch (error) {
        return c.json({ 
            success: false, 
            error: 'Erreur lors de l\'ajout' 
        }, 500)
    }
})

// DELETE /api/categories/:nom - Supprimer une catégorie
app.delete('/categories/:nom', (c) => {
    try {
        const nom = c.req.param('nom')
        const index = categoriesStorage.findIndex(cat => cat === nom)
        
        if (index === -1) {
            return c.json({ 
                success: false, 
                error: 'Catégorie non trouvée' 
            }, 404)
        }
        
        categoriesStorage.splice(index, 1)
        
        return c.json({
            success: true,
            categories: categoriesStorage,
            message: 'Catégorie supprimée'
        })
    } catch (error) {
        return c.json({ 
            success: false, 
            error: 'Erreur lors de la suppression' 
        }, 500)
    }
})

// DELETE /api/photos - Vider toute la galerie
app.delete('/photos', (c) => {
    photosStorage = []
    return c.json({
        success: true,
        message: 'Galerie vidée'
    })
})

// GET /api/stats - Statistiques de la galerie
app.get('/stats', (c) => {
    const stats = categoriesStorage.reduce((acc, cat) => {
        acc[cat] = photosStorage.filter(photo => photo.categorie === cat).length
        return acc
    }, {} as Record<string, number>)
    
    return c.json({
        success: true,
        totalPhotos: photosStorage.length,
        totalCategories: categoriesStorage.length,
        parCategorie: stats
    })
})

export default app