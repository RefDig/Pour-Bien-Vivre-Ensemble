import { Hono } from 'hono'

const app = new Hono()

// Interface de gestion galerie - VERSION SIMPLE QUI FONCTIONNE
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Gestion Galerie - PBVE</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
            .pbve-gradient-bg { background: linear-gradient(135deg, #3b82f6, #6366f1); }
            .pbve-gradient-text { background: linear-gradient(135deg, #3b82f6, #6366f1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
            .drop-zone { 
                transition: all 0.3s ease; 
                border: 2px dashed #d1d5db; 
                min-height: 200px;
                cursor: pointer;
            }
            .drop-zone.dragover { 
                border-color: #3b82f6; 
                background-color: #eff6ff; 
            }
            .photo-preview { 
                position: relative; 
                overflow: hidden; 
                border-radius: 0.5rem; 
                aspect-ratio: 1; 
                border: 1px solid #e5e7eb;
            }
            .photo-preview img { 
                width: 100%; 
                height: 100%; 
                object-fit: cover; 
            }
            .photo-preview .overlay { 
                position: absolute; 
                top: 0; 
                left: 0; 
                right: 0; 
                bottom: 0; 
                background: rgba(0,0,0,0.7); 
                opacity: 0; 
                transition: opacity 0.3s; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                flex-direction: column;
                color: white;
                text-align: center;
                padding: 1rem;
            }
            .photo-preview:hover .overlay { 
                opacity: 1; 
            }
            .uploaded-photo {
                border: 3px solid #10b981;
                background: #ecfdf5;
            }
        </style>
    </head>
    <body class="min-h-screen bg-gray-50">
        <!-- Header Admin -->
        <header class="bg-white shadow-sm border-b">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center py-4">
                    <div class="flex items-center space-x-3">
                        <img src="/static/logo-pbve-authentique.png" alt="Logo PBVE" class="w-10 h-10 rounded-full">
                        <div>
                            <h1 class="text-xl font-bold pbve-gradient-text">Administration PBVE</h1>
                            <p class="text-sm text-gray-500">Gestion de la galerie</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-4">
                        <span class="text-sm text-gray-600">
                            <i class="fas fa-user mr-1"></i>
                            admin@pourbienvivreensemble.fr
                        </span>
                        <a href="/" class="text-red-600 hover:text-red-800 text-sm font-medium">
                            <i class="fas fa-sign-out-alt mr-1"></i>
                            Retour Site
                        </a>
                    </div>
                </div>
            </div>
        </header>

        <!-- Navigation Admin -->
        <nav class="bg-white shadow-sm">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex space-x-8">
                    <a href="/admin" class="px-3 py-4 text-sm font-medium border-b-2 border-transparent text-gray-700 hover:text-blue-600 hover:border-blue-300">
                        <i class="fas fa-tachometer-alt mr-2"></i>
                        Dashboard
                    </a>
                    <a href="/admin/galerie-simple" class="px-3 py-4 text-sm font-medium border-b-2 border-blue-500 text-blue-600">
                        <i class="fas fa-images mr-2"></i>
                        Galerie
                    </a>
                </div>
            </div>
        </nav>

        <!-- Contenu principal -->
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- En-tête -->
            <div class="flex justify-between items-center mb-8">
                <div>
                    <h2 class="text-2xl font-bold pbve-gradient-text mb-2">
                        <i class="fas fa-images mr-2"></i>
                        Gestionnaire de Galerie PBVE
                    </h2>
                    <p class="text-gray-600">Ajoutez et organisez vos photos par catégories</p>
                </div>
                <div class="flex space-x-3">
                    <a href="/galerie" target="_blank" class="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors">
                        <i class="fas fa-external-link-alt mr-2"></i>
                        Voir Galerie Publique
                    </a>
                    <button onclick="clearAllPhotos()" class="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors">
                        <i class="fas fa-trash mr-2"></i>
                        Vider Galerie
                    </button>
                </div>
            </div>

            <!-- Instructions -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <h3 class="text-lg font-semibold text-blue-900 mb-2">
                    <i class="fas fa-info-circle mr-2"></i>
                    Comment utiliser cette interface
                </h3>
                <ul class="text-blue-800 space-y-1 text-sm">
                    <li>• <strong>Ajoutez des photos :</strong> Cliquez sur "Ajouter Photos" ou glissez-déposez vos images</li>
                    <li>• <strong>Organisez par catégorie :</strong> Choisissez la catégorie avant d'ajouter</li>
                    <li>• <strong>Gestion des catégories :</strong> Ajoutez de nouvelles catégories personnalisées</li>
                    <li>• <strong>Photos acceptées :</strong> JPG, PNG, GIF (max 5MB chacune)</li>
                </ul>
            </div>

            <!-- Zone d'upload et gestion -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <!-- Upload de photos -->
                <div class="bg-white rounded-lg shadow-sm border p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">
                        <i class="fas fa-upload text-blue-600 mr-2"></i>
                        Ajouter des Photos
                    </h3>
                    
                    <!-- Sélection de catégorie -->
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                        <select id="photoCategory" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option value="ateliers">Ateliers</option>
                            <option value="sorties">Sorties</option>
                            <option value="fetes">Fêtes</option>
                            <option value="portraits">Portraits</option>
                            <option value="activites" selected>Activités</option>
                            <option value="evenements">Événements</option>
                        </select>
                    </div>

                    <!-- Zone de drop -->
                    <div class="drop-zone p-8 rounded-lg text-center border-2 border-dashed border-gray-300 mb-4" 
                         onclick="document.getElementById('fileInput').click()"
                         ondragover="handleDragOver(event)"
                         ondragleave="handleDragLeave(event)"
                         ondrop="handleDrop(event)">
                        <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-4 block"></i>
                        <p class="text-lg font-medium text-gray-700 mb-2">Glissez vos photos ici</p>
                        <p class="text-sm text-gray-500 mb-4">ou cliquez pour parcourir</p>
                        <input type="file" id="fileInput" multiple accept="image/*" class="hidden" onchange="handleFileSelect(event)">
                        <button type="button" class="pbve-gradient-bg text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">
                            <i class="fas fa-folder-open mr-2"></i>
                            Choisir Fichiers
                        </button>
                    </div>

                    <!-- Aperçu et titre/description -->
                    <div id="uploadPreview" class="hidden">
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Titre de la photo</label>
                            <input type="text" id="photoTitle" class="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Ex: Atelier cuisine du 15 octobre">
                        </div>
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <input type="text" id="photoDescription" class="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Description courte de la photo">
                        </div>
                        <button onclick="uploadPhotos()" class="w-full pbve-gradient-bg text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity">
                            <i class="fas fa-upload mr-2"></i>
                            <span id="uploadButtonText">Ajouter à la Galerie</span>
                        </button>
                    </div>
                </div>
                
                <!-- Gestion des catégories -->
                <div class="bg-white rounded-lg shadow-sm border p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">
                        <i class="fas fa-tags text-purple-600 mr-2"></i>
                        Gestion des Catégories
                    </h3>
                    
                    <!-- Liste des catégories -->
                    <div class="mb-6">
                        <h4 class="text-md font-medium text-gray-700 mb-3">Catégories existantes</h4>
                        <div id="categoriesList" class="space-y-2">
                            <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <span class="text-sm">Ateliers (8 photos)</span>
                                <button onclick="editCategoryName('ateliers')" class="text-blue-600 hover:text-blue-800 text-xs">
                                    <i class="fas fa-edit"></i>
                                </button>
                            </div>
                            <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <span class="text-sm">Sorties (12 photos)</span>
                                <button onclick="editCategoryName('sorties')" class="text-blue-600 hover:text-blue-800 text-xs">
                                    <i class="fas fa-edit"></i>
                                </button>
                            </div>
                            <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <span class="text-sm">Fêtes (6 photos)</span>
                                <button onclick="editCategoryName('fetes')" class="text-blue-600 hover:text-blue-800 text-xs">
                                    <i class="fas fa-edit"></i>
                                </button>
                            </div>
                            <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <span class="text-sm">Portraits (4 photos)</span>
                                <button onclick="editCategoryName('portraits')" class="text-blue-600 hover:text-blue-800 text-xs">
                                    <i class="fas fa-edit"></i>
                                </button>
                            </div>
                            <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <span class="text-sm">Activités (15 photos)</span>
                                <button onclick="editCategoryName('activites')" class="text-blue-600 hover:text-blue-800 text-xs">
                                    <i class="fas fa-edit"></i>
                                </button>
                            </div>
                            <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <span class="text-sm">Événements (3 photos)</span>
                                <button onclick="editCategoryName('evenements')" class="text-blue-600 hover:text-blue-800 text-xs">
                                    <i class="fas fa-edit"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Ajouter nouvelle catégorie -->
                    <div class="border-t pt-4">
                        <h4 class="text-md font-medium text-gray-700 mb-3">Ajouter une catégorie</h4>
                        <div class="flex gap-2">
                            <input type="text" id="newCategoryName" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Nom de la nouvelle catégorie">
                            <button onclick="addNewCategory()" class="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700">
                                <i class="fas fa-plus mr-1"></i>
                                Ajouter
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Galerie des photos ajoutées -->
            <div class="bg-white rounded-lg shadow-sm border p-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-lg font-semibold text-gray-900">
                        <i class="fas fa-images text-green-600 mr-2"></i>
                        Photos de la Galerie (<span id="photoCount">6</span>)
                    </h3>
                    <div class="flex gap-2">
                        <select id="filterCategory" onchange="filterPhotos()" class="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                            <option value="all">Toutes les catégories</option>
                            <option value="ateliers">Ateliers</option>
                            <option value="sorties">Sorties</option>
                            <option value="fetes">Fêtes</option>
                            <option value="portraits">Portraits</option>
                            <option value="activites">Activités</option>
                            <option value="evenements">Événements</option>
                        </select>
                    </div>
                </div>

                <div id="photosGrid" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <!-- Photos existantes de base -->
                    <div class="photo-preview" data-category="ateliers" data-id="1">
                        <img src="/static/photo-enfant-ecriture.jpg" alt="Atelier écriture" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y3ZjhmOSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNjM2NzZjIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+UGhvdG88L3RleHQ+PC9zdmc+'">
                        <div class="overlay">
                            <div class="mb-2">
                                <h4 class="font-semibold text-sm">Atelier écriture</h4>
                                <p class="text-xs opacity-80">Enfant participant</p>
                                <p class="text-xs opacity-60">Catégorie: Ateliers</p>
                            </div>
                            <div class="flex space-x-2">
                                <button onclick="deletePhoto(1)" class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="photo-preview" data-category="sorties" data-id="2">
                        <img src="/static/photo-groupe-enfants.jpg" alt="Sortie groupe" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y3ZjhmOSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNjM2NzZjIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+UGhvdG88L3RleHQ+PC9zdmc+'" >
                        <div class="overlay">
                            <div class="mb-2">
                                <h4 class="font-semibold text-sm">Sortie groupe</h4>
                                <p class="text-xs opacity-80">Groupe d'enfants</p>
                                <p class="text-xs opacity-60">Catégorie: Sorties</p>
                            </div>
                            <div class="flex space-x-2">
                                <button onclick="deletePhoto(2)" class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="photo-preview" data-category="portraits" data-id="3">
                        <img src="/static/photo-marie-cappello.jpg" alt="Marie Cappello" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y3ZjhmOSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNjM2NzZjIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+UGhvdG88L3RleHQ+PC9zdmc+'">
                        <div class="overlay">
                            <div class="mb-2">
                                <h4 class="font-semibold text-sm">Marie Cappello</h4>
                                <p class="text-xs opacity-80">Présidente PBVE</p>
                                <p class="text-xs opacity-60">Catégorie: Portraits</p>
                            </div>
                            <div class="flex space-x-2">
                                <button onclick="deletePhoto(3)" class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="photo-preview" data-category="activites" data-id="4">
                        <img src="/static/photo-atelier-creatif.jpg" alt="Atelier créatif" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y3ZjhmOSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNjM2NzZjIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+UGhvdG88L3RleHQ+PC9zdmc+'">
                        <div class="overlay">
                            <div class="mb-2">
                                <h4 class="font-semibold text-sm">Atelier créatif</h4>
                                <p class="text-xs opacity-80">Intergénérationnel</p>
                                <p class="text-xs opacity-60">Catégorie: Activités</p>
                            </div>
                            <div class="flex space-x-2">
                                <button onclick="deletePhoto(4)" class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="photo-preview" data-category="activites" data-id="5">
                        <img src="/static/photo-activite-sport.jpg" alt="Activité sport" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y3ZjhmOSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNjM2NzZjIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+UGhvdG88L3RleHQ+PC9zdmc+'">
                        <div class="overlay">
                            <div class="mb-2">
                                <h4 class="font-semibold text-sm">Sport & Bien-être</h4>
                                <p class="text-xs opacity-80">Activités physiques</p>
                                <p class="text-xs opacity-60">Catégorie: Activités</p>
                            </div>
                            <div class="flex space-x-2">
                                <button onclick="deletePhoto(5)" class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="photo-preview" data-category="fetes" data-id="6">
                        <img src="/static/photo-celebration-joie.jpg" alt="Célébration" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y3ZjhmOSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNjM2NzZjIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+UGhvdG88L3RleHQ+PC9zdmc+'">
                        <div class="overlay">
                            <div class="mb-2">
                                <h4 class="font-semibold text-sm">Célébration</h4>
                                <p class="text-xs opacity-80">Joie partagée</p>
                                <p class="text-xs opacity-60">Catégorie: Fêtes</p>
                            </div>
                            <div class="flex space-x-2">
                                <button onclick="deletePhoto(6)" class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Message si pas de photos -->
                <div id="noPhotosMessage" class="text-center py-16 hidden">
                    <i class="fas fa-images text-6xl text-gray-300 mb-4 block"></i>
                    <h3 class="text-lg font-medium text-gray-600 mb-2">Aucune photo dans la galerie</h3>
                    <p class="text-gray-500">Ajoutez des photos pour commencer à construire votre galerie</p>
                </div>
            </div>

            <!-- Statut de sauvegarde -->
            <div id="saveStatus" class="fixed bottom-4 right-4 hidden">
                <div class="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
                    <i class="fas fa-check mr-2"></i>
                    <span id="saveMessage">Photo ajoutée avec succès!</span>
                </div>
            </div>
        </main>

        <script>
            let photoCounter = 7; // Compteur pour les nouvelles photos
            let selectedFiles = [];
            let categories = {
                'ateliers': 'Ateliers',
                'sorties': 'Sorties', 
                'fetes': 'Fêtes',
                'portraits': 'Portraits',
                'activites': 'Activités',
                'evenements': 'Événements'
            };

            // Gestion du drag & drop
            function handleDragOver(e) {
                e.preventDefault();
                e.target.closest('.drop-zone').classList.add('dragover');
            }

            function handleDragLeave(e) {
                e.preventDefault();
                e.target.closest('.drop-zone').classList.remove('dragover');
            }

            function handleDrop(e) {
                e.preventDefault();
                const dropZone = e.target.closest('.drop-zone');
                dropZone.classList.remove('dragover');
                
                const files = e.dataTransfer.files;
                document.getElementById('fileInput').files = files;
                handleFileSelect({ target: { files: files } });
            }

            // Sélection de fichiers
            function handleFileSelect(e) {
                const files = e.target.files;
                selectedFiles = Array.from(files);
                
                if (files.length > 0) {
                    document.getElementById('uploadPreview').classList.remove('hidden');
                    document.getElementById('uploadButtonText').textContent = \`Ajouter \${files.length} photo(s) à la galerie\`;
                    
                    // Générer un titre automatique basé sur la catégorie
                    const category = document.getElementById('photoCategory').value;
                    const categoryName = categories[category] || category;
                    document.getElementById('photoTitle').value = \`\${categoryName} - \${new Date().toLocaleDateString('fr-FR')}\`;
                } else {
                    document.getElementById('uploadPreview').classList.add('hidden');
                    selectedFiles = [];
                }
            }

            // Upload des photos
            function uploadPhotos() {
                if (selectedFiles.length === 0) {
                    alert('Veuillez sélectionner des photos');
                    return;
                }

                const category = document.getElementById('photoCategory').value;
                const title = document.getElementById('photoTitle').value || 'Photo sans titre';
                const description = document.getElementById('photoDescription').value || '';

                // Simuler l'ajout des photos
                selectedFiles.forEach((file, index) => {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        addPhotoToGallery(e.target.result, title + (selectedFiles.length > 1 ? \` (\${index + 1})\` : ''), description, category);
                    };
                    reader.readAsDataURL(file);
                });

                // Réinitialiser
                document.getElementById('fileInput').value = '';
                document.getElementById('uploadPreview').classList.add('hidden');
                document.getElementById('photoTitle').value = '';
                document.getElementById('photoDescription').value = '';
                selectedFiles = [];
                
                // Afficher message de succès
                showSaveStatus('Photos ajoutées avec succès!');
            }

            // Ajouter une photo à la galerie
            function addPhotoToGallery(imageSrc, title, description, category) {
                const photosGrid = document.getElementById('photosGrid');
                const photoId = photoCounter++;
                
                const photoDiv = document.createElement('div');
                photoDiv.className = 'photo-preview uploaded-photo';
                photoDiv.setAttribute('data-category', category);
                photoDiv.setAttribute('data-id', photoId);
                
                photoDiv.innerHTML = \`
                    <img src="\${imageSrc}" alt="\${title}">
                    <div class="overlay">
                        <div class="mb-2">
                            <h4 class="font-semibold text-sm">\${title}</h4>
                            <p class="text-xs opacity-80">\${description}</p>
                            <p class="text-xs opacity-60">Catégorie: \${categories[category]}</p>
                            <p class="text-xs text-green-300 font-semibold">✓ NOUVEAU</p>
                        </div>
                        <div class="flex space-x-2">
                            <button onclick="deletePhoto(\${photoId})" class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                \`;
                
                photosGrid.appendChild(photoDiv);
                updatePhotoCount();
            }

            // Supprimer une photo
            function deletePhoto(photoId) {
                if (confirm('Êtes-vous sûr de vouloir supprimer cette photo ?')) {
                    const photo = document.querySelector(\`[data-id="\${photoId}"]\`);
                    if (photo) {
                        photo.remove();
                        updatePhotoCount();
                        showSaveStatus('Photo supprimée');
                    }
                }
            }

            // Vider toute la galerie
            function clearAllPhotos() {
                if (confirm('Êtes-vous sûr de vouloir supprimer TOUTES les photos de la galerie ?')) {
                    document.getElementById('photosGrid').innerHTML = '';
                    updatePhotoCount();
                    showSaveStatus('Galerie vidée');
                }
            }

            // Filtrer les photos par catégorie
            function filterPhotos() {
                const filter = document.getElementById('filterCategory').value;
                const photos = document.querySelectorAll('.photo-preview');
                
                photos.forEach(photo => {
                    if (filter === 'all' || photo.getAttribute('data-category') === filter) {
                        photo.style.display = 'block';
                    } else {
                        photo.style.display = 'none';
                    }
                });
            }

            // Ajouter nouvelle catégorie
            function addNewCategory() {
                const newName = document.getElementById('newCategoryName').value.trim();
                if (!newName) {
                    alert('Veuillez saisir un nom de catégorie');
                    return;
                }

                // Générer un ID unique
                const newId = newName.toLowerCase().replace(/[^a-z0-9]/g, '');
                
                if (categories[newId]) {
                    alert('Cette catégorie existe déjà');
                    return;
                }

                // Ajouter à la liste des catégories
                categories[newId] = newName;
                
                // Ajouter aux selects
                const categorySelect = document.getElementById('photoCategory');
                const filterSelect = document.getElementById('filterCategory');
                
                const option1 = new Option(newName, newId);
                const option2 = new Option(newName, newId);
                
                categorySelect.appendChild(option1);
                filterSelect.appendChild(option2);
                
                // Ajouter à la liste d'affichage
                const categoriesList = document.getElementById('categoriesList');
                const categoryDiv = document.createElement('div');
                categoryDiv.className = 'flex items-center justify-between p-2 bg-gray-50 rounded';
                categoryDiv.innerHTML = \`
                    <span class="text-sm">\${newName} (0 photos)</span>
                    <button onclick="editCategoryName('\${newId}')" class="text-blue-600 hover:text-blue-800 text-xs">
                        <i class="fas fa-edit"></i>
                    </button>
                \`;
                categoriesList.appendChild(categoryDiv);
                
                // Réinitialiser le champ
                document.getElementById('newCategoryName').value = '';
                showSaveStatus(\`Catégorie "\${newName}" ajoutée\`);
            }

            // Modifier nom de catégorie
            function editCategoryName(categoryId) {
                const currentName = categories[categoryId];
                const newName = prompt('Nouveau nom pour la catégorie:', currentName);
                
                if (newName && newName.trim() !== '' && newName !== currentName) {
                    categories[categoryId] = newName.trim();
                    
                    // Mettre à jour les selects
                    const options = document.querySelectorAll(\`option[value="\${categoryId}"]\`);
                    options.forEach(option => option.textContent = newName.trim());
                    
                    // Mettre à jour l'affichage
                    location.reload(); // Simplification pour cette démo
                    
                    showSaveStatus(\`Catégorie renommée en "\${newName.trim()}"\`);
                }
            }

            // Mettre à jour le compteur de photos
            function updatePhotoCount() {
                const count = document.querySelectorAll('.photo-preview').length;
                document.getElementById('photoCount').textContent = count;
                
                const noPhotosMsg = document.getElementById('noPhotosMessage');
                const photosGrid = document.getElementById('photosGrid');
                
                if (count === 0) {
                    noPhotosMsg.classList.remove('hidden');
                    photosGrid.classList.add('hidden');
                } else {
                    noPhotosMsg.classList.add('hidden');
                    photosGrid.classList.remove('hidden');
                }
            }

            // Afficher message de statut
            function showSaveStatus(message) {
                const statusDiv = document.getElementById('saveStatus');
                const messageSpan = document.getElementById('saveMessage');
                
                messageSpan.textContent = message;
                statusDiv.classList.remove('hidden');
                
                setTimeout(() => {
                    statusDiv.classList.add('hidden');
                }, 3000);
            }

            // Initialisation
            document.addEventListener('DOMContentLoaded', function() {
                updatePhotoCount();
            });
        </script>
    </body>
    </html>
  `)
})

export default app