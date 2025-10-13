import { Hono } from 'hono'

const app = new Hono()

// Galerie corrigée avec persistance des données
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
    <!-- Header avec navigation CORRIGÉE -->
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
                
                <!-- Navigation principale -->
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

                <!-- UN SEUL bouton Admin -->
                <div class="flex items-center space-x-3">
                    <a href="/admin/galerie-fonctionnelle" class="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors text-sm">
                        <i class="fas fa-cog mr-1"></i> Admin Galerie
                    </a>
                    
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
                        <i class="fas fa-cog mr-2"></i> Admin Galerie
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
                    <span id="totalPhotos">Chargement...</span> photos • <span id="totalCategories">6</span> catégories
                </p>
            </div>
        </section>

        <!-- Navigation catégories -->
        <section class="py-8 bg-white shadow-sm">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-6">
                    <button onclick="actualiserGalerie()" class="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                        <i class="fas fa-sync-alt mr-2"></i>
                        Actualiser la galerie
                    </button>
                </div>
                <div class="flex flex-wrap justify-center gap-4" id="categoriesNav">
                    <!-- Catégories générées dynamiquement -->
                </div>
            </div>
        </section>

        <!-- Grille de toutes les photos -->
        <section class="py-16 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-8">
                    <h2 class="text-2xl font-bold text-gray-900 mb-4">Toutes Nos Photos</h2>
                    <p class="text-gray-600">
                        <span id="visiblePhotos">0</span> photos visibles 
                        • Dernière mise à jour : <span id="lastUpdate">-</span>
                    </p>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" id="photo-grid">
                    <!-- Photos générées dynamiquement -->
                </div>

                <!-- Message si aucune photo -->
                <div id="emptyGallery" class="text-center py-16">
                    <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 max-w-2xl mx-auto">
                        <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-camera text-2xl text-blue-600"></i>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-3">
                            <span id="emptyTitle">Galerie en cours de construction</span>
                        </h3>
                        <p class="text-gray-600 mb-6">
                            <span id="emptyDescription">Cette galerie sera bientôt remplie de nos plus beaux moments !</span>
                        </p>
                        <div class="space-y-3">
                            <a 
                                href="/admin/galerie-fonctionnelle"
                                class="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors mr-3"
                            >
                                <i class="fas fa-plus mr-2"></i>
                                Ajouter des Photos
                            </a>
                            <button onclick="initialiserPhotosDemo()" class="inline-flex items-center bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                                <i class="fas fa-magic mr-2"></i>
                                Photos de démonstration
                            </button>
                        </div>
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
        let categories = ['ateliers', 'sorties', 'fetes', 'portraits', 'activites', 'evenements'];
        let currentFilter = 'all';

        // Clé de stockage unique pour éviter les conflits
        const STORAGE_KEY_PHOTOS = 'pbve_photos_v2';
        const STORAGE_KEY_CATEGORIES = 'pbve_categories_v2';

        // Navigation mobile
        function toggleMobileMenu() {
            const menu = document.getElementById('mobile-menu');
            menu.classList.toggle('hidden');
        }

        // Charger les données avec vérification
        function chargerDonnees() {
            try {
                console.log('🔄 Chargement des données...');
                
                const photosStockees = localStorage.getItem(STORAGE_KEY_PHOTOS);
                const categoriesStockees = localStorage.getItem(STORAGE_KEY_CATEGORIES);
                
                if (photosStockees) {
                    photos = JSON.parse(photosStockees);
                    console.log(\`📷 \${photos.length} photos trouvées\`);
                } else {
                    photos = [];
                    console.log('📷 Aucune photo trouvée');
                }
                
                if (categoriesStockees) {
                    categories = JSON.parse(categoriesStockees);
                } else {
                    categories = ['ateliers', 'sorties', 'fetes', 'portraits', 'activites', 'evenements'];
                    sauvegarderCategories();
                }
                
                mettreAJourAffichage();
                
            } catch (error) {
                console.error('❌ Erreur lors du chargement:', error);
                photos = [];
                categories = ['ateliers', 'sorties', 'fetes', 'portraits', 'activites', 'evenements'];
                mettreAJourAffichage();
            }
        }

        // Actualiser la galerie manuellement
        function actualiserGalerie() {
            console.log('🔄 Actualisation manuelle...');
            chargerDonnees();
            afficherMessage('Galerie actualisée !', 'success');
        }

        // Initialiser des photos de démonstration
        function initialiserPhotosDemo() {
            const photosDemos = [
                {
                    id: Date.now() + 1,
                    titre: "Atelier Écriture Créative",
                    description: "Séance d'écriture collective avec nos membres",
                    categorie: "ateliers",
                    src: "/static/photo-enfant-ecriture.jpg",
                    dateAjout: new Date().toLocaleDateString('fr-FR'),
                    vues: 45
                },
                {
                    id: Date.now() + 2,
                    titre: "Marie Cappello - Présidente",
                    description: "Portrait officiel de notre présidente",
                    categorie: "portraits",
                    src: "/static/photo-marie-cappello.jpg",
                    dateAjout: new Date().toLocaleDateString('fr-FR'),
                    vues: 123
                },
                {
                    id: Date.now() + 3,
                    titre: "Atelier Créatif Intergénérationnel",
                    description: "Partage entre générations lors de nos ateliers",
                    categorie: "ateliers",
                    src: "/static/photo-atelier-creatif.jpg",
                    dateAjout: new Date().toLocaleDateString('fr-FR'),
                    vues: 67
                },
                {
                    id: Date.now() + 4,
                    titre: "Nos Petits Héros",
                    description: "Groupe d'enfants joyeux de l'association",
                    categorie: "portraits",
                    src: "/static/photo-groupe-enfants.jpg",
                    dateAjout: new Date().toLocaleDateString('fr-FR'),
                    vues: 98
                },
                {
                    id: Date.now() + 5,
                    titre: "Sport & Bien-être",
                    description: "Activités physiques adaptées à tous",
                    categorie: "activites",
                    src: "/static/photo-activite-sport.jpg",
                    dateAjout: new Date().toLocaleDateString('fr-FR'),
                    vues: 89
                },
                {
                    id: Date.now() + 6,
                    titre: "Danse et Mouvement",
                    description: "Expression corporelle et créativité",
                    categorie: "activites",
                    src: "/static/photo-danse-mouvement.jpg",
                    dateAjout: new Date().toLocaleDateString('fr-FR'),
                    vues: 76
                },
                {
                    id: Date.now() + 7,
                    titre: "Moments de Joie",
                    description: "Célébration communautaire pleine de bonheur",
                    categorie: "fetes",
                    src: "/static/photo-celebration-joie.jpg",
                    dateAjout: new Date().toLocaleDateString('fr-FR'),
                    vues: 145
                }
            ];

            photos = [...photos, ...photosDemos];
            sauvegarderPhotos();
            mettreAJourAffichage();
            afficherMessage('Photos de démonstration ajoutées !', 'success');
        }

        // Mettre à jour tout l'affichage
        function mettreAJourAffichage() {
            const totalPhotos = document.getElementById('totalPhotos');
            const lastUpdate = document.getElementById('lastUpdate');
            
            totalPhotos.textContent = photos.length;
            lastUpdate.textContent = new Date().toLocaleTimeString('fr-FR');
            
            genererNavigationCategories();
            filterGallery(currentFilter);
        }

        // Générer les catégories de navigation
        function genererNavigationCategories() {
            const nav = document.getElementById('categoriesNav');
            
            // Compter les photos par catégorie
            const compteur = {};
            categories.forEach(cat => compteur[cat] = 0);
            photos.forEach(photo => {
                if (compteur[photo.categorie] !== undefined) {
                    compteur[photo.categorie]++;
                }
            });
            
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
                
                // Messages personnalisés
                const emptyTitle = document.getElementById('emptyTitle');
                const emptyDescription = document.getElementById('emptyDescription');
                
                if (photos.length === 0) {
                    emptyTitle.textContent = 'Aucune photo dans la galerie';
                    emptyDescription.textContent = 'Commencez par ajouter vos premières photos via l\\'interface d\\'administration.';
                } else {
                    emptyTitle.textContent = \`Aucune photo dans "\${category}"\`;
                    emptyDescription.textContent = \`Il n'y a pas encore de photos dans cette catégorie. Ajoutez-en via l'admin !\`;
                }
                
                return;
            }
            
            grid.style.display = 'grid';
            emptyGallery.classList.add('hidden');
            
            grid.innerHTML = photosAffichees.map(photo => \`
                <div class="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer transform hover:scale-105" onclick="openLightbox('\${photo.src}', '\${photo.titre}', '\${photo.description}', '\${photo.categorie}')">
                    <div class="relative">
                        <img 
                            src="\${photo.src}" 
                            alt="\${photo.titre}" 
                            class="w-full h-48 object-cover"
                            onerror="this.src='/static/placeholder-image.jpg'"
                        />
                        <div class="absolute top-2 right-2">
                            <span class="bg-blue-500 text-white text-xs px-2 py-1 rounded-full capitalize shadow-lg">\${photo.categorie}</span>
                        </div>
                        <div class="absolute bottom-2 left-2">
                            <span class="bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                                <i class="fas fa-eye mr-1"></i>\${photo.vues}
                            </span>
                        </div>
                    </div>
                    <div class="p-4">
                        <h3 class="font-semibold text-gray-900 mb-1 truncate">\${photo.titre}</h3>
                        <p class="text-sm text-gray-600 mb-2 line-clamp-2">\${photo.description}</p>
                        <div class="flex items-center justify-between text-xs text-gray-500">
                            <span><i class="fas fa-calendar mr-1"></i>\${photo.dateAjout}</span>
                            <span class="bg-gray-100 px-2 py-1 rounded capitalize">\${photo.categorie}</span>
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

        // Sauvegarder données
        function sauvegarderPhotos() {
            try {
                localStorage.setItem(STORAGE_KEY_PHOTOS, JSON.stringify(photos));
                console.log(\`💾 \${photos.length} photos sauvegardées\`);
            } catch (error) {
                console.error('❌ Erreur sauvegarde photos:', error);
            }
        }

        function sauvegarderCategories() {
            try {
                localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
            } catch (error) {
                console.error('❌ Erreur sauvegarde catégories:', error);
            }
        }

        // Afficher un message temporaire
        function afficherMessage(texte, type = 'info') {
            const couleur = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
            
            const message = document.createElement('div');
            message.className = \`fixed top-4 right-4 \${couleur} text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity\`;
            message.innerHTML = \`<i class="fas fa-info-circle mr-2"></i>\${texte}\`;
            document.body.appendChild(message);
            
            setTimeout(() => {
                message.style.opacity = '0';
                setTimeout(() => message.remove(), 300);
            }, 3000);
        }

        // Fermer lightbox avec Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeLightbox();
            }
        });

        // Auto-refresh toutes les 30 secondes pour détecter les nouveaux ajouts
        setInterval(() => {
            const anciensPhotos = photos.length;
            chargerDonnees();
            if (photos.length > anciensPhotos) {
                afficherMessage(\`\${photos.length - anciensPhotos} nouvelles photos détectées !\`, 'success');
            }
        }, 30000);

        // Initialiser au chargement
        document.addEventListener('DOMContentLoaded', function() {
            console.log('🚀 Initialisation de la galerie...');
            chargerDonnees();
        });
    </script>

    <style>
        .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        
        .transform {
            transition: transform 0.2s ease-in-out;
        }
        
        /* Animation pour les cartes */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        #photo-grid > div {
            animation: fadeIn 0.3s ease-out;
        }
    </style>
</body>
</html>
  `)
})

export default app