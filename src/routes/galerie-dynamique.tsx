import { Hono } from 'hono'

const app = new Hono()

// Galerie qui affiche les photos ajoutées via l'admin
app.get('/', (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Galerie Photo - Pour Bien Vivre Ensemble</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50 font-sans">
    <!-- Header avec navigation -->
    <header class="bg-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center py-4">
                <div class="flex items-center space-x-3">
                    <div class="flex-shrink-0">
                        <img 
                            src="/static/logo-pbve-authentique.png" 
                            alt="Logo Pour Bien Vivre Ensemble - PBVE" 
                            class="w-16 h-16 md:w-20 md:h-20 rounded-full shadow-md"
                        />
                    </div>
                    <div class="hidden md:block">
                        <h1 class="text-xl font-bold text-blue-600">Pour Bien Vivre Ensemble</h1>
                        <p class="text-sm font-medium text-amber-700">Association Lille Sud</p>
                    </div>
                </div>
                
                <!-- Navigation -->
                <nav class="hidden md:flex space-x-6">
                    <a href="/" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                        <i class="fas fa-home mr-1"></i> Accueil
                    </a>
                    <a href="/a-propos" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                        <i class="fas fa-users mr-1"></i> À propos
                    </a>
                    <a href="/nos-realisations" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                        <i class="fas fa-star mr-1"></i> Réalisations
                    </a>
                    <a href="/galerie" class="bg-blue-100 text-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                        <i class="fas fa-camera mr-1"></i> Galerie
                    </a>
                    <a href="/actualites" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                        <i class="fab fa-facebook mr-1"></i> Actualités
                    </a>
                    <a href="/contact" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                        <i class="fas fa-envelope mr-1"></i> Contact
                    </a>
                </nav>

                <!-- Boutons Admin -->
                <div class="flex items-center space-x-4">
                    <a href="/admin/galerie-fonctionnelle" class="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors text-sm">
                        <i class="fas fa-cog mr-1"></i> Gérer Photos
                    </a>
                    <a href="/nos-realisations" class="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm">
                        <i class="fas fa-star mr-1"></i> Réalisations
                    </a></div>
                    
                    <!-- Menu mobile -->
                    <div class="md:hidden">
                        <button type="button" class="text-gray-700 hover:text-blue-600" onclick="toggleMobileMenu()">
                            <i class="fas fa-bars text-lg"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Menu mobile -->
            <div id="mobile-menu" class="md:hidden hidden pb-4">
                <div class="space-y-1">
                    <a href="/" class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600">
                        <i class="fas fa-home mr-2"></i> Accueil
                    </a>
                    <a href="/a-propos" class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600">
                        <i class="fas fa-users mr-2"></i> À propos
                    </a>
                    <a href="/nos-realisations" class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600">
                        <i class="fas fa-star mr-2"></i> Réalisations
                    </a>
                    <a href="/galerie" class="block px-3 py-2 text-base font-medium bg-blue-100 text-blue-700">
                        <i class="fas fa-camera mr-2"></i> Galerie
                    </a>
                    <a href="/actualites" class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600">
                        <i class="fab fa-facebook mr-2"></i> Actualités
                    </a>
                    <a href="/contact" class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600">
                        <i class="fas fa-envelope mr-2"></i> Contact
                    </a>
                    <a href="/admin/galerie-fonctionnelle" class="block px-3 py-2 text-base font-medium bg-green-600 text-white rounded-md">
                        <i class="fas fa-cog mr-2"></i> Gérer Photos
                    </a>
                    <a href="/nos-realisations" class="block px-3 py-2 text-base font-medium bg-blue-600 text-white rounded-md">
                        <i class="fas fa-star mr-2"></i> Réalisations
                    </a>
                </div>
            </div>
        </div>
    </header>

    <!-- Contenu principal -->
    <main class="min-h-screen">
        <!-- Hero section -->
        <section class="bg-gradient-to-r from-purple-600 to-pink-700 text-white py-20">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 class="text-4xl md:text-5xl font-bold mb-6">
                    <i class="fas fa-camera mr-4"></i>
                    Notre Galerie Photo
                </h1>
                <p class="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                    Découvrez la vie de l'association à travers nos moments partagés
                </p>
                <p class="text-lg">
                    <i class="fas fa-images mr-2"></i>
                    <span id="totalPhotos">0</span> photos • <span id="totalCategories">0</span> catégories
                </p>
            </div>
        </section>

        <!-- Navigation catégories -->
        <section class="py-8 bg-white shadow-sm">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex flex-wrap justify-center gap-4" id="categoriesNav">
                    <!-- Catégories générées dynamiquement -->
                </div>
            </div>
        </section>

        <!-- Photos en vedette -->
        <section class="py-12 bg-gradient-to-br from-yellow-50 to-orange-50" id="featuredSection">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-8">
                    <h2 class="text-3xl font-bold text-gray-900 mb-4">
                        <i class="fas fa-star text-yellow-500 mr-2"></i>
                        Photos Récentes
                    </h2>
                </div>
                <div id="featuredPhotos">
                    <!-- Photos en vedette -->
                </div>
            </div>
        </section>

        <!-- Grille de toutes les photos -->
        <section class="py-16 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-8">
                    <h2 class="text-2xl font-bold text-gray-900 mb-4">Toutes Nos Photos</h2>
                    <p class="text-gray-600"><span id="visiblePhotos">0</span> photos visibles</p>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" id="photo-grid">
                    <!-- Photos générées dynamiquement -->
                </div>

                <!-- Message si aucune photo -->
                <div id="emptyGallery" class="text-center py-16 hidden">
                    <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 max-w-2xl mx-auto">
                        <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-camera text-2xl text-blue-600"></i>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-3">
                            Galerie en cours de construction
                        </h3>
                        <p class="text-gray-600 mb-6">
                            Cette galerie sera bientôt remplie de nos plus beaux moments !
                        </p>
                        <a 
                            href="/admin/galerie-fonctionnelle"
                            class="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                        >
                            <i class="fas fa-plus mr-2"></i>
                            Ajouter des Photos
                        </a>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="grid md:grid-cols-3 gap-8">
                <div>
                    <div class="flex items-center space-x-3 mb-4">
                        <img src="/static/logo-pbve-authentique.png" alt="Logo PBVE" class="w-10 h-10 rounded-full"/>
                        <h3 class="text-lg font-semibold">Pour Bien Vivre Ensemble</h3>
                    </div>
                    <p class="text-gray-400 text-sm">
                        Une association dédiée au renforcement des liens sociaux et à la promotion 
                        de la solidarité dans notre communauté de Lille Sud.
                    </p>
                </div>
                <div>
                    <h3 class="text-lg font-semibold mb-4">Contact</h3>
                    <div class="space-y-2 text-sm text-gray-400">
                        <div class="flex items-center space-x-2">
                            <i class="fas fa-envelope"></i>
                            <span>contact@pourbienvivreensemble.fr</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <i class="fas fa-phone"></i>
                            <span>01 23 45 67 89</span>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 class="text-lg font-semibold mb-4">Suivez-nous</h3>
                    <div class="flex space-x-4">
                        <a href="https://www.facebook.com/pourbienvivreensemble" target="_blank" 
                           class="text-gray-400 hover:text-blue-400 transition-colors">
                            <i class="fab fa-facebook-f text-xl"></i>
                        </a>
                    </div>
                </div>
            </div>
            <div class="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
                <p>© 2024 Pour Bien Vivre Ensemble. Tous droits réservés.</p>
            </div>
        </div>
    </footer>

    <!-- Lightbox -->
    <div id="lightbox" class="fixed inset-0 bg-black bg-opacity-90 z-50 hidden flex items-center justify-center" onclick="closeLightbox()">
        <div class="max-w-4xl max-h-full p-4">
            <img id="lightbox-img" src="" alt="" class="max-w-full max-h-full object-contain" />
            <div class="text-white text-center mt-4">
                <h3 id="lightbox-title" class="text-xl font-semibold mb-2"></h3>
                <p id="lightbox-description" class="text-gray-300 mb-2"></p>
                <p id="lightbox-category" class="text-sm text-gray-400"></p>
            </div>
            <button onclick="closeLightbox()" class="absolute top-4 right-4 text-white text-3xl hover:text-gray-300">
                <i class="fas fa-times"></i>
            </button>
        </div>
    </div>

    <script>
        let photos = [];
        let categories = [];
        let currentFilter = 'all';

        // Charger les données depuis l'API
        async function chargerDonnees() {
            try {
                // Charger les photos
                const responsePhotos = await fetch('/api/galerie/photos');
                const dataPhotos = await responsePhotos.json();
                if (dataPhotos.success) {
                    photos = dataPhotos.photos;
                }
                
                // Charger les catégories
                const responseCategories = await fetch('/api/galerie/categories');
                const dataCategories = await responseCategories.json();
                if (dataCategories.success) {
                    categories = dataCategories.categories;
                }
                
                afficherTout();
            } catch (error) {
                console.error('Erreur lors du chargement:', error);
                
                // Fallback vers localStorage
                const photosStockees = localStorage.getItem('pbve_photos');
                const categoriesStockees = localStorage.getItem('pbve_categories');
                
                if (photosStockees) {
                    photos = JSON.parse(photosStockees);
                }
                
                if (categoriesStockees) {
                    categories = JSON.parse(categoriesStockees);
                } else {
                    categories = ['ateliers', 'sorties', 'fetes', 'portraits', 'activites', 'evenements'];
                }
                
                // Ajouter des photos de démonstration si aucune photo n'existe
                if (photos.length === 0) {
                    ajouterPhotosDemonstration();
                }
                
                afficherTout();
            }
        }

        // Photos de démonstration
        function ajouterPhotosDemonstration() {
            const photosDemos = [
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
            ];

            photos = photosDemos;
            localStorage.setItem('pbve_photos', JSON.stringify(photos));
        }

        // Navigation mobile
        function toggleMobileMenu() {
            const menu = document.getElementById('mobile-menu');
            menu.classList.toggle('hidden');
        }

        // Générer les catégories de navigation
        function genererNavigationCategories() {
            const nav = document.getElementById('categoriesNav');
            const totalCategories = document.getElementById('totalCategories');
            
            // Compter les photos par catégorie
            const compteur = {};
            categories.forEach(cat => compteur[cat] = 0);
            photos.forEach(photo => {
                if (compteur[photo.categorie] !== undefined) {
                    compteur[photo.categorie]++;
                }
            });
            
            totalCategories.textContent = categories.length;
            
            let navHTML = \`
                <button onclick="filterGallery('all')" class="category-filter \${currentFilter === 'all' ? 'active bg-purple-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-purple-100 hover:text-purple-700'} px-4 py-2 rounded-full text-sm font-medium transition-all">
                    <i class="fas fa-th-large mr-2"></i>
                    Toutes (\${photos.length})
                </button>
            \`;
            
            categories.forEach(cat => {
                const count = compteur[cat] || 0;
                const isActive = currentFilter === cat;
                navHTML += \`
                    <button onclick="filterGallery('\${cat}')" class="category-filter \${isActive ? 'active bg-purple-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-purple-100 hover:text-purple-700'} px-4 py-2 rounded-full text-sm font-medium transition-all capitalize">
                        <i class="fas fa-\${getIconeCategorie(cat)} mr-2"></i>
                        \${cat} (\${count})
                    </button>
                \`;
            });
            
            nav.innerHTML = navHTML;
        }

        // Obtenir l'icône pour chaque catégorie
        function getIconeCategorie(categorie) {
            const icones = {
                'ateliers': 'palette',
                'sorties': 'walking',
                'fetes': 'birthday-cake',
                'portraits': 'user-friends',
                'activites': 'running',
                'evenements': 'calendar-alt'
            };
            return icones[categorie] || 'image';
        }

        // Afficher les photos en vedette
        function afficherPhotosVedette() {
            const container = document.getElementById('featuredPhotos');
            const photosRecentes = [...photos].sort((a, b) => 
                new Date(b.dateAjout.split('/').reverse().join('-')) - 
                new Date(a.dateAjout.split('/').reverse().join('-'))
            ).slice(0, 3);
            
            if (photosRecentes.length === 0) {
                document.getElementById('featuredSection').style.display = 'none';
                return;
            }
            
            document.getElementById('featuredSection').style.display = 'block';
            
            container.innerHTML = (photosRecentes ?? []).map(photo => \`
                <div class="bg-white rounded-2xl shadow-xl overflow-hidden mb-6 cursor-pointer" onclick="openLightbox('\${photo.src}', '\${photo.titre}', '\${photo.description}', '\${photo.categorie}')">
                    <div class="md:flex">
                        <div class="md:w-1/2">
                            <img 
                                src="\${photo.src}" 
                                alt="\${photo.titre}" 
                                class="w-full h-64 md:h-full object-cover"
                            />
                        </div>
                        <div class="md:w-1/2 p-8">
                            <div class="flex items-center mb-4">
                                <span class="bg-purple-100 text-purple-800 text-xs font-medium px-3 py-1 rounded-full capitalize">
                                    \${photo.categorie}
                                </span>
                                <span class="ml-3 text-sm text-gray-500">\${photo.dateAjout}</span>
                            </div>
                            <h3 class="text-2xl font-bold text-gray-900 mb-4">\${photo.titre}</h3>
                            <p class="text-gray-600 mb-6 leading-relaxed">
                                \${photo.description}
                            </p>
                            <div class="flex items-center text-sm text-gray-500">
                                <i class="fas fa-eye mr-2"></i>
                                <span>\${photo.vues} vues</span>
                            </div>
                        </div>
                    </div>
                </div>
            \`).join('');
        }

        // Filtrer et afficher les photos
        function filterGallery(category) {
            currentFilter = category;
            genererNavigationCategories();
            
            const grid = document.getElementById('photo-grid');
            const emptyGallery = document.getElementById('emptyGallery');
            const visiblePhotos = document.getElementById('visiblePhotos');
            
            let photosAffichees = category === 'all' ? photos : photos.filter(photo => photo.categorie === category);
            
            visiblePhotos.textContent = photosAffichees.length;
            
            if (photosAffichees.length === 0) {
                grid.style.display = 'none';
                emptyGallery.classList.remove('hidden');
                return;
            }
            
            grid.style.display = 'grid';
            emptyGallery.classList.add('hidden');
            
            grid.innerHTML = (photosAffichees ?? []).map(photo => \`
                <div class="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onclick="openLightbox('\${photo.src}', '\${photo.titre}', '\${photo.description}', '\${photo.categorie}')">
                    <div class="relative">
                        <img 
                            src="\${photo.src}" 
                            alt="\${photo.titre}" 
                            class="w-full h-48 object-cover"
                        />
                        <div class="absolute top-2 right-2">
                            <span class="bg-blue-500 text-white text-xs px-2 py-1 rounded-full capitalize">\${photo.categorie}</span>
                        </div>
                    </div>
                    <div class="p-4">
                        <h3 class="font-semibold text-gray-900 mb-1">\${photo.titre}</h3>
                        <p class="text-sm text-gray-600 mb-2 line-clamp-2">\${photo.description}</p>
                        <div class="flex items-center justify-between text-xs text-gray-500">
                            <span>\${photo.dateAjout}</span>
                            <div class="flex items-center">
                                <i class="fas fa-eye mr-1"></i>
                                \${photo.vues}
                            </div>
                        </div>
                    </div>
                </div>
            \`).join('');
        }

        // Lightbox
        function openLightbox(src, titre, description, categorie) {
            document.getElementById('lightbox-img').src = src;
            document.getElementById('lightbox-title').textContent = titre;
            document.getElementById('lightbox-description').textContent = description;
            document.getElementById('lightbox-category').textContent = \`Catégorie: \${categorie}\`;
            document.getElementById('lightbox').classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            document.getElementById('lightbox').classList.add('hidden');
            document.body.style.overflow = 'auto';
        }

        // Afficher tout
        function afficherTout() {
            document.getElementById('totalPhotos').textContent = photos.length;
            genererNavigationCategories();
            afficherPhotosVedette();
            filterGallery('all');
        }

        // Fermer lightbox avec Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeLightbox();
            }
        });

        // Initialiser
        document.addEventListener('DOMContentLoaded', chargerDonnees);
    </script>

    <style>
        .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
    </style>
</body>
</html>
  `)
})

export default app