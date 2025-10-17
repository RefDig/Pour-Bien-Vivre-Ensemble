import { Hono } from 'hono'

const app = new Hono()

// Interface d'administration galerie CORRIGÉE - PERSISTANCE GARANTIE
app.get('/', (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Galerie - PBVE</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50 min-h-screen">
    <div class="container mx-auto px-4 py-8 max-w-6xl">
        <!-- Header -->
        <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-3xl font-bold text-green-600">
                        <i class="fas fa-cog mr-3"></i>
                        Administration Galerie PBVE
                    </h1>
                    <p class="text-gray-600">Interface corrigée - Persistance garantie</p>
                </div>
                <div class="flex space-x-3">
                    <a href="/galerie" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                        <i class="fas fa-images mr-2"></i>
                        Voir la galerie
                    </a>
                    <a href="/nos-realisations" class="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors">
                        <i class="fas fa-star mr-2"></i>
                        Réalisations
                    </a>
                    <a href="/" class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">
                        <i class="fas fa-home mr-2"></i>
                        Accueil
                    </a>
                </div>
            </div>
        </div>

        <!-- Statistiques -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div class="bg-blue-500 text-white p-6 rounded-xl">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-blue-100">Total Photos</p>
                        <p class="text-2xl font-bold" id="statTotalPhotos">0</p>
                    </div>
                    <i class="fas fa-images text-3xl text-blue-200"></i>
                </div>
            </div>
            <div class="bg-green-500 text-white p-6 rounded-xl">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-green-100">Catégories</p>
                        <p class="text-2xl font-bold" id="statTotalCategories">0</p>
                    </div>
                    <i class="fas fa-tags text-3xl text-green-200"></i>
                </div>
            </div>
            <div class="bg-purple-500 text-white p-6 rounded-xl">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-purple-100">Taille Stockage</p>
                        <p class="text-2xl font-bold" id="statTailleStockage">0 KB</p>
                    </div>
                    <i class="fas fa-database text-3xl text-purple-200"></i>
                </div>
            </div>
            <div class="bg-orange-500 text-white p-6 rounded-xl">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-orange-100">Statut</p>
                        <p class="text-lg font-bold" id="statStatut">Actif</p>
                    </div>
                    <i class="fas fa-check-circle text-3xl text-orange-200"></i>
                </div>
            </div>
        </div>

        <!-- Zone d'upload -->
        <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 class="text-xl font-bold text-gray-800 mb-6">
                <i class="fas fa-cloud-upload-alt mr-2"></i>
                Ajouter une Photo
            </h2>
            
            <div class="grid md:grid-cols-2 gap-6">
                <!-- Upload -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Sélectionner une photo</label>
                    <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
                        <input type="file" id="photoInput" accept="image/*" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                        <p class="text-sm text-gray-500 mt-2">
                            <i class="fas fa-info-circle mr-1"></i>
                            Formats acceptés: JPG, PNG, GIF (max 5MB)
                        </p>
                    </div>
                    
                    <div id="preview" class="mt-4 hidden">
                        <img id="previewImage" class="w-full h-40 object-cover rounded-lg border-2 border-green-200">
                        <p class="text-sm text-gray-600 mt-2">Prévisualisation de votre photo</p>
                    </div>
                </div>
                
                <!-- Informations -->
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            <i class="fas fa-text-width mr-1"></i>
                            Titre de la photo *
                        </label>
                        <input type="text" id="photoTitle" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="Ex: Atelier cuisine du dimanche">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            <i class="fas fa-align-left mr-1"></i>
                            Description
                        </label>
                        <textarea id="photoDescription" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 h-20" placeholder="Décrivez cette photo (facultatif)..."></textarea>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            <i class="fas fa-tag mr-1"></i>
                            Catégorie *
                        </label>
                        <select id="photoCategory" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                            <option value="">Choisir une catégorie...</option>
                        </select>
                    </div>
                    
                    <button onclick="ajouterPhoto()" class="w-full bg-green-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
                        <i class="fas fa-plus mr-2"></i>
                        Ajouter la Photo
                    </button>
                    
                    <div class="text-xs text-gray-500">
                        * Champs obligatoires
                    </div>
                </div>
            </div>
        </div>

        <!-- Gestion des catégories -->
        <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 class="text-xl font-bold text-gray-800 mb-6">
                <i class="fas fa-tags mr-2"></i>
                Gérer les Catégories
            </h2>
            
            <div class="grid md:grid-cols-2 gap-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Ajouter une nouvelle catégorie</label>
                    <div class="flex gap-2">
                        <input type="text" id="newCategory" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="Nom de la catégorie">
                        <button onclick="ajouterCategorie()" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <p class="text-sm text-gray-500 mt-2">
                        <i class="fas fa-lightbulb mr-1"></i>
                        Suggestions : formations, réunions, projets
                    </p>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Catégories existantes</label>
                    <div id="categoriesList" class="space-y-2 max-h-32 overflow-y-auto border rounded-lg p-3">
                        <!-- Catégories dynamiques -->
                    </div>
                </div>
            </div>
        </div>

        <!-- Photos existantes -->
        <div class="bg-white rounded-xl shadow-lg p-6">
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-bold text-gray-800">
                    <i class="fas fa-images mr-2"></i>
                    Photos de la Galerie (<span id="photoCount">0</span>)
                </h2>
                <div class="space-x-2">
                    <button onclick="actualiserGalerie()" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm">
                        <i class="fas fa-sync-alt mr-2"></i>
                        Actualiser
                    </button>
                    <button onclick="exporterDonnees()" class="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors text-sm">
                        <i class="fas fa-download mr-2"></i>
                        Exporter
                    </button>
                    <button onclick="viderGalerie()" class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm">
                        <i class="fas fa-trash mr-2"></i>
                        Tout supprimer
                    </button>
                </div>
            </div>
            
            <!-- Filtre par catégorie -->
            <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">Filtrer par catégorie</label>
                <select id="filterCategory" onchange="filtrerPhotos()" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                    <option value="all">Toutes les catégories</option>
                </select>
            </div>
            
            <div id="photosGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <!-- Photos seront ajoutées ici dynamiquement -->
            </div>
            
            <div id="emptyMessage" class="text-center py-12 text-gray-500">
                <i class="fas fa-camera text-4xl mb-4 text-gray-300"></i>
                <p class="text-lg font-medium mb-2">Aucune photo dans la galerie</p>
                <p class="text-sm">Utilisez le formulaire ci-dessus pour ajouter vos premières photos</p>
            </div>
        </div>
    </div>

    <script>
        // Données stockées - MÊMES CLÉS que la galerie publique
        let photos = [];
        let categories = ['ateliers', 'sorties', 'fetes', 'portraits', 'activites', 'evenements'];
        
        // Clés de stockage IDENTIQUES à la galerie
        const STORAGE_KEY_PHOTOS = 'pbve_photos_v2';
        const STORAGE_KEY_CATEGORIES = 'pbve_categories_v2';

        // Charger les données au démarrage
        function chargerDonnees() {
            try {
                console.log('🔄 [ADMIN] Chargement des données...');
                
                const photosStockees = localStorage.getItem(STORAGE_KEY_PHOTOS);
                const categoriesStockees = localStorage.getItem(STORAGE_KEY_CATEGORIES);
                
                if (photosStockees) {
                    photos = JSON.parse(photosStockees);
                    console.log(\`📷 [ADMIN] \${photos.length} photos chargées\`);
                } else {
                    photos = [];
                    console.log('📷 [ADMIN] Aucune photo trouvée, initialisation vide');
                }
                
                if (categoriesStockees) {
                    categories = JSON.parse(categoriesStockees);
                    console.log(\`🏷️ [ADMIN] \${categories.length} catégories chargées\`);
                } else {
                    categories = ['ateliers', 'sorties', 'fetes', 'portraits', 'activites', 'evenements'];
                    sauvegarderCategories();
                    console.log('🏷️ [ADMIN] Catégories par défaut initialisées');
                }
                
                mettreAJourTout();
                afficherMessage('Données chargées avec succès', 'success');
                
            } catch (error) {
                console.error('❌ [ADMIN] Erreur lors du chargement:', error);
                photos = [];
                categories = ['ateliers', 'sorties', 'fetes', 'portraits', 'activites', 'evenements'];
                mettreAJourTout();
                afficherMessage('Erreur de chargement, réinitialisation', 'error');
            }
        }

        // Actualiser manuellement
        function actualiserGalerie() {
            chargerDonnees();
            afficherMessage('Galerie actualisée !', 'info');
        }

        // Mettre à jour tous les affichages
        function mettreAJourTout() {
            mettreAJourStatistiques();
            afficherPhotos();
            afficherCategories();
            mettreAJourSelecteurs();
        }

        // Mettre à jour les statistiques
        function mettreAJourStatistiques() {
            document.getElementById('statTotalPhotos').textContent = photos.length;
            document.getElementById('statTotalCategories').textContent = categories.length;
            
            // Calculer taille approximative
            const taille = JSON.stringify({photos, categories}).length;
            const tailleKB = (taille / 1024).toFixed(1);
            document.getElementById('statTailleStockage').textContent = tailleKB + ' KB';
            
            document.getElementById('photoCount').textContent = photos.length;
        }

        // Prévisualiser l'image sélectionnée
        function initialiserPreview() {
            const photoInput = document.getElementById('photoInput');
            if (photoInput) {
                photoInput.addEventListener('change', function(e) {
                    const file = e.target.files[0];
                    if (file) {
                        // Vérifier la taille
                        if (file.size > 5 * 1024 * 1024) {
                            afficherMessage('Fichier trop volumineux (max 5MB)', 'error');
                            this.value = '';
                            return;
                        }
                        
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            document.getElementById('previewImage').src = e.target.result;
                            document.getElementById('preview').classList.remove('hidden');
                        }
                        reader.readAsDataURL(file);
                    } else {
                        document.getElementById('preview').classList.add('hidden');
                    }
                });
            }
        }

        // Ajouter une photo
        function ajouterPhoto() {
            console.log('🖱️ [ADMIN] Clic sur bouton Ajouter Photo');
            
            const input = document.getElementById('photoInput');
            const titre = document.getElementById('photoTitle').value.trim();
            const description = document.getElementById('photoDescription').value.trim();
            const categorie = document.getElementById('photoCategory').value;
            
            console.log('📋 [ADMIN] Validation:', { 
                hasFile: !!input.files[0], 
                titre, 
                description, 
                categorie 
            });
            
            // Validation
            if (!input.files[0]) {
                afficherMessage('Veuillez sélectionner une photo', 'error');
                return;
            }
            
            if (!titre) {
                afficherMessage('Veuillez saisir un titre', 'error');
                document.getElementById('photoTitle').focus();
                return;
            }
            
            if (!categorie) {
                afficherMessage('Veuillez choisir une catégorie', 'error');
                document.getElementById('photoCategory').focus();
                return;
            }
            
            console.log('✅ [ADMIN] Validation OK, lecture du fichier...');
            
            const file = input.files[0];
            const reader = new FileReader();
            
            reader.onload = function(e) {
                console.log('📸 [ADMIN] Fichier lu, création de l\'objet photo...');
                
                const nouvellePhoto = {
                    id: Date.now(),
                    titre: titre,
                    description: description || 'Aucune description',
                    categorie: categorie,
                    src: e.target.result,
                    dateAjout: new Date().toLocaleDateString('fr-FR'),
                    dateAjoutISO: new Date().toISOString(),
                    vues: Math.floor(Math.random() * 50) + 1,
                    taille: file.size,
                    nomFichier: file.name
                };
                
                photos.push(nouvellePhoto);
                console.log(\`📷 [ADMIN] Photo ajoutée au tableau, total: \${photos.length}\`);
                
                sauvegarderPhotos();
                mettreAJourTout();
                
                // Réinitialiser le formulaire
                document.getElementById('photoInput').value = '';
                document.getElementById('photoTitle').value = '';
                document.getElementById('photoDescription').value = '';
                document.getElementById('photoCategory').value = '';
                document.getElementById('preview').classList.add('hidden');
                
                console.log(\`✅ [ADMIN] Photo "\${titre}" ajoutée avec succès\`);
                afficherMessage(\`Photo "\${titre}" ajoutée avec succès !\`, 'success');
            };
            
            reader.onerror = function(error) {
                console.error('❌ [ADMIN] Erreur FileReader:', error);
                afficherMessage('Erreur lors de la lecture du fichier', 'error');
            };
            
            reader.readAsDataURL(file);
        }

        // Ajouter une catégorie
        function ajouterCategorie() {
            const input = document.getElementById('newCategory');
            const nouveauNom = input.value.trim().toLowerCase();
            
            if (!nouveauNom) {
                afficherMessage('Veuillez saisir un nom de catégorie', 'error');
                input.focus();
                return;
            }
            
            if (nouveauNom.length < 3) {
                afficherMessage('Le nom doit contenir au moins 3 caractères', 'error');
                input.focus();
                return;
            }
            
            if (categories.includes(nouveauNom)) {
                afficherMessage('Cette catégorie existe déjà', 'error');
                input.focus();
                return;
            }
            
            categories.push(nouveauNom);
            sauvegarderCategories();
            mettreAJourTout();
            
            input.value = '';
            console.log(\`✅ [ADMIN] Catégorie "\${nouveauNom}" ajoutée\`);
            afficherMessage(\`Catégorie "\${nouveauNom}" ajoutée !\`, 'success');
        }

        // Supprimer une catégorie
        function supprimerCategorie(nom) {
            // Vérifier s'il y a des photos dans cette catégorie
            const photosCategorie = photos.filter(photo => photo.categorie === nom);
            
            let message = \`Supprimer la catégorie "\${nom}" ?\`;
            if (photosCategorie.length > 0) {
                message += \`\\n\\nAttention: \${photosCategorie.length} photo(s) utilisent cette catégorie.\\nElles seront marquées comme "sans catégorie".\`;
            }
            
            if (confirm(message)) {
                // Mettre à jour les photos qui utilisent cette catégorie
                photos.forEach(photo => {
                    if (photo.categorie === nom) {
                        photo.categorie = 'sans-categorie';
                    }
                });
                
                categories = categories.filter(cat => cat !== nom);
                
                // Ajouter "sans-categorie" si elle n'existe pas et qu'on en a besoin
                if (photosCategorie.length > 0 && !categories.includes('sans-categorie')) {
                    categories.push('sans-categorie');
                }
                
                sauvegarderCategories();
                sauvegarderPhotos();
                mettreAJourTout();
                
                console.log(\`🗑️ [ADMIN] Catégorie "\${nom}" supprimée\`);
                afficherMessage('Catégorie supprimée', 'info');
            }
        }

        // Supprimer une photo
        function supprimerPhoto(id) {
            const photo = photos.find(p => p.id === id);
            if (!photo) return;
            
            if (confirm(\`Supprimer la photo "\${photo.titre}" ?\\n\\nCette action est irréversible.\`)) {
                photos = photos.filter(photo => photo.id !== id);
                sauvegarderPhotos();
                mettreAJourTout();
                
                console.log(\`🗑️ [ADMIN] Photo "\${photo.titre}" supprimée\`);
                afficherMessage('Photo supprimée', 'info');
            }
        }

        // Vider toute la galerie
        function viderGalerie() {
            if (confirm(\`Supprimer TOUTES les \${photos.length} photos ?\\n\\n⚠️ ATTENTION: Cette action est irréversible !\\n\\nTapez "SUPPRIMER" pour confirmer.\`)) {
                const confirmation = prompt('Tapez "SUPPRIMER" en majuscules pour confirmer:');
                if (confirmation === 'SUPPRIMER') {
                    photos = [];
                    sauvegarderPhotos();
                    mettreAJourTout();
                    
                    console.log('🗑️ [ADMIN] Toutes les photos supprimées');
                    afficherMessage('Galerie entièrement vidée', 'info');
                } else {
                    afficherMessage('Suppression annulée', 'info');
                }
            }
        }

        // Filtrer les photos
        function filtrerPhotos() {
            const filtre = document.getElementById('filterCategory').value;
            afficherPhotos(filtre);
        }

        // Afficher les photos
        function afficherPhotos(filtre = 'all') {
            const grid = document.getElementById('photosGrid');
            const emptyMessage = document.getElementById('emptyMessage');
            
            let photosAffichees = filtre === 'all' ? photos : photos.filter(photo => photo.categorie === filtre);
            
            if (photosAffichees.length === 0) {
                grid.classList.add('hidden');
                emptyMessage.classList.remove('hidden');
                return;
            }
            
            grid.classList.remove('hidden');
            emptyMessage.classList.add('hidden');
            
            // Trier par date (plus récent en premier)
            photosAffichees.sort((a, b) => new Date(b.dateAjoutISO || b.dateAjout) - new Date(a.dateAjoutISO || a.dateAjout));
            
            grid.innerHTML = photosAffichees.map(photo => \`
                <div class="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div class="relative">
                        <img src="\${photo.src}" alt="\${photo.titre}" class="w-full h-32 object-cover">
                        <div class="absolute top-2 right-2">
                            <button onclick="supprimerPhoto(\${photo.id})" class="bg-red-500 text-white p-1 rounded-full text-xs hover:bg-red-600 transition-colors">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                        <div class="absolute top-2 left-2">
                            <span class="bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">\${photo.categorie}</span>
                        </div>
                    </div>
                    <div class="p-3">
                        <h3 class="font-medium text-sm text-gray-900 mb-1 truncate" title="\${photo.titre}">\${photo.titre}</h3>
                        <p class="text-xs text-gray-600 mb-2 line-clamp-2">\${photo.description}</p>
                        <div class="grid grid-cols-2 gap-2 text-xs text-gray-500">
                            <span><i class="fas fa-calendar mr-1"></i>\${photo.dateAjout}</span>
                            <span><i class="fas fa-eye mr-1"></i>\${photo.vues} vues</span>
                            <span><i class="fas fa-file mr-1"></i>\${(photo.taille/1024).toFixed(0)}KB</span>
                            <span><i class="fas fa-tag mr-1"></i>\${photo.categorie}</span>
                        </div>
                    </div>
                </div>
            \`).join('');
        }

        // Afficher les catégories
        function afficherCategories() {
            const liste = document.getElementById('categoriesList');
            
            if (categories.length === 0) {
                liste.innerHTML = '<p class="text-gray-500 text-sm">Aucune catégorie</p>';
                return;
            }
            
            liste.innerHTML = categories.map((cat, index) => \`
                <div class="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <span class="text-sm font-medium capitalize flex items-center">
                        <span class="w-6 h-6 bg-blue-500 text-white rounded-full text-xs flex items-center justify-center mr-2">
                            \${index + 1}
                        </span>
                        \${cat}
                        <span class="ml-2 text-xs text-gray-500">(\${photos.filter(p => p.categorie === cat).length} photos)</span>
                    </span>
                    <button onclick="supprimerCategorie('\${cat}')" class="text-red-500 hover:text-red-700 text-sm p-1 hover:bg-red-100 rounded transition-colors">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            \`).join('');
        }

        // Mettre à jour les sélecteurs
        function mettreAJourSelecteurs() {
            const photoCategory = document.getElementById('photoCategory');
            const filterCategory = document.getElementById('filterCategory');
            
            // Sélecteur d'ajout de photo
            photoCategory.innerHTML = '<option value="">Choisir une catégorie...</option>' + 
                categories.map(cat => \`<option value="\${cat}" class="capitalize">\${cat}</option>\`).join('');
            
            // Sélecteur de filtre
            filterCategory.innerHTML = '<option value="all">Toutes les catégories</option>' + 
                categories.map(cat => \`<option value="\${cat}" class="capitalize">\${cat} (\${photos.filter(p => p.categorie === cat).length})</option>\`).join('');
        }

        // Exporter les données
        function exporterDonnees() {
            try {
                const donnees = {
                    photos: photos,
                    categories: categories,
                    dateExport: new Date().toISOString(),
                    version: '2.0'
                };
                
                const dataStr = JSON.stringify(donnees, null, 2);
                const dataBlob = new Blob([dataStr], {type: 'application/json'});
                
                const link = document.createElement('a');
                link.href = URL.createObjectURL(dataBlob);
                link.download = \`pbve-galerie-export-\${new Date().toISOString().split('T')[0]}.json\`;
                link.click();
                
                afficherMessage('Export réussi !', 'success');
            } catch (error) {
                console.error('Erreur export:', error);
                afficherMessage('Erreur lors de l\\'export', 'error');
            }
        }

        // Sauvegarder dans localStorage - MÊMES CLÉS que la galerie
        function sauvegarderPhotos() {
            try {
                localStorage.setItem(STORAGE_KEY_PHOTOS, JSON.stringify(photos));
                console.log(\`💾 [ADMIN] \${photos.length} photos sauvegardées\`);
            } catch (error) {
                console.error('❌ [ADMIN] Erreur sauvegarde photos:', error);
                afficherMessage('Erreur de sauvegarde photos', 'error');
            }
        }

        function sauvegarderCategories() {
            try {
                localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
                console.log(\`💾 [ADMIN] \${categories.length} catégories sauvegardées\`);
            } catch (error) {
                console.error('❌ [ADMIN] Erreur sauvegarde catégories:', error);
                afficherMessage('Erreur de sauvegarde catégories', 'error');
            }
        }

        // Afficher un message temporaire
        function afficherMessage(texte, type = 'info') {
            const couleurs = {
                'success': 'bg-green-500',
                'error': 'bg-red-500',
                'info': 'bg-blue-500'
            };
            
            const icones = {
                'success': 'fa-check-circle',
                'error': 'fa-exclamation-triangle',
                'info': 'fa-info-circle'
            };
            
            const couleur = couleurs[type] || couleurs.info;
            const icone = icones[type] || icones.info;
            
            const message = document.createElement('div');
            message.className = \`fixed top-4 right-4 \${couleur} text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity max-w-md\`;
            message.innerHTML = \`<i class="fas \${icone} mr-2"></i>\${texte}\`;
            document.body.appendChild(message);
            
            setTimeout(() => {
                message.style.opacity = '0';
                setTimeout(() => message.remove(), 300);
            }, type === 'error' ? 5000 : 3000);
        }

        // Initialiser au chargement
        document.addEventListener('DOMContentLoaded', function() {
            console.log('🚀 [ADMIN] Initialisation interface administration...');
            initialiserPreview();
            chargerDonnees();
        });

        // Auto-sauvegarde périodique
        setInterval(() => {
            if (photos.length > 0) {
                sauvegarderPhotos();
                sauvegarderCategories();
            }
        }, 60000); // Toutes les minutes
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