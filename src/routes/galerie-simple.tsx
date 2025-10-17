import { Hono } from 'hono'

const app = new Hono()

// Page galerie simple qui fonctionne vraiment
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
    <link href="/static/style.css" rel="stylesheet">
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
                    <a href="/login" class="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors">
                        <i class="fas fa-user-shield mr-1"></i> Admin
                    </a>
                    <a href="/actualites" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                        <i class="fab fa-facebook mr-1"></i> Actualités
                    </a>
                    <a href="/contact" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                        <i class="fas fa-envelope mr-1"></i> Contact
                    </a>
                </nav>

                <!-- Lien Admin bien visible -->
                <div class="flex items-center space-x-4">
                    <a href="/admin/realisations/login" class="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors">
                        <i class="fas fa-key mr-1"></i> Admin
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
                    <a href="/admin/realisations/login" class="block px-3 py-2 text-base font-medium bg-red-600 text-white rounded-md">
                        <i class="fas fa-key mr-2"></i> Administration
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
                    7 photos • 6 catégories
                </p>
            </div>
        </section>

        <!-- Navigation catégories -->
        <section class="py-8 bg-white shadow-sm">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex flex-wrap justify-center gap-4">
                    <button onclick="filterGallery('all')" class="category-filter active bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-all hover:bg-purple-600">
                        <i class="fas fa-th-large mr-2"></i>
                        Toutes (7)
                    </button>
                    <button onclick="filterGallery('ateliers')" class="category-filter bg-gray-100 text-gray-700 hover:bg-purple-100 hover:text-purple-700 px-4 py-2 rounded-full text-sm font-medium transition-all">
                        <i class="fas fa-palette mr-2"></i>
                        Ateliers (2)
                    </button>
                    <button onclick="filterGallery('sorties')" class="category-filter bg-gray-100 text-gray-700 hover:bg-purple-100 hover:text-purple-700 px-4 py-2 rounded-full text-sm font-medium transition-all">
                        <i class="fas fa-walking mr-2"></i>
                        Sorties (0)
                    </button>
                    <button onclick="filterGallery('fetes')" class="category-filter bg-gray-100 text-gray-700 hover:bg-purple-100 hover:text-purple-700 px-4 py-2 rounded-full text-sm font-medium transition-all">
                        <i class="fas fa-birthday-cake mr-2"></i>
                        Fêtes (1)
                    </button>
                    <button onclick="filterGallery('portraits')" class="category-filter bg-gray-100 text-gray-700 hover:bg-purple-100 hover:text-purple-700 px-4 py-2 rounded-full text-sm font-medium transition-all">
                        <i class="fas fa-user-friends mr-2"></i>
                        Portraits (2)
                    </button>
                    <button onclick="filterGallery('activites')" class="category-filter bg-gray-100 text-gray-700 hover:bg-purple-100 hover:text-purple-700 px-4 py-2 rounded-full text-sm font-medium transition-all">
                        <i class="fas fa-running mr-2"></i>
                        Activités (2)
                    </button>
                </div>
            </div>
        </section>

        <!-- Photo en vedette -->
        <section class="py-12 bg-gradient-to-br from-yellow-50 to-orange-50">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-8">
                    <h2 class="text-3xl font-bold text-gray-900 mb-4">
                        <i class="fas fa-star text-yellow-500 mr-2"></i>
                        Photo En Vedette
                    </h2>
                </div>
                <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div class="md:flex">
                        <div class="md:w-1/2">
                            <img 
                                src="/static/photo-marie-cappello.jpg" 
                                alt="Marie Cappello - Présidente PBVE" 
                                class="w-full h-64 md:h-full object-cover"
                            />
                        </div>
                        <div class="md:w-1/2 p-8">
                            <div class="flex items-center mb-4">
                                <span class="bg-purple-100 text-purple-800 text-xs font-medium px-3 py-1 rounded-full">
                                    Portraits
                                </span>
                                <span class="ml-3 text-sm text-gray-500">15 septembre 2024</span>
                            </div>
                            <h3 class="text-2xl font-bold text-gray-900 mb-4">Marie Cappello - Présidente</h3>
                            <p class="text-gray-600 mb-6 leading-relaxed">
                                Portrait officiel de la présidente de l'association PBVE
                            </p>
                            <div class="flex items-center text-sm text-gray-500">
                                <i class="fas fa-user mr-2"></i>
                                <span class="mr-4">Photographe PBVE</span>
                                <i class="fas fa-eye mr-2"></i>
                                <span>123 vues</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Grille de photos -->
        <section class="py-16 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-8">
                    <h2 class="text-2xl font-bold text-gray-900 mb-4">Toutes Nos Photos</h2>
                    <p class="text-gray-600">7 photos disponibles</p>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" id="photo-grid">
                    <!-- Photo 1 - Ateliers -->
                    <div class="photo-item ateliers bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onclick="openLightbox('/static/photo-enfant-ecriture.jpg', 'Atelier Écriture Créative')">
                        <div class="relative">
                            <img 
                                src="/static/photo-enfant-ecriture.jpg" 
                                alt="Atelier Écriture Créative" 
                                class="w-full h-48 object-cover"
                            />
                            <div class="absolute top-2 right-2">
                                <span class="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">Ateliers</span>
                            </div>
                        </div>
                        <div class="p-4">
                            <h3 class="font-semibold text-gray-900 mb-1">Atelier Écriture Créative</h3>
                            <p class="text-sm text-gray-600 mb-2">Séance d'écriture collective</p>
                            <div class="flex items-center justify-between text-xs text-gray-500">
                                <span>Marie Cappello</span>
                                <div class="flex items-center">
                                    <i class="fas fa-eye mr-1"></i>
                                    45
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Photo 2 - Ateliers -->
                    <div class="photo-item ateliers bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onclick="openLightbox('/static/photo-atelier-creatif.jpg', 'Atelier Créatif')">
                        <div class="relative">
                            <img 
                                src="/static/photo-atelier-creatif.jpg" 
                                alt="Atelier Créatif" 
                                class="w-full h-48 object-cover"
                            />
                            <div class="absolute top-2 right-2">
                                <span class="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">Ateliers</span>
                            </div>
                        </div>
                        <div class="p-4">
                            <h3 class="font-semibold text-gray-900 mb-1">Atelier Créatif Intergénérationnel</h3>
                            <p class="text-sm text-gray-600 mb-2">Partage entre générations</p>
                            <div class="flex items-center justify-between text-xs text-gray-500">
                                <span>Marie Cappello</span>
                                <div class="flex items-center">
                                    <i class="fas fa-eye mr-1"></i>
                                    67
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Photo 3 - Portraits -->
                    <div class="photo-item portraits bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onclick="openLightbox('/static/photo-marie-cappello.jpg', 'Marie Cappello - Présidente')">
                        <div class="relative">
                            <img 
                                src="/static/photo-marie-cappello.jpg" 
                                alt="Marie Cappello" 
                                class="w-full h-48 object-cover"
                            />
                            <div class="absolute top-2 right-2">
                                <span class="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">Portraits</span>
                            </div>
                        </div>
                        <div class="p-4">
                            <h3 class="font-semibold text-gray-900 mb-1">Marie Cappello - Présidente</h3>
                            <p class="text-sm text-gray-600 mb-2">Portrait officiel</p>
                            <div class="flex items-center justify-between text-xs text-gray-500">
                                <span>Photographe PBVE</span>
                                <div class="flex items-center">
                                    <i class="fas fa-eye mr-1"></i>
                                    123
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Photo 4 - Portraits -->
                    <div class="photo-item portraits bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onclick="openLightbox('/static/photo-groupe-enfants.jpg', 'Nos Petits Héros')">
                        <div class="relative">
                            <img 
                                src="/static/photo-groupe-enfants.jpg" 
                                alt="Groupe enfants" 
                                class="w-full h-48 object-cover"
                            />
                            <div class="absolute top-2 right-2">
                                <span class="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">Portraits</span>
                            </div>
                        </div>
                        <div class="p-4">
                            <h3 class="font-semibold text-gray-900 mb-1">Nos Petits Héros</h3>
                            <p class="text-sm text-gray-600 mb-2">Groupe d'enfants joyeux</p>
                            <div class="flex items-center justify-between text-xs text-gray-500">
                                <span>Animateur Jeunesse</span>
                                <div class="flex items-center">
                                    <i class="fas fa-eye mr-1"></i>
                                    98
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Photo 5 - Activités -->
                    <div class="photo-item activites bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onclick="openLightbox('/static/photo-activite-sport.jpg', 'Sport et Bien-être')">
                        <div class="relative">
                            <img 
                                src="/static/photo-activite-sport.jpg" 
                                alt="Sport" 
                                class="w-full h-48 object-cover"
                            />
                            <div class="absolute top-2 right-2">
                                <span class="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">Activités</span>
                            </div>
                        </div>
                        <div class="p-4">
                            <h3 class="font-semibold text-gray-900 mb-1">Sport & Bien-être</h3>
                            <p class="text-sm text-gray-600 mb-2">Activité physique adaptée</p>
                            <div class="flex items-center justify-between text-xs text-gray-500">
                                <span>Coach PBVE</span>
                                <div class="flex items-center">
                                    <i class="fas fa-eye mr-1"></i>
                                    89
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Photo 6 - Activités -->
                    <div class="photo-item activites bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onclick="openLightbox('/static/photo-danse-mouvement.jpg', 'Danse et Mouvement')">
                        <div class="relative">
                            <img 
                                src="/static/photo-danse-mouvement.jpg" 
                                alt="Danse" 
                                class="w-full h-48 object-cover"
                            />
                            <div class="absolute top-2 right-2">
                                <span class="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">Activités</span>
                            </div>
                        </div>
                        <div class="p-4">
                            <h3 class="font-semibold text-gray-900 mb-1">Danse et Mouvement</h3>
                            <p class="text-sm text-gray-600 mb-2">Expression corporelle</p>
                            <div class="flex items-center justify-between text-xs text-gray-500">
                                <span>Animateur Danse</span>
                                <div class="flex items-center">
                                    <i class="fas fa-eye mr-1"></i>
                                    76
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Photo 7 - Fêtes -->
                    <div class="photo-item fetes bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onclick="openLightbox('/static/photo-celebration-joie.jpg', 'Célébration')">
                        <div class="relative">
                            <img 
                                src="/static/photo-celebration-joie.jpg" 
                                alt="Célébration" 
                                class="w-full h-48 object-cover"
                            />
                            <div class="absolute top-2 right-2">
                                <span class="bg-pink-500 text-white text-xs px-2 py-1 rounded-full">Fêtes</span>
                            </div>
                        </div>
                        <div class="p-4">
                            <h3 class="font-semibold text-gray-900 mb-1">Moments de Joie</h3>
                            <p class="text-sm text-gray-600 mb-2">Célébration communautaire</p>
                            <div class="flex items-center justify-between text-xs text-gray-500">
                                <span>Marie Cappello</span>
                                <div class="flex items-center">
                                    <i class="fas fa-eye mr-1"></i>
                                    145
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Message pour l'admin -->
                <div class="mt-12 text-center">
                    <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 max-w-2xl mx-auto">
                        <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-camera text-2xl text-blue-600"></i>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-3">
                            Envie d'ajouter vos photos ?
                        </h3>
                        <p class="text-gray-600 mb-6">
                            Connectez-vous à l'espace administrateur pour téléverser et gérer vos photos.
                        </p>
                        <a 
                            href="/admin/realisations/login"
                            class="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                            <i class="fas fa-key mr-2"></i>
                            Accès Administrateur
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
            <p id="lightbox-caption" class="text-white text-center mt-4 text-lg"></p>
            <button onclick="closeLightbox()" class="absolute top-4 right-4 text-white text-3xl hover:text-gray-300">
                <i class="fas fa-times"></i>
            </button>
        </div>
    </div>

    <script>
        // Navigation mobile
        function toggleMobileMenu() {
            const menu = document.getElementById('mobile-menu');
            menu.classList.toggle('hidden');
        }

        // Filtrage galerie
        function filterGallery(category) {
            const items = document.querySelectorAll('.photo-item');
            const buttons = document.querySelectorAll('.category-filter');
            
            // Reset buttons
            buttons.forEach(btn => {
                btn.classList.remove('active', 'bg-purple-500', 'text-white');
                btn.classList.add('bg-gray-100', 'text-gray-700');
            });
            
            // Active button
            event.target.classList.add('active', 'bg-purple-500', 'text-white');
            event.target.classList.remove('bg-gray-100', 'text-gray-700');
            
            // Filter items
            items.forEach(item => {
                if (category === 'all' || item.classList.contains(category)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        }

        // Lightbox
        function openLightbox(src, caption) {
            document.getElementById('lightbox-img').src = src;
            document.getElementById('lightbox-caption').textContent = caption;
            document.getElementById('lightbox').classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            document.getElementById('lightbox').classList.add('hidden');
            document.body.style.overflow = 'auto';
        }

        // Fermer lightbox avec Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeLightbox();
            }
        });
    </script>
</body>
</html>
  `)
})

export default app