import { Hono } from 'hono'

const app = new Hono()

// Interface d'administration galerie SIMPLE ET FONCTIONNELLE
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
    <div class="container mx-auto px-4 py-8 max-w-4xl">
        <!-- Header -->
        <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-3xl font-bold text-blue-600">
                        <i class="fas fa-camera mr-3"></i>
                        Administration Galerie
                    </h1>
                    <p class="text-gray-600">Ajoutez et gérez vos photos facilement</p>
                </div>
                <div class="flex space-x-3">
                    <a href="/admin/transfert" class="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                        <i class="fas fa-sync mr-2"></i>
                        Récupérer vos photos
                    </a>
                    <a href="/galerie" class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">
                        <i class="fas fa-images mr-2"></i>
                        Voir la galerie
                    </a>
                    <a href="/" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                        <i class="fas fa-home mr-2"></i>
                        Accueil
                    </a>
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
                    <input type="file" id="photoInput" accept="image/*" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    
                    <div id="preview" class="mt-4 hidden">
                        <img id="previewImage" class="w-full h-40 object-cover rounded-lg border-2 border-gray-200">
                    </div>
                </div>
                
                <!-- Informations -->
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Titre de la photo</label>
                        <input type="text" id="photoTitle" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Ex: Atelier cuisine">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea id="photoDescription" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-20" placeholder="Décrivez cette photo..."></textarea>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                        <select id="photoCategory" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            <option value="ateliers">Ateliers</option>
                            <option value="sorties">Sorties</option>
                            <option value="fetes">Fêtes</option>
                            <option value="portraits">Portraits</option>
                            <option value="activites">Activités</option>
                            <option value="evenements">Événements</option>
                        </select>
                    </div>
                    
                    <button onclick="ajouterPhoto()" class="w-full bg-green-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
                        <i class="fas fa-plus mr-2"></i>
                        Ajouter la Photo
                    </button>
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
                        <input type="text" id="newCategory" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Nom de la catégorie">
                        <button onclick="ajouterCategorie()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Catégories existantes</label>
                    <div id="categoriesList" class="space-y-2 max-h-32 overflow-y-auto">
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
                <button onclick="viderGalerie()" class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm">
                    <i class="fas fa-trash mr-2"></i>
                    Vider la galerie
                </button>
            </div>
            
            <div id="photosGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <!-- Photos seront ajoutées ici dynamiquement -->
            </div>
            
            <div id="emptyMessage" class="text-center py-12 text-gray-500">
                <i class="fas fa-images text-4xl mb-4"></i>
                <p>Aucune photo ajoutée pour le moment</p>
                <p class="text-sm">Utilisez le formulaire ci-dessus pour ajouter vos premières photos</p>
            </div>
        </div>
    </div>

    <script>
        // Données
        let photos = [];
        let categories = [];

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
                
                afficherPhotos();
                afficherCategories();
                mettreAJourSelecteur();
            } catch (error) {
                console.error('Erreur lors du chargement:', error);
                afficherMessage('Erreur lors du chargement des données', 'error');
                
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
                
                afficherPhotos();
                afficherCategories();
                mettreAJourSelecteur();
            }
        }

        // Prévisualiser l'image sélectionnée
        document.getElementById('photoInput').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('previewImage').src = e.target.result;
                    document.getElementById('preview').classList.remove('hidden');
                }
                reader.readAsDataURL(file);
            }
        });

        // Ajouter une photo
        async function ajouterPhoto() {
            const input = document.getElementById('photoInput');
            const titre = document.getElementById('photoTitle').value.trim();
            const description = document.getElementById('photoDescription').value.trim();
            const categorie = document.getElementById('photoCategory').value;
            
            if (!input.files[0]) {
                alert('Veuillez sélectionner une photo');
                return;
            }
            
            if (!titre) {
                alert('Veuillez saisir un titre');
                return;
            }
            
            const file = input.files[0];
            const reader = new FileReader();
            
            reader.onload = async function(e) {
                try {
                    const nouvellePhoto = {
                        titre: titre,
                        description: description,
                        categorie: categorie,
                        src: e.target.result
                    };
                    
                    const response = await fetch('/api/galerie/photos', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(nouvellePhoto)
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        photos.push(data.photo);
                        afficherPhotos();
                        
                        // Réinitialiser le formulaire
                        document.getElementById('photoInput').value = '';
                        document.getElementById('photoTitle').value = '';
                        document.getElementById('photoDescription').value = '';
                        document.getElementById('preview').classList.add('hidden');
                        
                        // Message de succès
                        afficherMessage('Photo ajoutée avec succès !', 'success');
                        
                        // Sauvegarder aussi en localStorage comme backup
                        sauvegarderPhotos();
                    } else {
                        afficherMessage('Erreur: ' + data.error, 'error');
                    }
                } catch (error) {
                    console.error('Erreur:', error);
                    afficherMessage('Erreur lors de l\'ajout', 'error');
                }
            };
            
            reader.readAsDataURL(file);
        }

        // Ajouter une catégorie
        function ajouterCategorie() {
            const input = document.getElementById('newCategory');
            const nouveauNom = input.value.trim().toLowerCase();
            
            if (!nouveauNom) {
                alert('Veuillez saisir un nom de catégorie');
                return;
            }
            
            if (categories.includes(nouveauNom)) {
                alert('Cette catégorie existe déjà');
                return;
            }
            
            categories.push(nouveauNom);
            sauvegarderCategories();
            afficherCategories();
            mettreAJourSelecteur();
            
            input.value = '';
            afficherMessage('Catégorie ajoutée avec succès !', 'success');
        }

        // Supprimer une catégorie
        function supprimerCategorie(nom) {
            if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
                categories = categories.filter(cat => cat !== nom);
                sauvegarderCategories();
                afficherCategories();
                mettreAJourSelecteur();
                afficherMessage('Catégorie supprimée', 'info');
            }
        }

        // Supprimer une photo
        function supprimerPhoto(id) {
            if (confirm('Êtes-vous sûr de vouloir supprimer cette photo ?')) {
                photos = photos.filter(photo => photo.id !== id);
                sauvegarderPhotos();
                afficherPhotos();
                afficherMessage('Photo supprimée', 'info');
            }
        }

        // Vider toute la galerie
        function viderGalerie() {
            if (confirm('Êtes-vous sûr de vouloir supprimer toutes les photos ? Cette action est irréversible.')) {
                photos = [];
                sauvegarderPhotos();
                afficherPhotos();
                afficherMessage('Galerie vidée', 'info');
            }
        }

        // Afficher les photos
        function afficherPhotos() {
            const grid = document.getElementById('photosGrid');
            const emptyMessage = document.getElementById('emptyMessage');
            const photoCount = document.getElementById('photoCount');
            
            photoCount.textContent = photos.length;
            
            if (photos.length === 0) {
                grid.classList.add('hidden');
                emptyMessage.classList.remove('hidden');
                return;
            }
            
            grid.classList.remove('hidden');
            emptyMessage.classList.add('hidden');
            
            grid.innerHTML = photos.map(photo => \`
                <div class="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <img src="\${photo.src}" alt="\${photo.titre}" class="w-full h-32 object-cover">
                    <div class="p-3">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">\${photo.categorie}</span>
                            <button onclick="supprimerPhoto(\${photo.id})" class="text-red-500 hover:text-red-700 text-sm">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                        <h3 class="font-medium text-sm text-gray-900 mb-1">\${photo.titre}</h3>
                        <p class="text-xs text-gray-600 mb-2">\${photo.description}</p>
                        <div class="flex justify-between text-xs text-gray-500">
                            <span>\${photo.dateAjout}</span>
                            <span><i class="fas fa-eye mr-1"></i>\${photo.vues}</span>
                        </div>
                    </div>
                </div>
            \`).join('');
        }

        // Afficher les catégories
        function afficherCategories() {
            const liste = document.getElementById('categoriesList');
            liste.innerHTML = categories.map(cat => \`
                <div class="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                    <span class="text-sm font-medium capitalize">\${cat}</span>
                    <button onclick="supprimerCategorie('\${cat}')" class="text-red-500 hover:text-red-700 text-sm">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            \`).join('');
        }

        // Mettre à jour le sélecteur de catégories
        function mettreAJourSelecteur() {
            const select = document.getElementById('photoCategory');
            select.innerHTML = categories.map(cat => 
                \`<option value="\${cat}" class="capitalize">\${cat}</option>\`
            ).join('');
        }

        // Sauvegarder dans localStorage
        function sauvegarderPhotos() {
            localStorage.setItem('pbve_photos', JSON.stringify(photos));
        }

        function sauvegarderCategories() {
            localStorage.setItem('pbve_categories', JSON.stringify(categories));
        }

        // Afficher un message temporaire
        function afficherMessage(texte, type = 'info') {
            const couleur = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
            
            const message = document.createElement('div');
            message.className = \`fixed top-4 right-4 \${couleur} text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-opacity\`;
            message.textContent = texte;
            document.body.appendChild(message);
            
            setTimeout(() => {
                message.style.opacity = '0';
                setTimeout(() => message.remove(), 300);
            }, 3000);
        }

        // Initialiser au chargement
        document.addEventListener('DOMContentLoaded', chargerDonnees);
    </script>
</body>
</html>
  `)
})

export default app