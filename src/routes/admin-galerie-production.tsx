import { Hono } from 'hono'
import { cors } from 'hono/cors'

type Bindings = {
  GALERIE_DATA: KVNamespace;
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('/*', cors())

// Interface d'administration galerie PRODUCTION - Fonctionne sur Cloudflare
app.get('/', (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Galerie - PBVE Production</title>
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
                    <p class="text-gray-600">Version production - Compatible Cloudflare</p>
                </div>
                <div class="flex space-x-3">
                    <a href="/galerie" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                        <i class="fas fa-images mr-2"></i>
                        Voir la galerie
                    </a>
                    <a href="/admin/realisations-production" class="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors">
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

        <!-- Messages -->
        <div id="messageContainer" class="mb-6"></div>

        <!-- Statistiques -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div class="bg-blue-500 text-white p-6 rounded-xl">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-blue-100">Total Photos</p>
                        <p class="text-2xl font-bold" id="statTotalPhotos">Chargement...</p>
                    </div>
                    <i class="fas fa-images text-3xl text-blue-200"></i>
                </div>
            </div>
            <div class="bg-green-500 text-white p-6 rounded-xl">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-green-100">Catégories</p>
                        <p class="text-2xl font-bold" id="statTotalCategories">Chargement...</p>
                    </div>
                    <i class="fas fa-tags text-3xl text-green-200"></i>
                </div>
            </div>
            <div class="bg-purple-500 text-white p-6 rounded-xl">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-purple-100">Dernière MAJ</p>
                        <p class="text-sm font-bold" id="statDerniereMaj">-</p>
                    </div>
                    <i class="fas fa-clock text-3xl text-purple-200"></i>
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
            
            <form id="uploadForm" class="grid md:grid-cols-2 gap-6">
                <!-- Upload -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Photo *</label>
                    <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
                        <input type="file" id="photoInput" accept="image/*" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                        <p class="text-sm text-gray-500 mt-2">
                            <i class="fas fa-info-circle mr-1"></i>
                            Formats: JPG, PNG, GIF • Max: 2MB
                        </p>
                    </div>
                    
                    <div id="preview" class="mt-4 hidden">
                        <img id="previewImage" class="w-full h-40 object-cover rounded-lg border-2 border-green-200">
                        <p class="text-sm text-gray-600 mt-2">Prévisualisation</p>
                    </div>
                </div>
                
                <!-- Informations -->
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            <i class="fas fa-text-width mr-1"></i>
                            Titre *
                        </label>
                        <input type="text" id="photoTitle" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="Titre de la photo">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            <i class="fas fa-align-left mr-1"></i>
                            Description
                        </label>
                        <textarea id="photoDescription" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 h-20" placeholder="Description (optionnelle)"></textarea>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            <i class="fas fa-tag mr-1"></i>
                            Catégorie *
                        </label>
                        <select id="photoCategory" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                            <option value="">Choisir...</option>
                        </select>
                    </div>
                    
                    <button type="submit" class="w-full bg-green-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
                        <i class="fas fa-plus mr-2"></i>
                        Ajouter la Photo
                    </button>
                </div>
            </form>
        </div>

        <!-- Gestion des catégories -->
        <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 class="text-xl font-bold text-gray-800 mb-6">
                <i class="fas fa-tags mr-2"></i>
                Gérer les Catégories
            </h2>
            
            <div class="grid md:grid-cols-2 gap-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Nouvelle catégorie</label>
                    <form id="categoryForm" class="flex gap-2">
                        <input type="text" id="newCategory" required class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="Nom de la catégorie">
                        <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                            <i class="fas fa-plus"></i>
                        </button>
                    </form>
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
                    Photos de la Galerie
                </h2>
                <div class="space-x-2">
                    <button onclick="chargerDonnees()" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm">
                        <i class="fas fa-sync-alt mr-2"></i>
                        Actualiser
                    </button>
                    <button onclick="viderGalerie()" class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm">
                        <i class="fas fa-trash mr-2"></i>
                        Vider
                    </button>
                </div>
            </div>
            
            <div id="photosGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <!-- Photos seront ajoutées ici -->
            </div>
            
            <div id="emptyMessage" class="text-center py-12 text-gray-500">
                <i class="fas fa-camera text-4xl mb-4 text-gray-300"></i>
                <p class="text-lg font-medium mb-2">Chargement des photos...</p>
            </div>
        </div>
    </div>

    <script>
        const API_BASE = '/api/galerie-production';
        
        // Gestion des données
        let photos = [];
        let categories = ['ateliers', 'sorties', 'fetes', 'portraits', 'activites', 'evenements'];

        // Initialisation
        document.addEventListener('DOMContentLoaded', function() {
            console.log('🚀 Initialisation admin galerie production');
            chargerDonnees();
            initialiserEventListeners();
        });

        function initialiserEventListeners() {
            // Upload form
            document.getElementById('uploadForm').addEventListener('submit', ajouterPhoto);
            
            // Category form  
            document.getElementById('categoryForm').addEventListener('submit', ajouterCategorie);
            
            // File preview
            document.getElementById('photoInput').addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    if (file.size > 2 * 1024 * 1024) {
                        afficherMessage('Fichier trop volumineux (max 2MB)', 'error');
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

        // Charger les données depuis l'API
        async function chargerDonnees() {
            try {
                console.log('📡 Chargement des données...');
                
                // Charger photos
                const photosResponse = await fetch(\`\${API_BASE}/photos\`);
                if (photosResponse.ok) {
                    photos = await photosResponse.json();
                }
                
                // Charger catégories  
                const categoriesResponse = await fetch(\`\${API_BASE}/categories\`);
                if (categoriesResponse.ok) {
                    categories = await categoriesResponse.json();
                }
                
                mettreAJourInterface();
                
            } catch (error) {
                console.error('❌ Erreur chargement:', error);
                afficherMessage('Erreur de chargement des données', 'error');
            }
        }

        // Mettre à jour l'interface
        function mettreAJourInterface() {
            mettreAJourStatistiques();
            mettreAJourCategories();
            afficherPhotos();
        }

        // Statistiques
        function mettreAJourStatistiques() {
            document.getElementById('statTotalPhotos').textContent = photos.length;
            document.getElementById('statTotalCategories').textContent = categories.length;
            document.getElementById('statDerniereMaj').textContent = new Date().toLocaleString('fr-FR');
        }

        // Mettre à jour les catégories
        function mettreAJourCategories() {
            const selecteur = document.getElementById('photoCategory');
            const liste = document.getElementById('categoriesList');
            
            // Sélecteur
            selecteur.innerHTML = '<option value="">Choisir une catégorie...</option>' + 
                categories.map(cat => \`<option value="\${cat}" class="capitalize">\${cat}</option>\`).join('');
            
            // Liste des catégories
            if (categories.length === 0) {
                liste.innerHTML = '<p class="text-gray-500 text-sm">Aucune catégorie</p>';
            } else {
                liste.innerHTML = categories.map((cat, index) => \`
                    <div class="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                        <span class="text-sm font-medium capitalize">\${cat}</span>
                        <button onclick="supprimerCategorie('\${cat}')" class="text-red-500 hover:text-red-700 text-sm">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                \`).join('');
            }
        }

        // Afficher les photos
        function afficherPhotos() {
            const grid = document.getElementById('photosGrid');
            const emptyMessage = document.getElementById('emptyMessage');
            
            if (photos.length === 0) {
                grid.classList.add('hidden');
                emptyMessage.classList.remove('hidden');
                emptyMessage.innerHTML = \`
                    <i class="fas fa-camera text-4xl mb-4 text-gray-300"></i>
                    <p class="text-lg font-medium mb-2">Aucune photo dans la galerie</p>
                    <p class="text-sm text-gray-500">Ajoutez votre première photo avec le formulaire ci-dessus</p>
                \`;
                return;
            }
            
            grid.classList.remove('hidden');
            emptyMessage.classList.add('hidden');
            
            grid.innerHTML = photos.map(photo => \`
                <div class="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div class="relative">
                        <img src="\${photo.src}" alt="\${photo.titre}" class="w-full h-32 object-cover">
                        <div class="absolute top-2 right-2">
                            <button onclick="supprimerPhoto('\${photo.id}')" class="bg-red-500 text-white p-1 rounded-full text-xs hover:bg-red-600 transition-colors">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                        <div class="absolute top-2 left-2">
                            <span class="bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">\${photo.categorie}</span>
                        </div>
                    </div>
                    <div class="p-3">
                        <h3 class="font-medium text-sm text-gray-900 mb-1 truncate">\${photo.titre}</h3>
                        <p class="text-xs text-gray-600 mb-2">\${photo.description || 'Pas de description'}</p>
                        <div class="text-xs text-gray-500">
                            <span><i class="fas fa-calendar mr-1"></i>\${photo.dateAjout}</span>
                        </div>
                    </div>
                </div>
            \`).join('');
        }

        // Ajouter une photo
        async function ajouterPhoto(e) {
            e.preventDefault();
            
            const input = document.getElementById('photoInput');
            const titre = document.getElementById('photoTitle').value.trim();
            const description = document.getElementById('photoDescription').value.trim();
            const categorie = document.getElementById('photoCategory').value;
            
            if (!input.files[0] || !titre || !categorie) {
                afficherMessage('Veuillez remplir tous les champs obligatoires', 'error');
                return;
            }
            
            try {
                const file = input.files[0];
                const reader = new FileReader();
                
                reader.onload = async function(e) {
                    const photoData = {
                        id: Date.now(),
                        titre: titre,
                        description: description,
                        categorie: categorie,
                        src: e.target.result,
                        dateAjout: new Date().toLocaleDateString('fr-FR'),
                        vues: 0
                    };
                    
                    const response = await fetch(\`\${API_BASE}/photos\`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(photoData)
                    });
                    
                    if (response.ok) {
                        afficherMessage('Photo ajoutée avec succès !', 'success');
                        document.getElementById('uploadForm').reset();
                        document.getElementById('preview').classList.add('hidden');
                        chargerDonnees();
                    } else {
                        throw new Error('Erreur serveur');
                    }
                };
                
                reader.readAsDataURL(file);
                
            } catch (error) {
                console.error('❌ Erreur ajout photo:', error);
                afficherMessage('Erreur lors de l\\'ajout de la photo', 'error');
            }
        }

        // Ajouter une catégorie
        async function ajouterCategorie(e) {
            e.preventDefault();
            
            const input = document.getElementById('newCategory');
            const nom = input.value.trim().toLowerCase();
            
            if (!nom) {
                afficherMessage('Veuillez saisir un nom de catégorie', 'error');
                return;
            }
            
            if (categories.includes(nom)) {
                afficherMessage('Cette catégorie existe déjà', 'error');
                return;
            }
            
            try {
                const response = await fetch(\`\${API_BASE}/categories\`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nom: nom })
                });
                
                if (response.ok) {
                    afficherMessage(\`Catégorie "\${nom}" ajoutée !\`, 'success');
                    input.value = '';
                    chargerDonnees();
                } else {
                    throw new Error('Erreur serveur');
                }
            } catch (error) {
                console.error('❌ Erreur ajout catégorie:', error);
                afficherMessage('Erreur lors de l\\'ajout de la catégorie', 'error');
            }
        }

        // Supprimer une photo
        async function supprimerPhoto(id) {
            if (!confirm('Supprimer cette photo ?')) return;
            
            try {
                const response = await fetch(\`\${API_BASE}/photos/\${id}\`, {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    afficherMessage('Photo supprimée', 'info');
                    chargerDonnees();
                } else {
                    throw new Error('Erreur serveur');
                }
            } catch (error) {
                console.error('❌ Erreur suppression photo:', error);
                afficherMessage('Erreur lors de la suppression', 'error');
            }
        }

        // Supprimer une catégorie
        async function supprimerCategorie(nom) {
            if (!confirm(\`Supprimer la catégorie "\${nom}" ?\`)) return;
            
            try {
                const response = await fetch(\`\${API_BASE}/categories/\${encodeURIComponent(nom)}\`, {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    afficherMessage('Catégorie supprimée', 'info');
                    chargerDonnees();
                } else {
                    throw new Error('Erreur serveur');
                }
            } catch (error) {
                console.error('❌ Erreur suppression catégorie:', error);
                afficherMessage('Erreur lors de la suppression', 'error');
            }
        }

        // Vider la galerie
        async function viderGalerie() {
            if (!confirm('Supprimer TOUTES les photos ? Cette action est irréversible !')) return;
            
            try {
                const response = await fetch(\`\${API_BASE}/photos/clear\`, {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    afficherMessage('Galerie vidée', 'info');
                    chargerDonnees();
                } else {
                    throw new Error('Erreur serveur');
                }
            } catch (error) {
                console.error('❌ Erreur vidage galerie:', error);
                afficherMessage('Erreur lors du vidage', 'error');
            }
        }

        // Afficher un message
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
            
            const message = document.createElement('div');
            message.className = \`\${couleurs[type] || couleurs.info} text-white px-6 py-3 rounded-lg shadow-lg mb-4 flex items-center\`;
            message.innerHTML = \`<i class="fas \${icones[type] || icones.info} mr-2"></i>\${texte}\`;
            
            const container = document.getElementById('messageContainer');
            container.appendChild(message);
            
            setTimeout(() => {
                message.remove();
            }, type === 'error' ? 5000 : 3000);
        }
    </script>
</body>
</html>
  `)
})

export default app