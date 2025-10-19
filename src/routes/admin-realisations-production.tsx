import { Hono } from 'hono'
import { cors } from 'hono/cors'

type Bindings = {
  REALISATIONS_DATA: any;
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('/*', cors())

// Interface d'administration réalisations PRODUCTION - Compatible Cloudflare
app.get('/', (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Réalisations - PBVE Production</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50 min-h-screen">
    <div class="container mx-auto px-4 py-8 max-w-6xl">
        <!-- Header -->
        <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-3xl font-bold text-purple-600">
                        <i class="fas fa-star mr-3"></i>
                        Administration Réalisations PBVE
                    </h1>
                    <p class="text-gray-600">Gestion des contenus : Textes, Vidéos, Livres Audio, Podcasts, Flipbooks</p>
                </div>
                <div class="flex space-x-3">
                    <a href="/realisations" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                        <i class="fas fa-eye mr-2"></i>
                        Voir les réalisations
                    </a>
                    <a href="/admin/galerie-production" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                        <i class="fas fa-images mr-2"></i>
                        Galerie
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
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div class="bg-blue-500 text-white p-4 rounded-xl">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-blue-100 text-sm">Textes</p>
                        <p class="text-xl font-bold" id="statTextes">0</p>
                    </div>
                    <i class="fas fa-file-alt text-2xl text-blue-200"></i>
                </div>
            </div>
            <div class="bg-red-500 text-white p-4 rounded-xl">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-red-100 text-sm">Vidéos</p>
                        <p class="text-xl font-bold" id="statVideos">0</p>
                    </div>
                    <i class="fas fa-play text-2xl text-red-200"></i>
                </div>
            </div>
            <div class="bg-green-500 text-white p-4 rounded-xl">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-green-100 text-sm">Livres Audio</p>
                        <p class="text-xl font-bold" id="statLivresAudio">0</p>
                    </div>
                    <i class="fas fa-headphones text-2xl text-green-200"></i>
                </div>
            </div>
            <div class="bg-yellow-500 text-white p-4 rounded-xl">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-yellow-100 text-sm">Podcasts</p>
                        <p class="text-xl font-bold" id="statPodcasts">0</p>
                    </div>
                    <i class="fas fa-podcast text-2xl text-yellow-200"></i>
                </div>
            </div>
            <div class="bg-purple-500 text-white p-4 rounded-xl">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-purple-100 text-sm">Flipbooks</p>
                        <p class="text-xl font-bold" id="statFlipbooks">0</p>
                    </div>
                    <i class="fas fa-book text-2xl text-purple-200"></i>
                </div>
            </div>
        </div>

        <!-- Formulaire d'ajout -->
        <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 class="text-xl font-bold text-gray-800 mb-6">
                <i class="fas fa-plus-circle mr-2"></i>
                Ajouter une Réalisation
            </h2>
            
            <form id="realisationForm" class="grid md:grid-cols-2 gap-6">
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            <i class="fas fa-text-width mr-1"></i>
                            Titre *
                        </label>
                        <input type="text" id="realisationTitre" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="Titre de la réalisation">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            <i class="fas fa-align-left mr-1"></i>
                            Description *
                        </label>
                        <textarea id="realisationDescription" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 h-24" placeholder="Description du contenu"></textarea>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            <i class="fas fa-tag mr-1"></i>
                            Catégorie *
                        </label>
                        <select id="realisationCategorie" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                            <option value="">Choisir une catégorie...</option>
                            <option value="textes">📄 Textes</option>
                            <option value="videos">🎥 Vidéos</option>
                            <option value="livres-audio">🎧 Livres Audio</option>
                            <option value="podcasts">🎙️ Podcasts</option>
                            <option value="flipbooks">📖 Flipbooks</option>
                        </select>
                    </div>
                </div>
                
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            <i class="fas fa-link mr-1"></i>
                            URL/Lien *
                        </label>
                        <input type="url" id="realisationUrl" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="https://exemple.com/ressource">
                        <p class="text-xs text-gray-500 mt-1">Lien vers la ressource (fichier, vidéo, page web...)</p>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            <i class="fas fa-user mr-1"></i>
                            Auteur/Créateur
                        </label>
                        <input type="text" id="realisationAuteur" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="Nom de l'auteur ou créateur">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            <i class="fas fa-tags mr-1"></i>
                            Tags (optionnel)
                        </label>
                        <input type="text" id="realisationTags" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="tag1, tag2, tag3">
                        <p class="text-xs text-gray-500 mt-1">Séparez les tags par des virgules</p>
                    </div>
                    
                    <div class="flex items-center space-x-2">
                        <input type="checkbox" id="realisationMiseEnAvant" class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded">
                        <label for="realisationMiseEnAvant" class="text-sm text-gray-700">
                            <i class="fas fa-star mr-1 text-yellow-500"></i>
                            Mettre en avant (apparaît en premier)
                        </label>
                    </div>
                    
                    <button type="submit" class="w-full bg-purple-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                        <i class="fas fa-save mr-2"></i>
                        Enregistrer la Réalisation
                    </button>
                </div>
            </form>
        </div>

        <!-- Liste des réalisations -->
        <div class="bg-white rounded-xl shadow-lg p-6">
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-bold text-gray-800">
                    <i class="fas fa-list mr-2"></i>
                    Réalisations Existantes
                </h2>
                <div class="space-x-2">
                    <button onclick="chargerRealisations()" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm">
                        <i class="fas fa-sync-alt mr-2"></i>
                        Actualiser
                    </button>
                    <select id="filtreCategorie" onchange="filtrerRealisations()" class="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                        <option value="">Toutes les catégories</option>
                        <option value="textes">Textes</option>
                        <option value="videos">Vidéos</option>
                        <option value="livres-audio">Livres Audio</option>
                        <option value="podcasts">Podcasts</option>
                        <option value="flipbooks">Flipbooks</option>
                    </select>
                </div>
            </div>
            
            <div id="realisationsList" class="space-y-4">
                <!-- Les réalisations seront ajoutées ici -->
            </div>
            
            <div id="emptyMessage" class="text-center py-12 text-gray-500">
                <i class="fas fa-star text-4xl mb-4 text-gray-300"></i>
                <p class="text-lg font-medium mb-2">Chargement des réalisations...</p>
            </div>
        </div>
    </div>

    <script>
        const API_BASE = '/api/realisations-production';
        
        // Gestion des données
        let realisations = [];
        let categoriesIcons = {
            'textes': { icon: 'fas fa-file-alt', color: 'blue' },
            'videos': { icon: 'fas fa-play', color: 'red' },
            'livres-audio': { icon: 'fas fa-headphones', color: 'green' },
            'podcasts': { icon: 'fas fa-podcast', color: 'yellow' },
            'flipbooks': { icon: 'fas fa-book', color: 'purple' }
        };

        // Initialisation
        document.addEventListener('DOMContentLoaded', function() {
            console.log('🚀 Initialisation admin réalisations production');
            chargerRealisations();
            initialiserEventListeners();
        });

        function initialiserEventListeners() {
            document.getElementById('realisationForm').addEventListener('submit', ajouterRealisation);
        }

        // Charger les réalisations depuis l'API
        async function chargerRealisations() {
            try {
                console.log('📡 Chargement des réalisations...');
                
                const response = await fetch(\`\${API_BASE}/realisations\`);
                if (response.ok) {
                    realisations = await response.json();
                } else {
                    realisations = [];
                }
                
                mettreAJourInterface();
                
            } catch (error) {
                console.error('❌ Erreur chargement réalisations:', error);
                afficherMessage('Erreur de chargement des réalisations', 'error');
                realisations = [];
                mettreAJourInterface();
            }
        }

        // Mettre à jour l'interface
        function mettreAJourInterface() {
            mettreAJourStatistiques();
            afficherRealisations();
        }

        // Statistiques par catégorie
        function mettreAJourStatistiques() {
            const stats = {
                textes: realisations.filter(r => r.categorie === 'textes').length,
                videos: realisations.filter(r => r.categorie === 'videos').length,
                'livres-audio': realisations.filter(r => r.categorie === 'livres-audio').length,
                podcasts: realisations.filter(r => r.categorie === 'podcasts').length,
                flipbooks: realisations.filter(r => r.categorie === 'flipbooks').length
            };

            document.getElementById('statTextes').textContent = stats.textes;
            document.getElementById('statVideos').textContent = stats.videos;
            document.getElementById('statLivresAudio').textContent = stats['livres-audio'];
            document.getElementById('statPodcasts').textContent = stats.podcasts;
            document.getElementById('statFlipbooks').textContent = stats.flipbooks;
        }

        // Afficher la liste des réalisations
        function afficherRealisations() {
            const liste = document.getElementById('realisationsList');
            const emptyMessage = document.getElementById('emptyMessage');
            
            if (realisations.length === 0) {
                liste.classList.add('hidden');
                emptyMessage.classList.remove('hidden');
                emptyMessage.innerHTML = \`
                    <i class="fas fa-star text-4xl mb-4 text-gray-300"></i>
                    <p class="text-lg font-medium mb-2">Aucune réalisation</p>
                    <p class="text-sm text-gray-500">Ajoutez votre première réalisation avec le formulaire ci-dessus</p>
                \`;
                return;
            }
            
            liste.classList.remove('hidden');
            emptyMessage.classList.add('hidden');
            
            // Trier par mise en avant puis par date
            const realisationsTries = [...realisations].sort((a, b) => {
                if (a.miseEnAvant && !b.miseEnAvant) return -1;
                if (!a.miseEnAvant && b.miseEnAvant) return 1;
                return new Date(b.dateCreation) - new Date(a.dateCreation);
            });
            
                liste.innerHTML = (realisationsTries ?? []).map(realisation => {
                const catInfo = categoriesIcons[realisation.categorie] || { icon: 'fas fa-file', color: 'gray' };
                
                return \`
                    <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow \${realisation.miseEnAvant ? 'bg-yellow-50 border-yellow-300' : ''}">
                        <div class="flex items-start justify-between">
                            <div class="flex-1">
                                <div class="flex items-center space-x-3 mb-2">
                                    <i class="\${catInfo.icon} text-\${catInfo.color}-600"></i>
                                    <h3 class="text-lg font-semibold text-gray-900">\${realisation.titre}</h3>
                                    \${realisation.miseEnAvant ? '<span class="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full"><i class="fas fa-star mr-1"></i>Mis en avant</span>' : ''}
                                </div>
                                
                                <p class="text-gray-600 mb-2">\${realisation.description}</p>
                                
                                <div class="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                                    <span><i class="fas fa-calendar mr-1"></i>\${realisation.dateCreation}</span>
                                    \${realisation.auteur ? \`<span><i class="fas fa-user mr-1"></i>\${realisation.auteur}</span>\` : ''}
                                    <span class="capitalize"><i class="fas fa-tag mr-1"></i>\${realisation.categorie}</span>
                                </div>
                                
                                    \${(realisation.tags ?? []) && realisation.tags.length > 0 ? \`
                                    <div class="flex flex-wrap gap-1 mb-2">
                                        \${realisation.tags.map(tag => \`<span class="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">\${tag}</span>\`).join('')}
                                    </div>
                                \` : ''}
                                
                                <div class="flex space-x-2">
                                    <a href="\${realisation.url}" target="_blank" class="text-blue-600 hover:text-blue-800 text-sm">
                                        <i class="fas fa-external-link-alt mr-1"></i>
                                        Ouvrir
                                    </a>
                                    <button onclick="modifierRealisation('\${realisation.id}')" class="text-green-600 hover:text-green-800 text-sm">
                                        <i class="fas fa-edit mr-1"></i>
                                        Modifier
                                    </button>
                                    <button onclick="supprimerRealisation('\${realisation.id}')" class="text-red-600 hover:text-red-800 text-sm">
                                        <i class="fas fa-trash mr-1"></i>
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                \`;
            }).join('');
        }

        // Ajouter une réalisation
        async function ajouterRealisation(e) {
            e.preventDefault();
            
            const titre = document.getElementById('realisationTitre').value.trim();
            const description = document.getElementById('realisationDescription').value.trim();
            const categorie = document.getElementById('realisationCategorie').value;
            const url = document.getElementById('realisationUrl').value.trim();
            const auteur = document.getElementById('realisationAuteur').value.trim();
            const tagsStr = document.getElementById('realisationTags').value.trim();
            const miseEnAvant = document.getElementById('realisationMiseEnAvant').checked;
            
            if (!titre || !description || !categorie || !url) {
                afficherMessage('Veuillez remplir tous les champs obligatoires', 'error');
                return;
            }
            
            try {
                const realisationData = {
                    id: Date.now(),
                    titre: titre,
                    description: description,
                    categorie: categorie,
                    url: url,
                    auteur: auteur || null,
                    tags: tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(t => t) : [],
                    miseEnAvant: miseEnAvant,
                    dateCreation: new Date().toLocaleDateString('fr-FR'),
                    vues: 0
                };
                
                const response = await fetch(\`\${API_BASE}/realisations\`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(realisationData)
                });
                
                if (response.ok) {
                    afficherMessage('Réalisation ajoutée avec succès !', 'success');
                    document.getElementById('realisationForm').reset();
                    chargerRealisations();
                } else {
                    const error = await response.json();
                    throw new Error(error.error || 'Erreur serveur');
                }
                
            } catch (error) {
                console.error('❌ Erreur ajout réalisation:', error);
                afficherMessage('Erreur lors de l\\'ajout : ' + error.message, 'error');
            }
        }

        // Supprimer une réalisation
        async function supprimerRealisation(id) {
            if (!confirm('Supprimer cette réalisation ?')) return;
            
            try {
                const response = await fetch(\`\${API_BASE}/realisations/\${id}\`, {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    afficherMessage('Réalisation supprimée', 'info');
                    chargerRealisations();
                } else {
                    throw new Error('Erreur serveur');
                }
            } catch (error) {
                console.error('❌ Erreur suppression réalisation:', error);
                afficherMessage('Erreur lors de la suppression', 'error');
            }
        }

        // Modifier une réalisation (version simplifiée - ouverture du lien)
        function modifierRealisation(id) {
            const realisation = realisations.find(r => r.id.toString() === id);
            if (realisation) {
                // Pré-remplir le formulaire
                document.getElementById('realisationTitre').value = realisation.titre;
                document.getElementById('realisationDescription').value = realisation.description;
                document.getElementById('realisationCategorie').value = realisation.categorie;
                document.getElementById('realisationUrl').value = realisation.url;
                document.getElementById('realisationAuteur').value = realisation.auteur || '';
                document.getElementById('realisationTags').value = realisation.tags ? realisation.tags.join(', ') : '';
                document.getElementById('realisationMiseEnAvant').checked = realisation.miseEnAvant;
                
                // Faire défiler vers le formulaire
                document.getElementById('realisationForm').scrollIntoView({ behavior: 'smooth' });
                
                // Supprimer l'ancienne pour éviter les doublons
                supprimerRealisation(id);
            }
        }

        // Filtrer par catégorie
        function filtrerRealisations() {
            const filtre = document.getElementById('filtreCategorie').value;
            const items = document.querySelectorAll('#realisationsList > div');
            
            items.forEach(item => {
                if (!filtre) {
                    item.style.display = 'block';
                } else {
                    const categorieElement = item.querySelector('.capitalize');
                    const categorie = categorieElement ? categorieElement.textContent.replace('🏷️ ', '').trim().toLowerCase() : '';
                    item.style.display = categorie === filtre ? 'block' : 'none';
                }
            });
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