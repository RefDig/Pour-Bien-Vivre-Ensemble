import { Hono } from 'hono'

const app = new Hono()

// Page utilitaire pour transférer les données du localStorage vers l'API
app.get('/', (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Transfert des Données - PBVE</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50 min-h-screen">
    <div class="container mx-auto px-4 py-8 max-w-2xl">
        <div class="bg-white rounded-xl shadow-lg p-6">
            <h1 class="text-2xl font-bold text-blue-600 mb-6">
                <i class="fas fa-sync mr-2"></i>
                Récupération des Photos
            </h1>
            
            <div class="mb-6">
                <p class="text-gray-600 mb-4">
                    Cet outil vous permet de récupérer les photos que vous avez téléchargées 
                    précédemment et qui sont stockées dans votre navigateur.
                </p>
                
                <div id="status" class="p-4 rounded-lg bg-blue-50 text-blue-700">
                    <i class="fas fa-info-circle mr-2"></i>
                    Prêt à transférer vos données
                </div>
            </div>
            
            <div class="space-y-4">
                <button onclick="verifierDonnees()" class="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                    <i class="fas fa-search mr-2"></i>
                    Vérifier les données disponibles
                </button>
                
                <button onclick="transfererDonnees()" id="transferBtn" class="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors" disabled>
                    <i class="fas fa-upload mr-2"></i>
                    Transférer vers le serveur
                </button>
                
                <button onclick="viderLocalStorage()" class="w-full bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 transition-colors">
                    <i class="fas fa-trash mr-2"></i>
                    Vider le stockage local (après transfert)
                </button>
            </div>
            
            <div id="resultats" class="mt-6"></div>
            
            <div class="mt-6 text-center">
                <a href="/admin/galerie-fonctionnelle" class="inline-flex items-center text-blue-600 hover:text-blue-700">
                    <i class="fas fa-arrow-left mr-2"></i>
                    Retour à l'administration
                </a>
            </div>
        </div>
    </div>

    <script>
        let photosLocales = [];
        let categoriesLocales = [];

        function updateStatus(message, type = 'info') {
            const statusDiv = document.getElementById('status');
            const colors = {
                'info': 'bg-blue-50 text-blue-700',
                'success': 'bg-green-50 text-green-700',
                'error': 'bg-red-50 text-red-700',
                'warning': 'bg-yellow-50 text-yellow-700'
            };
            
            statusDiv.className = \`p-4 rounded-lg \${colors[type] || colors.info}\`;
            statusDiv.innerHTML = \`<i class="fas fa-\${type === 'success' ? 'check' : type === 'error' ? 'times' : 'info'}-circle mr-2"></i>\${message}\`;
        }

        function verifierDonnees() {
            const photos = localStorage.getItem('pbve_photos');
            const categories = localStorage.getItem('pbve_categories');
            
            photosLocales = photos ? JSON.parse(photos) : [];
            categoriesLocales = categories ? JSON.parse(categories) : [];
            
            const resultsDiv = document.getElementById('resultats');
            
            if (photosLocales.length === 0 && categoriesLocales.length === 0) {
                updateStatus('Aucune donnée trouvée dans le stockage local', 'warning');
                resultsDiv.innerHTML = \`
                    <div class="p-4 bg-yellow-50 rounded-lg">
                        <p class="text-yellow-700">
                            <i class="fas fa-exclamation-triangle mr-2"></i>
                            Aucune photo ou catégorie n'a été trouvée dans le stockage local de votre navigateur.
                        </p>
                    </div>
                \`;
                document.getElementById('transferBtn').disabled = true;
                return;
            }
            
            updateStatus(\`Données trouvées: \${photosLocales.length} photos, \${categoriesLocales.length} catégories\`, 'success');
            
            resultsDiv.innerHTML = \`
                <div class="space-y-4">
                    <div class="p-4 bg-green-50 rounded-lg">
                        <h3 class="font-semibold text-green-700 mb-2">
                            <i class="fas fa-images mr-2"></i>
                            Photos trouvées (\${photosLocales.length})
                        </h3>
                        <div class="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                            \${photosLocales.map(photo => \`
                                <div class="text-xs bg-white p-2 rounded shadow">
                                    <div class="font-medium truncate">\${photo.titre}</div>
                                    <div class="text-gray-500 capitalize">\${photo.categorie}</div>
                                </div>
                            \`).join('')}
                        </div>
                    </div>
                    
                    \${categoriesLocales.length > 0 ? \`
                    <div class="p-4 bg-blue-50 rounded-lg">
                        <h3 class="font-semibold text-blue-700 mb-2">
                            <i class="fas fa-tags mr-2"></i>
                            Catégories (\${categoriesLocales.length})
                        </h3>
                        <div class="flex flex-wrap gap-2">
                            \${categoriesLocales.map(cat => \`
                                <span class="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs capitalize">\${cat}</span>
                            \`).join('')}
                        </div>
                    </div>
                    \` : ''}
                </div>
            \`;
            
            document.getElementById('transferBtn').disabled = false;
        }

        async function transfererDonnees() {
            if (photosLocales.length === 0 && categoriesLocales.length === 0) {
                updateStatus('Aucune donnée à transférer', 'warning');
                return;
            }
            
            updateStatus('Transfert en cours...', 'info');
            let success = 0;
            let errors = 0;
            
            try {
                // Transférer les catégories d'abord
                for (const categorie of categoriesLocales) {
                    try {
                        const response = await fetch('/api/galerie/categories', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ nom: categorie })
                        });
                        
                        if (response.ok) {
                            success++;
                        } else {
                            errors++;
                        }
                    } catch (error) {
                        errors++;
                    }
                }
                
                // Transférer les photos
                for (const photo of photosLocales) {
                    try {
                        const response = await fetch('/api/galerie/photos', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                titre: photo.titre,
                                description: photo.description,
                                categorie: photo.categorie,
                                src: photo.src
                            })
                        });
                        
                        if (response.ok) {
                            success++;
                        } else {
                            errors++;
                        }
                    } catch (error) {
                        errors++;
                    }
                }
                
                if (errors === 0) {
                    updateStatus(\`Transfert terminé avec succès ! \${success} éléments transférés\`, 'success');
                    document.getElementById('resultats').innerHTML += \`
                        <div class="mt-4 p-4 bg-green-50 rounded-lg">
                            <p class="text-green-700">
                                <i class="fas fa-check-circle mr-2"></i>
                                Toutes vos photos ont été transférées avec succès vers le serveur.
                                Vous pouvez maintenant vider le stockage local en toute sécurité.
                            </p>
                        </div>
                    \`;
                } else {
                    updateStatus(\`Transfert terminé avec \${errors} erreurs sur \${success + errors} éléments\`, 'warning');
                }
                
            } catch (error) {
                updateStatus('Erreur lors du transfert', 'error');
                console.error('Erreur:', error);
            }
        }
        
        function viderLocalStorage() {
            if (confirm('Êtes-vous sûr de vouloir vider le stockage local ? Cette action est irréversible.')) {
                localStorage.removeItem('pbve_photos');
                localStorage.removeItem('pbve_categories');
                
                updateStatus('Stockage local vidé', 'success');
                document.getElementById('resultats').innerHTML = '';
                document.getElementById('transferBtn').disabled = true;
                
                photosLocales = [];
                categoriesLocales = [];
            }
        }
    </script>
</body>
</html>
  `)
})

export default app