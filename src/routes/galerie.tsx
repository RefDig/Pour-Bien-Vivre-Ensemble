import { Hono } from 'hono'
import { Layout } from '../components/Layout'

const app = new Hono()

// Nouvelles catégories étendues pour la galerie
const galleryCategories = [
  { 
    id: 'ateliers', 
    label: 'Ateliers', 
    icon: 'fas fa-palette', 
    color: 'blue',
    description: 'Ateliers créatifs, cuisine, écriture et activités manuelles'
  },
  { 
    id: 'sorties', 
    label: 'Sorties', 
    icon: 'fas fa-walking', 
    color: 'green',
    description: 'Balades, visites culturelles et sorties découverte'
  },
  { 
    id: 'fetes', 
    label: 'Fêtes', 
    icon: 'fas fa-birthday-cake', 
    color: 'pink',
    description: 'Célébrations, anniversaires et moments festifs'
  },
  { 
    id: 'portraits', 
    label: 'Portraits', 
    icon: 'fas fa-user-friends', 
    color: 'purple',
    description: 'Portraits des membres et bénévoles de PBVE'
  },
  { 
    id: 'activites', 
    label: 'Activités', 
    icon: 'fas fa-running', 
    color: 'orange',
    description: 'Sport, bien-être et activités physiques'
  },
  { 
    id: 'evenements', 
    label: 'Événements', 
    icon: 'fas fa-calendar-star', 
    color: 'red',
    description: 'Grands événements et manifestations spéciales'
  }
]

// Photos avec espaces réservés pour le téléversement futur
const mockPhotos = [
  // Ateliers
  {
    id: 1,
    category: 'ateliers',
    title: 'Atelier Écriture Créative',
    description: 'Séance d\'écriture collective avec les participants',
    imageUrl: '/static/photo-enfant-ecriture.jpg',
    uploadedBy: 'Marie Cappello',
    date: '2024-10-01',
    views: 45
  },
  {
    id: 2,
    category: 'ateliers',
    title: 'Atelier Créatif Intergénérationnel',
    description: 'Moment de partage entre générations',
    imageUrl: '/static/photo-atelier-creatif.jpg',
    uploadedBy: 'Marie Cappello',
    date: '2024-09-28',
    views: 67
  },
  // Portraits
  {
    id: 3,
    category: 'portraits',
    title: 'Marie Cappello - Présidente',
    description: 'Portrait officiel de la présidente de PBVE',
    imageUrl: '/static/photo-marie-cappello.jpg',
    uploadedBy: 'Photographe PBVE',
    date: '2024-09-15',
    views: 123
  },
  // Activités
  {
    id: 4,
    category: 'activites',
    title: 'Séance Sport & Bien-être',
    description: 'Activité physique adaptée pour tous',
    imageUrl: '/static/photo-activite-sport.jpg',
    uploadedBy: 'Coach PBVE',
    date: '2024-09-20',
    views: 89
  },
  {
    id: 5,
    category: 'activites',
    title: 'Mouvement et Danse',
    description: 'Atelier expression corporelle',
    imageUrl: '/static/photo-danse-mouvement.jpg',
    uploadedBy: 'Animateur Danse',
    date: '2024-09-25',
    views: 76
  },
  // Fêtes
  {
    id: 6,
    category: 'fetes',
    title: 'Moments de Joie Partagée',
    description: 'Célébration communautaire',
    imageUrl: '/static/photo-celebration-joie.jpg',
    uploadedBy: 'Marie Cappello',
    date: '2024-09-12',
    views: 145
  },
  // Portraits groupe
  {
    id: 7,
    category: 'portraits',
    title: 'Nos Petits Héros',
    description: 'Groupe joyeux d\'enfants participants',
    imageUrl: '/static/photo-groupe-enfants.jpg',
    uploadedBy: 'Animateur Jeunesse',
    date: '2024-09-08',
    views: 98
  }
]

// Créer des espaces réservés pour chaque catégorie
const createPlaceholderSpaces = (category: string, count: number = 8) => {
  const existing = mockPhotos.filter(photo => photo.category === category).length
  const placeholders = []
  
  for (let i = existing; i < count; i++) {
    placeholders.push({
      id: `placeholder_${category}_${i}`,
      category,
      title: 'Espace Réservé',
      description: 'Emplacement pour vos futures photos',
      imageUrl: '/static/placeholder-photo.png', // Image placeholder générique
      isPlaceholder: true,
      uploadedBy: 'Admin',
      date: new Date().toISOString().split('T')[0],
      views: 0
    })
  }
  
  return placeholders
}

// Page principale de la galerie
app.get('/', (c) => {
  const selectedCategory = c.req.query('category') || ''
  
  // Ajouter des espaces réservés pour chaque catégorie
  const allPhotos = [
  ...((mockPhotos ?? [])),
  ...((galleryCategories ?? []).flatMap(cat => createPlaceholderSpaces(cat.id, 6)))
  ]
  
  const filteredPhotos = selectedCategory 
  ? (allPhotos ?? []).filter(photo => photo.category === selectedCategory)
  : (allPhotos ?? [])

  const featuredPhoto = (mockPhotos ?? []).find(photo => photo.id === 3) // Marie Cappello en vedette

  return c.html(
    <Layout title="Galerie Photo - Pour Bien Vivre Ensemble" currentPath="/galerie">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header de la galerie */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <i className="fas fa-camera mr-4"></i>
                Notre Galerie Photo
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                Découvrez la vie de l'association à travers nos moments partagés
              </p>
              <div className="flex items-center justify-center text-lg">
                <i className="fas fa-images mr-2"></i>
                <span>{(allPhotos ?? []).filter(p => typeof p.id === 'number').length} photos • {(galleryCategories ?? []).length} catégories</span>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation par catégories - Optimisée mobile */}
        <section className="py-8 bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Desktop Navigation */}
            <div className="hidden md:flex flex-wrap justify-center gap-4 mb-6">
              <a 
                href="/galerie"
                className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  !selectedCategory 
                    ? 'bg-indigo-500 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700'
                }`}
              >
                <i className="fas fa-th-large mr-2"></i>
                Toutes
                <span className="ml-2 bg-white bg-opacity-20 text-xs px-2 py-1 rounded-full">
                  {(allPhotos ?? []).filter(p => typeof p.id === 'number').length}
                </span>
              </a>
              {(galleryCategories ?? []).map(category => {
                const count = (mockPhotos ?? []).filter(p => p.category === category.id).length
                return (
                  <a 
                    key={category.id}
                    href={`/galerie?category=${category.id}`}
                    className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === category.id 
                        ? 'bg-indigo-500 text-white shadow-lg' 
                        : 'bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700'
                    }`}
                  >
                    <i className={`${category.icon} mr-2`}></i>
                    {category.label}
                    <span className="ml-2 bg-white bg-opacity-20 text-xs px-2 py-1 rounded-full">
                      {count}
                    </span>
                  </a>
                )
              })}
            </div>

            {/* Mobile Navigation - Dropdown */}
            <div className="md:hidden">
              <select 
                onChange="window.location.href = this.value" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="/galerie" selected={!selectedCategory}>
                  📸 Toutes les photos ({(allPhotos ?? []).filter(p => typeof p.id === 'number').length})
                </option>
                {(galleryCategories ?? []).map(category => {
                  const count = (mockPhotos ?? []).filter(p => p.category === category.id).length
                  return (
                    <option 
                      key={category.id}
                      value={`/galerie?category=${category.id}`}
                      selected={selectedCategory === category.id}
                    >
                      {category.label} ({count})
                    </option>
                  )
                })}
              </select>
            </div>
          </div>
        </section>

        {/* Photo en vedette (uniquement sur la vue "Toutes") */}
        {!selectedCategory && featuredPhoto && (
          <section className="py-12 bg-gradient-to-br from-yellow-50 to-orange-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  <i className="fas fa-star text-yellow-500 mr-2"></i>
                  Photo En Vedette
                </h2>
              </div>
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <img 
                      src={featuredPhoto.imageUrl}
                      alt={featuredPhoto.title}
                      className="w-full h-64 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-1/2 p-8">
                    <div className="flex items-center mb-4">
                      <span className="bg-purple-100 text-purple-800 text-xs font-medium px-3 py-1 rounded-full">
                        {galleryCategories.find(c => c.id === featuredPhoto.category)?.label}
                      </span>
                      <span className="ml-3 text-sm text-gray-500">{featuredPhoto.date}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{featuredPhoto.title}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{featuredPhoto.description}</p>
                    <div className="flex items-center text-sm text-gray-500 mb-6">
                      <i className="fas fa-user mr-2"></i>
                      <span className="mr-4">{featuredPhoto.uploadedBy}</span>
                      <i className="fas fa-eye mr-2"></i>
                      <span>{featuredPhoto.views} vues</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Description de la catégorie sélectionnée */}
        {selectedCategory && (
          <section className="py-8 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {(() => {
                const category = galleryCategories.find(c => c.id === selectedCategory)
                if (!category) return null
                return (
                  <div className="text-center">
                    <div className={`w-16 h-16 bg-${category.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <i className={`${category.icon} text-2xl text-${category.color}-600`}></i>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">{category.label}</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">{category.description}</p>
                  </div>
                )
              })()}
            </div>
          </section>
        )}

        {/* Grille de photos - Responsive et optimisée */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {selectedCategory 
                  ? `${galleryCategories.find(c => c.id === selectedCategory)?.label || 'Catégorie'}`
                  : 'Toutes Nos Photos'
                }
              </h2>
              <p className="text-gray-600">
                {(filteredPhotos ?? []).filter(p => typeof p.id === 'number').length} photos disponibles
                {(filteredPhotos ?? []).filter(p => typeof p.id === 'string' && p.id.startsWith('placeholder_')).length > 0 && 
                  ` • ${(filteredPhotos ?? []).filter(p => typeof p.id === 'string' && p.id.startsWith('placeholder_')).length} emplacements réservés`
                }
              </p>
            </div>

            {/* Grille responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {(filteredPhotos ?? []).map((photo, index) => (
                <div 
                  key={photo.id}
                  className={`group cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                    typeof photo.id === 'string' && photo.id.startsWith('placeholder_')
                      ? 'opacity-50 hover:opacity-75' 
                      : 'hover:shadow-xl'
                  }`}
                >
                  <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                    <div className="relative aspect-square overflow-hidden">
                      <img 
                        src={typeof photo.id === 'string' && photo.id.startsWith('placeholder_') ? '/static/placeholder-upload.svg' : photo.imageUrl}
                        alt={photo.title}
                        className={`w-full h-full object-cover transition-transform duration-500 ${
                          typeof photo.id === 'string' && photo.id.startsWith('placeholder_')
                            ? 'filter grayscale' 
                            : 'group-hover:scale-110'
                        }`}
                        loading="lazy"
                      />
                      {photo.isPlaceholder ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-90">
                          <div className="text-center text-gray-500">
                            <i className="fas fa-cloud-upload-alt text-3xl mb-2"></i>
                            <p className="text-sm font-medium">Espace Réservé</p>
                            <p className="text-xs">Vos futures photos</p>
                          </div>
                        </div>
                      ) : (
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center">
                          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                            <button className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium">
                              <i className="fas fa-expand mr-2"></i>
                              Voir
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 className={`font-semibold text-gray-900 mb-1 text-sm md:text-base ${
                        photo.isPlaceholder ? 'text-gray-500' : ''
                      }`}>
                        {photo.title}
                      </h3>
                      <p className={`text-xs md:text-sm mb-2 line-clamp-2 ${
                        photo.isPlaceholder ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {photo.description}
                      </p>
                      {!photo.isPlaceholder && (
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{photo.uploadedBy}</span>
                          <div className="flex items-center">
                            <i className="fas fa-eye mr-1"></i>
                            {photo.views}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message d'encouragement pour l'upload */}
            <div className="mt-12 text-center">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 max-w-2xl mx-auto">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-camera text-2xl text-indigo-600"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Votre galerie vous attend !
                </h3>
                <p className="text-gray-600 mb-6">
                  Des espaces sont réservés dans chaque catégorie pour recevoir vos photos authentiques. 
                  Connectez-vous à l'espace administrateur pour téléverser vos images.
                </p>
                <a 
                  href="/admin/realisations/login"
                  className="inline-flex items-center bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                  <i className="fas fa-key mr-2"></i>
                  Accès Administrateur
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
})

export default app