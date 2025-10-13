import { Hono } from 'hono'
import { setCookie } from 'hono/cookie'

const app = new Hono()

// Page de connexion simple qui fonctionne
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Connexion Admin - PBVE</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
            .pbve-gradient-bg { background: linear-gradient(135deg, #3b82f6, #6366f1); }
            .pbve-gradient-text { background: linear-gradient(135deg, #3b82f6, #6366f1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        </style>
    </head>
    <body class="min-h-screen pbve-gradient-bg flex items-center justify-center py-12 px-4">
        <div class="max-w-md w-full">
            <!-- Retour au site -->
            <div class="text-center mb-6">
                <a href="/" class="text-white/80 hover:text-white text-sm font-medium">
                    <i class="fas fa-arrow-left mr-2"></i>
                    Retour au site
                </a>
            </div>

            <div class="bg-white rounded-2xl shadow-2xl p-8">
                <!-- Header -->
                <div class="text-center mb-8">
                    <div class="w-20 h-20 pbve-gradient-bg rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-user-shield text-white text-2xl"></i>
                    </div>
                    <h1 class="text-2xl font-bold pbve-gradient-text">
                        Espace Administrateur
                    </h1>
                    <p class="text-gray-600 mt-2">Pour Bien Vivre Ensemble - PBVE</p>
                </div>

                <!-- Informations de connexion -->
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h3 class="text-sm font-semibold text-blue-800 mb-2">
                        <i class="fas fa-info-circle mr-1"></i>
                        Identifiants de connexion :
                    </h3>
                    <div class="text-xs text-blue-700 space-y-1">
                        <p><strong>Email :</strong> admin@pourbienvivreensemble.fr</p>
                        <p><strong>Mot de passe :</strong> admin123</p>
                    </div>
                </div>

                <!-- Formulaire -->
                <form onsubmit="handleLogin(event)" class="space-y-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            <i class="fas fa-envelope mr-2 text-gray-400"></i>
                            Adresse email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value="admin@pourbienvivreensemble.fr"
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="admin@pourbienvivreensemble.fr"
                        />
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            <i class="fas fa-lock mr-2 text-gray-400"></i>
                            Mot de passe
                        </label>
                        <input
                            type="password"
                            id="password"
                            value="admin123"
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="••••••••"
                        />
                    </div>
                    
                    <button
                        type="submit"
                        class="w-full pbve-gradient-bg text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                    >
                        <i class="fas fa-sign-in-alt mr-2"></i>
                        Se connecter
                    </button>
                </form>

                <!-- Accès direct -->
                <div class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h3 class="text-sm font-semibold text-green-800 mb-3">
                        <i class="fas fa-rocket mr-1"></i>
                        Accès direct aux fonctionnalités :
                    </h3>
                    <div class="space-y-2">
                        <a href="/admin/galerie-simple" class="block w-full bg-green-600 text-white py-2 px-4 rounded-lg text-center font-medium hover:bg-green-700 transition-colors text-sm">
                            <i class="fas fa-images mr-2"></i>
                            Gestion de la Galerie
                        </a>
                        <a href="/galerie" class="block w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-center font-medium hover:bg-blue-700 transition-colors text-sm">
                            <i class="fas fa-eye mr-2"></i>
                            Voir Galerie Publique
                        </a>
                    </div>
                </div>

                <div class="mt-6 text-center text-xs text-gray-500">
                    <i class="fas fa-shield-alt mr-1"></i>
                    Accès réservé aux administrateurs PBVE
                </div>
            </div>

            <!-- Liens d'aide -->
            <div class="text-center mt-6 space-y-2">
                <div class="text-white/80 text-sm">
                    <i class="fas fa-question-circle mr-1"></i>
                    Problème de connexion ?
                </div>
                <div class="space-x-4">
                    <a href="mailto:contact@pourbienvivreensemble.fr" class="text-white/80 hover:text-white text-sm underline">
                        Contacter le support
                    </a>
                    <a href="/" class="text-white/80 hover:text-white text-sm underline">
                        Retour accueil
                    </a>
                </div>
            </div>
        </div>

        <script>
            function handleLogin(event) {
                event.preventDefault();
                
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                
                // Validation simple
                if (email === 'admin@pourbienvivreensemble.fr' && password === 'admin123') {
                    // Succès - rediriger vers la galerie
                    alert('Connexion réussie ! Redirection vers la gestion de galerie...');
                    window.location.href = '/admin/galerie-simple';
                } else {
                    alert('Identifiants incorrects. Utilisez admin@pourbienvivreensemble.fr / admin123');
                }
            }
            
            // Auto-focus sur le premier champ vide
            document.addEventListener('DOMContentLoaded', function() {
                const email = document.getElementById('email');
                const password = document.getElementById('password');
                
                if (!email.value) {
                    email.focus();
                } else if (!password.value) {
                    password.focus();
                }
            });
        </script>
    </body>
    </html>
  `)
})

// Traitement de la connexion (optionnel)
app.post('/', async (c) => {
  // Cette route peut traiter le POST si nécessaire
  return c.redirect('/admin/galerie-simple')
})

export default app