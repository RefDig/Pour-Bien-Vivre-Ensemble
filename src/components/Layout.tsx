export function Layout({ children, activeMenu = 'home' }: { children: any; activeMenu?: string }) {
  const menuItems = [
    { id: 'home', label: 'Accueil', href: '/', icon: 'fas fa-home' },
    { id: 'about', label: 'À propos', href: '/a-propos', icon: 'fas fa-users' },
    { id: 'realisations', label: 'Réalisations', href: '/nos-realisations', icon: 'fas fa-star' },
    { id: 'news', label: 'Actualités', href: '/actualites', icon: 'fab fa-facebook' },
    { id: 'gallery', label: 'Galerie', href: '/galerie', icon: 'fas fa-camera' },
    { id: 'events', label: 'Événements', href: '/evenements', icon: 'fas fa-calendar' },
    { id: 'contact', label: 'Contact', href: '/contact', icon: 'fas fa-envelope' },
  ]

  return (
    <>
      {/* Header */}
      <header class="bg-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-4">
            {/* Logo */}
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <img 
                  src="/static/logo-pbve-authentique.png" 
                  alt="Logo Pour Bien Vivre Ensemble - PBVE" 
                  class="w-16 h-16 md:w-20 md:h-20 pbve-logo-header rounded-full shadow-md"
                />
              </div>
              <div class="hidden md:block">
                <h1 class="text-xl font-bold pbve-gradient-text">Pour Bien Vivre Ensemble</h1>
                <p class="text-sm font-medium" style={{ color: "#8B4513" }}>Association Lille Sud</p>
              </div>
            </div>

            {/* Navigation Desktop */}
            <nav class="hidden md:flex space-x-8">
              {(menuItems ?? []).map((item) => (
                <a
                  href={item.href}
                  class={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeMenu === item.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                  }`}
                >
                  <i class={item.icon}></i>
                  <span>{item.label}</span>
                </a>
              ))}
            </nav>

            {/* Mobile menu button */}
            <div class="md:hidden">
              <button
                type="button"
                class="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                onclick="toggleMobileMenu()"
              >
                <i class="fas fa-bars text-lg"></i>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div id="mobile-menu" class="md:hidden hidden pb-4">
            <div class="space-y-1">
              {(menuItems ?? []).map((item) => (
                <a
                  href={item.href}
                  class={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium ${
                    activeMenu === item.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                  }`}
                >
                  <i class={item.icon}></i>
                  <span>{item.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main class="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer class="bg-gray-900 text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div class="grid md:grid-cols-3 gap-8">
            {/* À propos */}
            <div>
              <div class="flex items-center space-x-3 mb-4">
                <img 
                  src="/static/logo-pbve-authentique.png" 
                  alt="Logo PBVE" 
                  class="w-10 h-10 rounded-full"
                />
                <h3 class="text-lg font-semibold">Pour Bien Vivre Ensemble</h3>
              </div>
              <p class="text-gray-400 text-sm">
                Une association dédiée au renforcement des liens sociaux et à la promotion 
                de la solidarité dans notre communauté de Lille Sud.
              </p>
            </div>

            {/* Contact rapide */}
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

            {/* Réseaux sociaux */}
            <div>
              <h3 class="text-lg font-semibold mb-4">Suivez-nous</h3>
              <div class="flex space-x-4">
                <a href="https://www.facebook.com/pourbienvivreensemble" 
                   target="_blank"
                   class="text-gray-400 hover:text-blue-400 transition-colors"
                   title="Page Facebook PBVE">
                  <i class="fab fa-facebook-f text-xl"></i>
                </a>
                <a href="#" class="text-gray-400 hover:text-pink-400 transition-colors opacity-50 cursor-not-allowed">
                  <i class="fab fa-instagram text-xl"></i>
                </a>
                <a href="#" class="text-gray-400 hover:text-sky-400 transition-colors opacity-50 cursor-not-allowed">
                  <i class="fab fa-twitter text-xl"></i>
                </a>
              </div>
              <p class="text-sm text-gray-500 mt-2">
                <i class="fab fa-facebook-f mr-1"></i>
                @pourbienvivreensemble
              </p>
            </div>
          </div>

          <div class="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Pour Bien Vivre Ensemble. Tous droits réservés.</p>
          </div>
        </div>
      </footer>

      {/* Service Worker Registration */}
      <script dangerouslySetInnerHTML={{ __html: `
        if ('serviceWorker' in navigator) {
          window.addEventListener('load', function() {
            navigator.serviceWorker.register('/static/service-worker.js')
              .then(function(registration) {
                console.log('✅ Service Worker enregistré avec succès:', registration.scope);
              })
              .catch(function(error) {
                console.log('❌ Erreur lors de l\\'enregistrement du Service Worker:', error);
              });
          });
        }
      `}} />
    </>
  )
}