import { Hono } from 'hono'
import { renderer } from './renderer'
import { Layout } from './components/Layout'
import './index.css';
import authRoutes from './routes/auth'
import adminRoutes from './routes/admin'
import adminGalerieRoutes from './routes/admin-galerie-simple'
import adminGalerieFonctionnelleRoutes from './routes/admin-galerie-fonctionnelle'
import adminGalerieCorrigeeRoutes from './routes/admin-galerie-corrigee'
import adminGalerieProductionRoutes from './routes/admin-galerie-production'
import adminAchievementsRoutes from './routes/admin-achievements'
import achievementsRoutes from './routes/achievements'
import realisationsRoutes from './routes/realisations'
import adminRealisationsRoutes from './routes/admin-realisations'
import adminRealisationsProductionRoutes from './routes/admin-realisations-production'
import galerieSimpleRoutes from './routes/galerie-simple'
import galerieDynamiqueRoutes from './routes/galerie-dynamique'
import galerieCorrigeeRoutes from './routes/galerie-corrigee'
import loginSimpleRoutes from './routes/login-simple'
import apiGalerieRoutes from './routes/api-galerie'
import apiGalerieProductionRoutes from './routes/api-galerie-production'
import apiRealisationsProductionRoutes from './routes/api-realisations-production'
import transfertDonneesRoutes from './routes/transfert-donnees'


import { serveStatic } from 'hono/cloudflare-workers'
const app = new Hono()

// Servir les fichiers statiques depuis dist/static
app.get('/static/*', serveStatic({ root: './dist/static' }))

// Redirection edge pour /auth/*
app.get('/auth/*', (c) => c.redirect('/admin/realisations/login', 302))

app.use(renderer)

// Intégration des routes
if (authRoutes) app.route('/auth', authRoutes)
if (adminRoutes) app.route('/admin', adminRoutes)
if (adminGalerieRoutes) app.route('/admin/galerie-simple', adminGalerieRoutes) // Interface simple galerie qui fonctionne
if (adminGalerieFonctionnelleRoutes) app.route('/admin/galerie-fonctionnelle', adminGalerieFonctionnelleRoutes) // Ancienne interface
if (adminGalerieCorrigeeRoutes) app.route('/admin/galerie', adminGalerieCorrigeeRoutes) // NOUVELLE interface CORRIGÉE qui FONCTIONNE
if (adminGalerieCorrigeeRoutes) app.route('/admin/galerie-corrigee', adminGalerieCorrigeeRoutes) // ALIAS pour test direct
if (adminGalerieProductionRoutes) app.route('/admin/galerie-production', adminGalerieProductionRoutes) // INTERFACE PRODUCTION avec API KV
if (loginSimpleRoutes) app.route('/login', loginSimpleRoutes) // Page de connexion qui fonctionne
if (adminAchievementsRoutes) app.route('/admin/achievements', adminAchievementsRoutes) // Admin des réalisations
if (achievementsRoutes) app.route('/realisations', achievementsRoutes) // Ancienne route (à conserver)
if (realisationsRoutes) app.route('/nos-realisations', realisationsRoutes) // Nouvelle page réalisations
if (adminRealisationsRoutes) app.route('/admin/realisations', adminRealisationsRoutes) // Admin des réalisations (ancien)
if (adminRealisationsProductionRoutes) app.route('/admin/realisations-production', adminRealisationsProductionRoutes) // ADMIN PRODUCTION réalisations avec API KV
if (apiGalerieRoutes) app.route('/api/galerie', apiGalerieRoutes) // API pour gérer les photos
if (apiGalerieProductionRoutes) app.route('/api/galerie-production', apiGalerieProductionRoutes) // API PRODUCTION galerie avec KV storage
if (apiRealisationsProductionRoutes) app.route('/api/realisations-production', apiRealisationsProductionRoutes) // API PRODUCTION réalisations avec KV storage
if (transfertDonneesRoutes) app.route('/admin/transfert', transfertDonneesRoutes) // Utilitaire de récupération des photos
if (galerieSimpleRoutes) app.route('/galerie-old', galerieSimpleRoutes) // Ancienne galerie statique
if (galerieDynamiqueRoutes) app.route('/galerie-old2', galerieDynamiqueRoutes) // Ancienne galerie dynamique
if (galerieCorrigeeRoutes) app.route('/galerie', galerieCorrigeeRoutes) // NOUVELLE galerie CORRIGÉE qui fonctionne

app.get('/', (c) => {
  return c.render(
    <Layout activeMenu="home">
      {/* Hero Section */}
      <section class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center">
            <div class="mb-8">
              <img 
                src="/static/logo-pbve-authentique.png" 
                alt="Logo Pour Bien Vivre Ensemble - PBVE" 
                class="w-32 h-32 md:w-40 md:h-40 mx-auto mb-6 rounded-full shadow-2xl border-4 border-white pbve-pulse"
              />
            </div>
            <h1 class="text-4xl md:text-6xl font-bold mb-6 pbve-gradient-text">
              Pour Bien Vivre Ensemble
            </h1>
            <p class="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Créons ensemble une communauté plus solidaire, plus unie et plus bienveillante à Lille Sud
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/a-propos"
                class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
              >
                <i class="fas fa-users mr-2"></i>
                Découvrir l'association
              </a>
              <a
                href="/contact"
                class="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center"
              >
                <i class="fas fa-hands-helping mr-2"></i>
                Nous rejoindre
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section class="py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos Valeurs
            </h2>
            <p class="text-xl text-gray-600 max-w-2xl mx-auto">
              Les principes qui guident notre action au quotidien
            </p>
          </div>

          <div class="grid md:grid-cols-3 gap-8">
            {/* Solidarité */}
            <div class="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-handshake text-2xl text-blue-600"></i>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">Solidarité</h3>
              <p class="text-gray-600">
                Nous croyons en l'entraide mutuelle et au soutien entre les membres de notre communauté.
              </p>
            </div>

            {/* Inclusion */}
            <div class="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-heart text-2xl text-green-600"></i>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">Inclusion</h3>
              <p class="text-gray-600">
                Chacun a sa place dans notre association, quels que soient son origine, son âge ou ses capacités.
              </p>
            </div>

            {/* Action */}
            <div class="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-rocket text-2xl text-purple-600"></i>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">Action</h3>
              <p class="text-gray-600">
                Nous passons des paroles aux actes concrets pour améliorer la vie de notre communauté.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Galerie Photos Authentiques */}
      <section class="py-16 bg-white overflow-hidden">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12">
            <h2 class="text-3xl md:text-4xl font-bold pbve-gradient-text mb-4">
              <i class="fas fa-camera mr-3"></i>
              Nos Moments de Vie
            </h2>
            <p class="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez l'association en action à travers nos activités quotidiennes
            </p>
          </div>

          {/* Galerie en mosaïque */}
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Photo principale - Marie Cappello */}
            <div class="lg:col-span-2 lg:row-span-2 relative group overflow-hidden rounded-2xl shadow-xl">
              <img 
                src="/static/photo-marie-cappello.jpg" 
                alt="Marie Cappello - Présidente PBVE" 
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div class="absolute bottom-6 left-6 text-white">
                <h3 class="text-2xl font-bold mb-2">Marie Cappello</h3>
                <p class="text-lg opacity-90">Présidente de l'association PBVE</p>
              </div>
            </div>

            {/* Enfant qui écrit */}
            <div class="relative group overflow-hidden rounded-2xl shadow-lg">
              <img 
                src="/static/photo-enfant-ecriture.jpg" 
                alt="Enfant participant aux ateliers d'écriture" 
                class="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              <div class="absolute bottom-4 left-4 text-white">
                <h4 class="text-lg font-semibold">Ateliers d'Écriture</h4>
              </div>
            </div>

            {/* Groupe d'enfants */}
            <div class="relative group overflow-hidden rounded-2xl shadow-lg">
              <img 
                src="/static/photo-groupe-enfants.jpg" 
                alt="Groupe joyeux d'enfants de l'association" 
                class="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              <div class="absolute bottom-4 left-4 text-white">
                <h4 class="text-lg font-semibold">Nos Petits Héros</h4>
              </div>
            </div>

            {/* Atelier créatif */}
            <div class="relative group overflow-hidden rounded-2xl shadow-lg">
              <img 
                src="/static/photo-atelier-creatif.jpg" 
                alt="Atelier créatif intergénérationnel" 
                class="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              <div class="absolute bottom-4 left-4 text-white">
                <h4 class="text-lg font-semibold">Ateliers Créatifs</h4>
              </div>
            </div>

            {/* Activités sportives */}
            <div class="relative group overflow-hidden rounded-2xl shadow-lg">
              <img 
                src="/static/photo-activite-sport.jpg" 
                alt="Activités sportives et bien-être" 
                class="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              <div class="absolute bottom-4 left-4 text-white">
                <h4 class="text-lg font-semibold">Sport & Bien-être</h4>
              </div>
            </div>

            {/* Célébration et joie */}
            <div class="relative group overflow-hidden rounded-2xl shadow-lg">
              <img 
                src="/static/photo-celebration-joie.jpg" 
                alt="Moments de célébration et de joie" 
                class="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              <div class="absolute bottom-4 left-4 text-white">
                <h4 class="text-lg font-semibold">Joie Partagée</h4>
              </div>
            </div>
          </div>

          <div class="text-center">
            <a href="/galerie" class="inline-flex items-center pbve-gradient-bg text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
              <i class="fas fa-images mr-2"></i>
              Voir toute la galerie
            </a>
          </div>
        </div>
      </section>

      {/* Section Parallax avec Citation */}
      <section class="relative py-24 overflow-hidden">
        <div class="absolute inset-0">
          <img 
            src="/static/photo-danse-mouvement.jpg" 
            alt="Activités de mouvement et danse" 
            class="w-full h-full object-cover"
            style="transform: translateZ(0); will-change: transform;"
          />
          <div class="absolute inset-0 bg-black/60"></div>
        </div>
        <div class="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <blockquote class="text-2xl md:text-3xl font-light leading-relaxed mb-8">
            "Ensemble, nous créons des liens qui transcendent les générations et rassemblent notre communauté de Lille Sud"
          </blockquote>
          <cite class="text-lg font-semibold pbve-gradient-text bg-white px-4 py-2 rounded-full">
            — Marie Cappello, Présidente PBVE
          </cite>
        </div>
      </section>

      {/* Nos Actions */}
      <section class="py-16 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos Actions
            </h2>
            <p class="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez comment nous œuvrons pour créer du lien social
            </p>
          </div>

          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Événements communautaires */}
            <div class="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl">
              <div class="flex items-center mb-4">
                <i class="fas fa-calendar-alt text-2xl text-blue-600 mr-3"></i>
                <h3 class="text-lg font-semibold text-gray-900">Événements Communautaires</h3>
              </div>
              <p class="text-gray-600 mb-4">
                Organisation de fêtes de quartier, repas partagés et animations culturelles.
              </p>
              <a href="/evenements" class="text-blue-600 font-medium hover:text-blue-800">
                Voir les événements →
              </a>
            </div>

            {/* Soutien aux personnes âgées */}
            <div class="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl">
              <div class="flex items-center mb-4">
                <i class="fas fa-user-friends text-2xl text-green-600 mr-3"></i>
                <h3 class="text-lg font-semibold text-gray-900">Aide aux Seniors</h3>
              </div>
              <p class="text-gray-600 mb-4">
                Visites de convivialité, aide aux courses et accompagnement administratif.
              </p>
              <a href="/contact" class="text-green-600 font-medium hover:text-green-800">
                En savoir plus →
              </a>
            </div>

            {/* Activités jeunesse */}
            <div class="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-xl">
              <div class="flex items-center mb-4">
                <i class="fas fa-child text-2xl text-purple-600 mr-3"></i>
                <h3 class="text-lg font-semibold text-gray-900">Activités Jeunesse</h3>
              </div>
              <p class="text-gray-600 mb-4">
                Ateliers créatifs, sorties éducatives et accompagnement scolaire.
              </p>
              <a href="/contact" class="text-purple-600 font-medium hover:text-purple-800">
                Participer →
              </a>
            </div>

            {/* Jardins partagés */}
            <div class="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl">
              <div class="flex items-center mb-4">
                <i class="fas fa-seedling text-2xl text-orange-600 mr-3"></i>
                <h3 class="text-lg font-semibold text-gray-900">Jardins Partagés</h3>
              </div>
              <p class="text-gray-600 mb-4">
                Création et entretien d'espaces verts collaboratifs dans le quartier.
              </p>
              <a href="/contact" class="text-orange-600 font-medium hover:text-orange-800">
                S'impliquer →
              </a>
            </div>

            {/* Ateliers créatifs */}
            <div class="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-xl">
              <div class="flex items-center mb-4">
                <i class="fas fa-palette text-2xl text-pink-600 mr-3"></i>
                <h3 class="text-lg font-semibold text-gray-900">Ateliers Créatifs</h3>
              </div>
              <p class="text-gray-600 mb-4">
                Cours de peinture, couture, bricolage et autres activités manuelles.
              </p>
              <a href="/evenements" class="text-pink-600 font-medium hover:text-pink-800">
                Voir le programme →
              </a>
            </div>

            {/* Solidarité alimentaire */}
            <div class="bg-gradient-to-br from-teal-50 to-cyan-50 p-6 rounded-xl">
              <div class="flex items-center mb-4">
                <i class="fas fa-shopping-basket text-2xl text-teal-600 mr-3"></i>
                <h3 class="text-lg font-semibold text-gray-900">Solidarité Alimentaire</h3>
              </div>
              <p class="text-gray-600 mb-4">
                Distribution de paniers solidaires et sensibilisation au gaspillage.
              </p>
              <a href="/contact" class="text-teal-600 font-medium hover:text-teal-800">
                Nous aider →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Actualités Facebook */}
      <section class="py-16 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12">
            <h2 class="text-3xl md:text-4xl font-bold pbve-gradient-text mb-4">
              <i class="fab fa-facebook mr-3"></i>
              Suivez Notre Actualité
            </h2>
            <p class="text-xl text-gray-600 max-w-2xl mx-auto">
              Restez connectés avec les dernières nouvelles de l'association PBVE sur Facebook
            </p>
          </div>

          <div class="grid lg:grid-cols-3 gap-8 items-start">
            {/* Premier Post Facebook */}
            <div class="bg-white rounded-2xl shadow-xl p-6 pbve-card">
              <div class="text-center mb-4">
                <h3 class="text-lg font-semibold pbve-gradient-text mb-2">
                  <i class="fab fa-facebook-f mr-2"></i>
                  Publication Récente
                </h3>
              </div>
              
              {/* Facebook iframe responsive - Post 1 */}
              <div class="relative w-full" style="padding-bottom: 127.8%; height: 0; overflow: hidden;">
                <iframe 
                  src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fpourbienvivreensemble%2Fposts%2Fpfbid02Ufcaez1fpCKjWwrY9aDbQBmQbo4hQBhvHaUortwQhvpABv6YcRjit92GU52WppwUl&show_text=true&width=500" 
                  width="500" 
                  height="639" 
                  style="border:none;overflow:hidden;position:absolute;top:0;left:0;width:100%;height:100%;" 
                  scrolling="no" 
                  frameborder="0" 
                  allowfullscreen="true" 
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  class="rounded-lg shadow-md">
                </iframe>
              </div>
            </div>

            {/* Deuxième Post Facebook */}
            <div class="bg-white rounded-2xl shadow-xl p-6 pbve-card">
              <div class="text-center mb-4">
                <h3 class="text-lg font-semibold pbve-gradient-text mb-2">
                  <i class="fab fa-facebook-f mr-2"></i>
                  Actualité PBVE
                </h3>
              </div>
              
              {/* Facebook iframe responsive - Post 2 (Mise à jour) */}
              <div class="relative w-full" style="padding-bottom: 124%; height: 0; overflow: hidden;">
                <iframe 
                  src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fpourbienvivreensemble%2Fposts%2Fpfbid02Ltgj4AiEaFExFU5j5WMsrj4CMDzscuuo74WdYsSUZZ15dvSNuejvHCP4XHPvfCM7l&show_text=true&width=500" 
                  width="500" 
                  height="620" 
                  style="border:none;overflow:hidden;position:absolute;top:0;left:0;width:100%;height:100%;" 
                  scrolling="no" 
                  frameborder="0" 
                  allowfullscreen="true" 
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  class="rounded-lg shadow-md">
                </iframe>
              </div>
            </div>

            {/* Troisième Post Facebook */}
            <div class="bg-white rounded-2xl shadow-xl p-6 pbve-card">
              <div class="text-center mb-4">
                <h3 class="text-lg font-semibold pbve-gradient-text mb-2">
                  <i class="fab fa-facebook-f mr-2"></i>
                  Dernière Actualité
                </h3>
              </div>
              
              {/* Facebook iframe responsive - Post 3 */}
              <div class="relative w-full" style="padding-bottom: 120.2%; height: 0; overflow: hidden;">
                <iframe 
                  src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fpourbienvivreensemble%2Fposts%2Fpfbid0SLCFSu3J4s1jY8CmczbjyN4k3msh16cB2MNLCrdeBiiBK92pYk5b9LjGZABSbvRSl&show_text=true&width=500" 
                  width="500" 
                  height="601" 
                  style="border:none;overflow:hidden;position:absolute;top:0;left:0;width:100%;height:100%;" 
                  scrolling="no" 
                  frameborder="0" 
                  allowfullscreen="true" 
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  class="rounded-lg shadow-md">
                </iframe>
              </div>
            </div>

            {/* Informations complémentaires */}
            <div class="space-y-6">
              <div class="bg-white rounded-xl shadow-lg p-6 pbve-card">
                <h3 class="text-xl font-bold pbve-gradient-text mb-4">
                  <i class="fas fa-thumbs-up mr-2"></i>
                  Notre Communauté
                </h3>
                
                <div class="space-y-4">
                  <div class="text-center p-4 bg-blue-50 rounded-lg">
                    <div class="w-12 h-12 pbve-gradient-bg rounded-full flex items-center justify-center mx-auto mb-3">
                      <i class="fab fa-facebook-f text-white text-xl"></i>
                    </div>
                    <div class="text-2xl font-bold text-blue-600">500+</div>
                    <div class="text-sm text-gray-600">Abonnés Facebook</div>
                  </div>

                  <div class="text-center p-4 bg-green-50 rounded-lg">
                    <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <i class="fas fa-calendar text-white text-xl"></i>
                    </div>
                    <div class="text-2xl font-bold text-green-600">15+</div>
                    <div class="text-sm text-gray-600">Posts / mois</div>
                  </div>

                  <div class="text-center p-4 bg-purple-50 rounded-lg">
                    <div class="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <i class="fas fa-heart text-white text-xl"></i>
                    </div>
                    <div class="text-2xl font-bold text-purple-600">Élevé</div>
                    <div class="text-sm text-gray-600">Engagement</div>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-xl shadow-lg p-6 pbve-card">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                  <i class="fas fa-link mr-2"></i>
                  Liens Rapides
                </h3>
                
                <div class="space-y-3">
                  <a href="https://www.facebook.com/pourbienvivreensemble" 
                     target="_blank"
                     class="w-full pbve-gradient-bg text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center text-sm">
                    <i class="fab fa-facebook-f mr-2"></i>
                    Suivre sur Facebook
                  </a>

                  <a href="/galerie" 
                     class="w-full bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center justify-center text-sm">
                    <i class="fas fa-camera mr-2"></i>
                    Notre Galerie
                  </a>

                  <a href="/actualites" 
                     class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center text-sm">
                    <i class="fab fa-facebook mr-2"></i>
                    Toutes les Actualités
                  </a>

                  <a href="/contact" 
                     class="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center text-sm">
                    <i class="fas fa-envelope mr-2"></i>
                    Nous Contacter
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section class="py-16 bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">
            Rejoignez Notre Communauté
          </h2>
          <p class="text-xl mb-8 max-w-2xl mx-auto">
            Ensemble, nous pouvons faire la différence dans notre quartier et créer des liens durables.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              class="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
            >
              <i class="fas fa-user-plus mr-2"></i>
              Devenir membre
            </a>
            <a
              href="/evenements"
              class="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors inline-flex items-center justify-center"
            >
              <i class="fas fa-calendar-check mr-2"></i>
              Participer aux événements
            </a>
          </div>
        </div>
      </section>
    </Layout>,
    { title: 'Accueil - Pour Bien Vivre Ensemble' }
  )
})

// Page À propos
app.get('/a-propos', (c) => {
  return c.render(
    <Layout activeMenu="about">
      {/* Hero À propos */}
      <section class="bg-gradient-to-r from-green-600 to-teal-700 text-white py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center">
            <h1 class="text-4xl md:text-5xl font-bold mb-6">
              À Propos de Notre Association
            </h1>
            <p class="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Découvrez notre histoire, nos valeurs et notre équipe engagée
            </p>
          </div>
        </div>
      </section>

      {/* Notre Histoire */}
      <section class="py-16 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 class="text-3xl font-bold text-gray-900 mb-6">Notre Histoire</h2>
              <div class="space-y-4 text-gray-600">
                <p>
                  Créée en 2018, l'association "Pour Bien Vivre Ensemble" est née de la volonté 
                  de plusieurs habitants du quartier de renforcer les liens sociaux et de 
                  développer la solidarité de proximité.
                </p>
                <p>
                  Constatant l'isolement de certaines personnes et le manque d'espaces de 
                  rencontre, nous avons décidé de créer des occasions de se retrouver, 
                  de s'entraider et de construire ensemble une communauté plus unie.
                </p>
                <p>
                  Aujourd'hui, nous comptons plus de 150 membres actifs et organisons 
                  régulièrement des événements qui rassemblent toutes les générations 
                  et toutes les cultures de notre quartier.
                </p>
              </div>
            </div>
            <div class="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl">
              <div class="text-center">
                <div class="grid grid-cols-2 gap-8 mb-6">
                  <div>
                    <div class="text-3xl font-bold text-blue-600">150+</div>
                    <div class="text-sm text-gray-600">Membres actifs</div>
                  </div>
                  <div>
                    <div class="text-3xl font-bold text-green-600">50+</div>
                    <div class="text-sm text-gray-600">Événements/an</div>
                  </div>
                  <div>
                    <div class="text-3xl font-bold text-purple-600">6</div>
                    <div class="text-sm text-gray-600">Années d'existence</div>
                  </div>
                  <div>
                    <div class="text-3xl font-bold text-orange-600">15</div>
                    <div class="text-sm text-gray-600">Bénévoles réguliers</div>
                  </div>
                </div>
                {/* Photo d'illustration */}
                <div class="mt-6">
                  <img 
                    src="/static/photo-groupe-enfants.jpg" 
                    alt="Nos membres en action" 
                    class="w-full h-32 object-cover rounded-lg shadow-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notre Équipe */}
      <section class="py-16 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">Notre Équipe</h2>
            <p class="text-xl text-gray-600">Les bénévoles qui font vivre l'association</p>
          </div>

          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Présidente */}
            <div class="bg-white p-6 rounded-xl shadow-lg text-center pbve-card">
              <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-user-tie text-2xl text-blue-600"></i>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Marie Cappello</h3>
              <p class="text-blue-600 font-medium mb-2">Présidente</p>
              <p class="text-gray-600 text-sm">
                Présidente engagée de l'association PBVE, Marie œuvre pour le développement des liens sociaux et la solidarité à Lille Sud.
              </p>
            </div>

            {/* Vice-président */}
            <div class="bg-white p-6 rounded-xl shadow-lg text-center">
              <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-user-friends text-2xl text-green-600"></i>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Ahmed Benali</h3>
              <p class="text-green-600 font-medium mb-2">Vice-président</p>
              <p class="text-gray-600 text-sm">
                Éducateur spécialisé, expert en animation jeunesse et médiation sociale.
              </p>
            </div>

            {/* Trésorière */}
            <div class="bg-white p-6 rounded-xl shadow-lg text-center">
              <div class="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-calculator text-2xl text-purple-600"></i>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Sophie Martin</h3>
              <p class="text-purple-600 font-medium mb-2">Trésorière</p>
              <p class="text-gray-600 text-sm">
                Comptable de formation, elle veille à la bonne gestion financière de l'association.
              </p>
            </div>

            {/* Secrétaire */}
            <div class="bg-white p-6 rounded-xl shadow-lg text-center">
              <div class="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-pen-alt text-2xl text-orange-600"></i>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Jean Moreau</h3>
              <p class="text-orange-600 font-medium mb-2">Secrétaire</p>
              <p class="text-gray-600 text-sm">
                Journaliste à la retraite, il s'occupe de la communication et des comptes-rendus.
              </p>
            </div>

            {/* Responsable événements */}
            <div class="bg-white p-6 rounded-xl shadow-lg text-center">
              <div class="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-calendar-alt text-2xl text-pink-600"></i>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Claire Rousseau</h3>
              <p class="text-pink-600 font-medium mb-2">Événements</p>
              <p class="text-gray-600 text-sm">
                Organisatrice d'événements professionnelle, elle coordonne nos manifestations.
              </p>
            </div>

            {/* Responsable jardins */}
            <div class="bg-white p-6 rounded-xl shadow-lg text-center">
              <div class="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-seedling text-2xl text-teal-600"></i>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Pierre Durand</h3>
              <p class="text-teal-600 font-medium mb-2">Jardins Partagés</p>
              <p class="text-gray-600 text-sm">
                Ingénieur agronome, passionné de jardinage et de permaculture urbaine.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Notre Présence Numérique */}
      <section class="py-16 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">Notre Présence Numérique</h2>
            <p class="text-xl text-gray-600">Découvrez notre actualité en temps réel</p>
          </div>

          <div class="grid lg:grid-cols-3 gap-8">
            {/* Widget Facebook */}
            <div class="lg:col-span-2">
              <div class="bg-white rounded-xl shadow-lg p-6">
                <h3 class="text-xl font-semibold pbve-gradient-text mb-4 text-center">
                  <i class="fab fa-facebook-f mr-2"></i>
                  Actualités Facebook
                </h3>
                
                {/* Facebook iframe responsive pour desktop */}
                <div class="hidden md:block">
                  <div class="relative w-full mx-auto max-w-lg" style="padding-bottom: 127.8%; height: 0; overflow: hidden;">
                    <iframe 
                      src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fpourbienvivreensemble%2Fposts%2Fpfbid02Ufcaez1fpCKjWwrY9aDbQBmQbo4hQBhvHaUortwQhvpABv6YcRjit92GU52WppwUl&show_text=true&width=500" 
                      width="500" 
                      height="639" 
                      style="border:none;overflow:hidden;position:absolute;top:0;left:0;width:100%;height:100%;" 
                      scrolling="no" 
                      frameborder="0" 
                      allowfullscreen="true" 
                      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                      class="rounded-lg">
                    </iframe>
                  </div>
                </div>

                {/* Version mobile simplifiée */}
                <div class="md:hidden text-center">
                  <div class="bg-blue-50 p-6 rounded-lg mb-4">
                    <i class="fab fa-facebook-f text-4xl text-blue-600 mb-4"></i>
                    <h4 class="font-semibold text-gray-900 mb-2">Suivez-nous sur Facebook</h4>
                    <p class="text-gray-600 text-sm mb-4">
                      Découvrez nos dernières actualités et événements sur notre page Facebook officielle.
                    </p>
                    <a href="https://www.facebook.com/pourbienvivreensemble" 
                       target="_blank"
                       class="inline-flex items-center bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                      <i class="fab fa-facebook-f mr-2"></i>
                      Ouvrir Facebook
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations réseaux */}
            <div class="space-y-6">
              <div class="bg-white rounded-xl shadow-lg p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                  <i class="fas fa-share-alt mr-2"></i>
                  Nos Réseaux
                </h3>
                
                <div class="space-y-4">
                  <a href="https://www.facebook.com/pourbienvivreensemble" 
                     target="_blank"
                     class="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <i class="fab fa-facebook-f text-2xl text-blue-600 mr-4"></i>
                    <div>
                      <div class="font-medium text-gray-900">Facebook</div>
                      <div class="text-sm text-gray-600">@pourbienvivreensemble</div>
                    </div>
                  </a>

                  <div class="flex items-center p-3 bg-gray-50 rounded-lg opacity-60">
                    <i class="fab fa-instagram text-2xl text-pink-600 mr-4"></i>
                    <div>
                      <div class="font-medium text-gray-900">Instagram</div>
                      <div class="text-sm text-gray-600">Bientôt disponible</div>
                    </div>
                  </div>

                  <div class="flex items-center p-3 bg-gray-50 rounded-lg opacity-60">
                    <i class="fab fa-twitter text-2xl text-sky-500 mr-4"></i>
                    <div>
                      <div class="font-medium text-gray-900">Twitter</div>
                      <div class="text-sm text-gray-600">Bientôt disponible</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-xl shadow-lg p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                  <i class="fas fa-chart-line mr-2"></i>
                  Statistiques
                </h3>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Abonnés Facebook</span>
                    <span class="font-semibold text-blue-600">500+</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Publications mensuelles</span>
                    <span class="font-semibold text-green-600">15+</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Engagement</span>
                    <span class="font-semibold text-purple-600">Élevé</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nos Partenaires */}
      <section class="py-16 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">Nos Partenaires</h2>
            <p class="text-xl text-gray-600">Ils nous accompagnent dans nos actions</p>
          </div>

          <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div class="bg-gray-50 p-6 rounded-xl text-center">
              <i class="fas fa-building text-3xl text-blue-600 mb-4"></i>
              <h3 class="font-semibold text-gray-900">Mairie du 15ème</h3>
              <p class="text-sm text-gray-600">Soutien logistique et financier</p>
            </div>
            
            <div class="bg-gray-50 p-6 rounded-xl text-center">
              <i class="fas fa-graduation-cap text-3xl text-green-600 mb-4"></i>
              <h3 class="font-semibold text-gray-900">École Primaire</h3>
              <p class="text-sm text-gray-600">Partenariat éducatif</p>
            </div>
            
            <div class="bg-gray-50 p-6 rounded-xl text-center">
              <i class="fas fa-store text-3xl text-purple-600 mb-4"></i>
              <h3 class="font-semibold text-gray-900">Commerçants locaux</h3>
              <p class="text-sm text-gray-600">Sponsors et partenaires</p>
            </div>
            
            <div class="bg-gray-50 p-6 rounded-xl text-center">
              <i class="fas fa-hands-helping text-3xl text-orange-600 mb-4"></i>
              <h3 class="font-semibold text-gray-900">Autres associations</h3>
              <p class="text-sm text-gray-600">Collaborations et échanges</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>,
    { title: 'À Propos - Pour Bien Vivre Ensemble' }
  )
})

// Page Événements
// Page Galerie Photos
// Page Actualités Facebook
app.get('/actualites', (c) => {
  return c.render(
    <Layout activeMenu="news">
      {/* Hero Actualités */}
      <section class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center">
            <h1 class="text-4xl md:text-5xl font-bold mb-6">
              <i class="fab fa-facebook mr-4"></i>
              Nos Actualités
            </h1>
            <p class="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Suivez la vie de l'association PBVE en temps réel sur Facebook
            </p>
          </div>
        </div>
      </section>

      {/* Publications Facebook */}
      <section class="py-16 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">Publications Récentes</h2>
            <p class="text-xl text-gray-600">Découvrez nos dernières nouvelles et événements</p>
          </div>

          <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {/* Publication 1 */}
            <div class="bg-white rounded-2xl shadow-xl overflow-hidden facebook-section">
              <div class="facebook-header">
                <h3 class="font-semibold">
                  <i class="fab fa-facebook-f mr-2"></i>
                  Publication PBVE
                </h3>
              </div>
              <div class="p-4">
                <div class="relative w-full" style="padding-bottom: 127.8%; height: 0; overflow: hidden;">
                  <iframe 
                    src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fpourbienvivreensemble%2Fposts%2Fpfbid02Ufcaez1fpCKjWwrY9aDbQBmQbo4hQBhvHaUortwQhvpABv6YcRjit92GU52WppwUl&show_text=true&width=500" 
                    width="500" 
                    height="639" 
                    style="border:none;overflow:hidden;position:absolute;top:0;left:0;width:100%;height:100%;" 
                    scrolling="no" 
                    frameborder="0" 
                    allowfullscreen="true" 
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    class="rounded-lg">
                  </iframe>
                </div>
              </div>
            </div>

            {/* Publication 2 */}
            <div class="bg-white rounded-2xl shadow-xl overflow-hidden facebook-section">
              <div class="facebook-header">
                <h3 class="font-semibold">
                  <i class="fab fa-facebook-f mr-2"></i>
                  Actualité PBVE
                </h3>
              </div>
              <div class="p-4">
                <div class="relative w-full" style="padding-bottom: 124%; height: 0; overflow: hidden;">
                  <iframe 
                    src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fpourbienvivreensemble%2Fposts%2Fpfbid02Ltgj4AiEaFExFU5j5WMsrj4CMDzscuuo74WdYsSUZZ15dvSNuejvHCP4XHPvfCM7l&show_text=true&width=500" 
                    width="500" 
                    height="620" 
                    style="border:none;overflow:hidden;position:absolute;top:0;left:0;width:100%;height:100%;" 
                    scrolling="no" 
                    frameborder="0" 
                    allowfullscreen="true" 
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    class="rounded-lg">
                  </iframe>
                </div>
              </div>
            </div>

            {/* Publication 3 */}
            <div class="bg-white rounded-2xl shadow-xl overflow-hidden facebook-section">
              <div class="facebook-header">
                <h3 class="font-semibold">
                  <i class="fab fa-facebook-f mr-2"></i>
                  Dernière Actualité
                </h3>
              </div>
              <div class="p-4">
                <div class="relative w-full" style="padding-bottom: 120.2%; height: 0; overflow: hidden;">
                  <iframe 
                    src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fpourbienvivreensemble%2Fposts%2Fpfbid0SLCFSu3J4s1jY8CmczbjyN4k3msh16cB2MNLCrdeBiiBK92pYk5b9LjGZABSbvRSl&show_text=true&width=500" 
                    width="500" 
                    height="601" 
                    style="border:none;overflow:hidden;position:absolute;top:0;left:0;width:100%;height:100%;" 
                    scrolling="no" 
                    frameborder="0" 
                    allowfullscreen="true" 
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    class="rounded-lg">
                  </iframe>
                </div>
              </div>
            </div>
          </div>

          {/* Widget d'information - Restez connectés */}
          <div class="mt-12 max-w-4xl mx-auto">
            <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-100">
              <h3 class="text-2xl font-bold pbve-gradient-text mb-6 text-center">
                <i class="fas fa-info-circle mr-2"></i>
                Restez Connectés avec PBVE
              </h3>
              
              <div class="grid md:grid-cols-3 gap-6">
                <div class="text-center p-4 bg-white rounded-lg shadow-sm">
                  <i class="fab fa-facebook-f text-3xl text-blue-600 mb-3"></i>
                  <h4 class="font-semibold text-gray-900 mb-2">Page Facebook</h4>
                  <p class="text-sm text-gray-600 mb-3">
                    Suivez @pourbienvivreensemble pour toutes nos actualités
                  </p>
                  <a href="https://www.facebook.com/pourbienvivreensemble" 
                     target="_blank"
                     class="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm">
                    <i class="fab fa-facebook-f mr-2"></i>
                    Suivre
                  </a>
                </div>

                <div class="text-center p-4 bg-white rounded-lg shadow-sm">
                  <i class="fas fa-bell text-3xl text-yellow-600 mb-3"></i>
                  <h4 class="font-semibold text-gray-900 mb-2">Notifications</h4>
                  <p class="text-sm text-gray-600 mb-3">
                    Activez les notifications pour ne rien manquer
                  </p>
                </div>

                <div class="text-center p-4 bg-white rounded-lg shadow-sm">
                  <i class="fas fa-share-alt text-3xl text-green-600 mb-3"></i>
                  <h4 class="font-semibold text-gray-900 mb-2">Partagez</h4>
                  <p class="text-sm text-gray-600 mb-3">
                    Partagez nos publications avec vos proches
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section interactive */}
          <div class="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 text-center">
            <h3 class="text-2xl font-bold text-gray-900 mb-4">
              Vous ne voyez pas les publications ?
            </h3>
            <p class="text-gray-600 mb-6 max-w-2xl mx-auto">
              Si les publications Facebook ne s'affichent pas, cliquez sur le bouton ci-dessous 
              pour visiter directement notre page Facebook officielle.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://www.facebook.com/pourbienvivreensemble" 
                 target="_blank"
                 class="pbve-gradient-bg text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity inline-flex items-center justify-center">
                <i class="fab fa-facebook-f mr-2"></i>
                Visiter Facebook
              </a>
              <button onclick="location.reload()" 
                      class="bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors">
                <i class="fas fa-refresh mr-2"></i>
                Actualiser la page
              </button>
            </div>
          </div>
        </div>
      </section>
    </Layout>,
    { title: 'Actualités Facebook - Pour Bien Vivre Ensemble' }
  )
})

// Route galerie déplacée vers /routes/galerie.tsx
app.get('/galerie-old', (c) => {
  return c.render(
    <Layout activeMenu="gallery">
      {/* Hero Galerie */}
      <section class="bg-gradient-to-r from-purple-600 to-pink-700 text-white py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center">
            <h1 class="text-4xl md:text-5xl font-bold mb-6">
              <i class="fas fa-camera mr-4"></i>
              Notre Galerie
            </h1>
            <p class="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Revivez nos plus beaux moments et découvrez l'âme de PBVE
            </p>
          </div>
        </div>
      </section>

      {/* Galerie complète */}
      <section class="py-16 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Catégories */}
          <div class="text-center mb-12">
            <div class="inline-flex bg-gray-100 rounded-lg p-1 mb-8">
              <button onclick="filterGallery('all')" class="gallery-filter active px-6 py-2 rounded-md font-medium">
                Toutes les photos
              </button>
              <button onclick="filterGallery('activities')" class="gallery-filter px-6 py-2 rounded-md font-medium">
                Activités
              </button>
              <button onclick="filterGallery('events')" class="gallery-filter px-6 py-2 rounded-md font-medium">
                Événements  
              </button>
              <button onclick="filterGallery('team')" class="gallery-filter px-6 py-2 rounded-md font-medium">
                Équipe
              </button>
            </div>
          </div>

          {/* Grille de photos */}
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" id="photo-grid">
            {/* Marie Cappello */}
            <div class="gallery-item team relative group overflow-hidden rounded-xl shadow-lg cursor-pointer" 
                 onclick="openLightbox('/static/photo-marie-cappello.jpg', 'Marie Cappello - Présidente PBVE')">
              <img 
                src="/static/photo-marie-cappello.jpg" 
                alt="Marie Cappello - Présidente PBVE" 
                class="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div class="absolute bottom-4 left-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <h3 class="font-semibold">Marie Cappello</h3>
                <p class="text-sm opacity-80">Présidente PBVE</p>
              </div>
            </div>

            {/* Enfant écriture */}
            <div class="gallery-item activities relative group overflow-hidden rounded-xl shadow-lg cursor-pointer"
                 onclick="openLightbox('/static/photo-enfant-ecriture.jpg', 'Atelier d\\'écriture créative')">
              <img 
                src="/static/photo-enfant-ecriture.jpg" 
                alt="Atelier d'écriture créative" 
                class="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div class="absolute bottom-4 left-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <h3 class="font-semibold">Atelier Écriture</h3>
                <p class="text-sm opacity-80">Créativité enfantine</p>
              </div>
            </div>

            {/* Groupe enfants */}
            <div class="gallery-item events relative group overflow-hidden rounded-xl shadow-lg cursor-pointer"
                 onclick="openLightbox('/static/photo-groupe-enfants.jpg', 'Groupe joyeux d\\'enfants')">
              <img 
                src="/static/photo-groupe-enfants.jpg" 
                alt="Groupe d'enfants" 
                class="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div class="absolute bottom-4 left-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <h3 class="font-semibold">Nos Enfants</h3>
                <p class="text-sm opacity-80">Sortie de groupe</p>
              </div>
            </div>

            {/* Atelier créatif */}
            <div class="gallery-item activities relative group overflow-hidden rounded-xl shadow-lg cursor-pointer"
                 onclick="openLightbox('/static/photo-atelier-creatif.jpg', 'Atelier créatif intergénérationnel')">
              <img 
                src="/static/photo-atelier-creatif.jpg" 
                alt="Atelier créatif" 
                class="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div class="absolute bottom-4 left-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <h3 class="font-semibold">Atelier Créatif</h3>
                <p class="text-sm opacity-80">Intergénérationnel</p>
              </div>
            </div>

            {/* Sport */}
            <div class="gallery-item activities relative group overflow-hidden rounded-xl shadow-lg cursor-pointer"
                 onclick="openLightbox('/static/photo-activite-sport.jpg', 'Activités sportives et bien-être')">
              <img 
                src="/static/photo-activite-sport.jpg" 
                alt="Activités sportives" 
                class="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div class="absolute bottom-4 left-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <h3 class="font-semibold">Sport & Bien-être</h3>
                <p class="text-sm opacity-80">Activités physiques</p>
              </div>
            </div>

            {/* Danse */}
            <div class="gallery-item activities relative group overflow-hidden rounded-xl shadow-lg cursor-pointer"
                 onclick="openLightbox('/static/photo-danse-mouvement.jpg', 'Atelier danse et mouvement')">
              <img 
                src="/static/photo-danse-mouvement.jpg" 
                alt="Danse et mouvement" 
                class="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div class="absolute bottom-4 left-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <h3 class="font-semibold">Danse</h3>
                <p class="text-sm opacity-80">Expression corporelle</p>
              </div>
            </div>

            {/* Célébration */}
            <div class="gallery-item events relative group overflow-hidden rounded-xl shadow-lg cursor-pointer"
                 onclick="openLightbox('/static/photo-celebration-joie.jpg', 'Moments de célébration')">
              <img 
                src="/static/photo-celebration-joie.jpg" 
                alt="Célébration" 
                class="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div class="absolute bottom-4 left-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <h3 class="font-semibold">Célébration</h3>
                <p class="text-sm opacity-80">Joie partagée</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <div id="lightbox" class="fixed inset-0 bg-black bg-opacity-90 z-50 hidden flex items-center justify-center" onclick="closeLightbox()">
        <div class="max-w-4xl max-h-full p-4">
          <img id="lightbox-img" src="" alt="" class="max-w-full max-h-full object-contain" />
          <p id="lightbox-caption" class="text-white text-center mt-4 text-lg"></p>
          <button onclick="closeLightbox()" class="absolute top-4 right-4 text-white text-3xl hover:text-gray-300">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{__html: `
        function filterGallery(category) {
          var items = document.querySelectorAll('.gallery-item');
          var buttons = document.querySelectorAll('.gallery-filter');
          
          // Reset buttons
          buttons.forEach(function(btn) {
            btn.classList.remove('active', 'bg-blue-500', 'text-white');
          });
          event.target.classList.add('active', 'bg-blue-500', 'text-white');
          
          // Filter items
          items.forEach(function(item) {
            if (category === 'all' || item.classList.contains(category)) {
              item.style.display = 'block';
            } else {
              item.style.display = 'none';
            }
          });
        }

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

        // Initialize filter
        document.addEventListener('DOMContentLoaded', function() {
          var firstButton = document.querySelector('.gallery-filter');
          if (firstButton) {
            firstButton.classList.add('bg-blue-500', 'text-white');
          }
        });
      `}} />
    </Layout>,
    { title: 'Galerie Photos - Pour Bien Vivre Ensemble' }
  )
})

app.get('/evenements', (c) => {
  return c.render(
    <Layout activeMenu="events">
      {/* Hero Événements */}
      <section class="bg-gradient-to-r from-purple-600 to-pink-700 text-white py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center">
            <h1 class="text-4xl md:text-5xl font-bold mb-6">
              Nos Événements
            </h1>
            <p class="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Rejoignez-nous pour créer du lien et partager de bons moments
            </p>
          </div>
        </div>
      </section>

      {/* Événements à venir */}
      <section class="py-16 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">Prochains Événements</h2>
            <p class="text-xl text-gray-600">Ne ratez pas nos prochaines rencontres !</p>
          </div>

          <div class="space-y-6">
            {/* Événement 1 */}
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl shadow-lg">
              <div class="flex flex-col md:flex-row md:items-center gap-6">
                <div class="md:w-1/4">
                  <div class="bg-blue-600 text-white p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold">15</div>
                    <div class="text-sm">Décembre</div>
                    <div class="text-xs">2024</div>
                  </div>
                </div>
                <div class="md:w-3/4">
                  <h3 class="text-2xl font-bold text-gray-900 mb-2">Marché de Noël Solidaire</h3>
                  <p class="text-gray-600 mb-4">
                    Venez découvrir les créations de nos ateliers créatifs et déguster nos spécialités 
                    du monde entier. Tous les bénéfices seront reversés à nos actions solidaires.
                  </p>
                  <div class="flex flex-wrap gap-4 text-sm">
                    <div class="flex items-center">
                      <i class="fas fa-clock text-blue-600 mr-2"></i>
                      <span>14h00 - 18h00</span>
                    </div>
                    <div class="flex items-center">
                      <i class="fas fa-map-marker-alt text-blue-600 mr-2"></i>
                      <span>Place de la Mairie</span>
                    </div>
                    <div class="flex items-center">
                      <i class="fas fa-ticket-alt text-blue-600 mr-2"></i>
                      <span>Entrée libre</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Événement 2 */}
            <div class="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl shadow-lg">
              <div class="flex flex-col md:flex-row md:items-center gap-6">
                <div class="md:w-1/4">
                  <div class="bg-green-600 text-white p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold">22</div>
                    <div class="text-sm">Décembre</div>
                    <div class="text-xs">2024</div>
                  </div>
                </div>
                <div class="md:w-3/4">
                  <h3 class="text-2xl font-bold text-gray-900 mb-2">Atelier Cuisine du Monde</h3>
                  <p class="text-gray-600 mb-4">
                    Apprenez à cuisiner des plats traditionnels de différents pays avec nos membres. 
                    Cette session sera dédiée aux spécialités de fin d'année.
                  </p>
                  <div class="flex flex-wrap gap-4 text-sm">
                    <div class="flex items-center">
                      <i class="fas fa-clock text-green-600 mr-2"></i>
                      <span>10h00 - 13h00</span>
                    </div>
                    <div class="flex items-center">
                      <i class="fas fa-map-marker-alt text-green-600 mr-2"></i>
                      <span>Salle communale</span>
                    </div>
                    <div class="flex items-center">
                      <i class="fas fa-users text-green-600 mr-2"></i>
                      <span>15 places max</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Événement 3 */}
            <div class="bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-xl shadow-lg">
              <div class="flex flex-col md:flex-row md:items-center gap-6">
                <div class="md:w-1/4">
                  <div class="bg-purple-600 text-white p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold">05</div>
                    <div class="text-sm">Janvier</div>
                    <div class="text-xs">2025</div>
                  </div>
                </div>
                <div class="md:w-3/4">
                  <h3 class="text-2xl font-bold text-gray-900 mb-2">Galette des Rois Intergénérationnelle</h3>
                  <p class="text-gray-600 mb-4">
                    Célébrons ensemble la nouvelle année autour d'une galette des rois géante ! 
                    Jeux, musique et convivialité pour toutes les générations.
                  </p>
                  <div class="flex flex-wrap gap-4 text-sm">
                    <div class="flex items-center">
                      <i class="fas fa-clock text-purple-600 mr-2"></i>
                      <span>15h00 - 17h00</span>
                    </div>
                    <div class="flex items-center">
                      <i class="fas fa-map-marker-alt text-purple-600 mr-2"></i>
                      <span>Centre social</span>
                    </div>
                    <div class="flex items-center">
                      <i class="fas fa-ticket-alt text-purple-600 mr-2"></i>
                      <span>5€ par famille</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Événements récurrents */}
      <section class="py-16 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">Événements Réguliers</h2>
            <p class="text-xl text-gray-600">Nos rendez-vous récurrents tout au long de l'année</p>
          </div>

          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div class="bg-white p-6 rounded-xl shadow-lg">
              <div class="text-center mb-4">
                <i class="fas fa-coffee text-3xl text-orange-600"></i>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3 text-center">Café des Voisins</h3>
              <div class="space-y-2 text-sm text-gray-600">
                <div class="flex items-center">
                  <i class="fas fa-calendar text-orange-600 mr-2"></i>
                  <span>Tous les mardis</span>
                </div>
                <div class="flex items-center">
                  <i class="fas fa-clock text-orange-600 mr-2"></i>
                  <span>14h00 - 16h00</span>
                </div>
                <div class="flex items-center">
                  <i class="fas fa-map-marker-alt text-orange-600 mr-2"></i>
                  <span>Café associatif</span>
                </div>
              </div>
              <p class="text-gray-600 mt-4 text-sm">
                Moment de convivialité autour d'un café, thé ou chocolat chaud.
              </p>
            </div>

            <div class="bg-white p-6 rounded-xl shadow-lg">
              <div class="text-center mb-4">
                <i class="fas fa-seedling text-3xl text-green-600"></i>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3 text-center">Jardinage Partagé</h3>
              <div class="space-y-2 text-sm text-gray-600">
                <div class="flex items-center">
                  <i class="fas fa-calendar text-green-600 mr-2"></i>
                  <span>Tous les samedis</span>
                </div>
                <div class="flex items-center">
                  <i class="fas fa-clock text-green-600 mr-2"></i>
                  <span>09h00 - 12h00</span>
                </div>
                <div class="flex items-center">
                  <i class="fas fa-map-marker-alt text-green-600 mr-2"></i>
                  <span>Jardin partagé</span>
                </div>
              </div>
              <p class="text-gray-600 mt-4 text-sm">
                Entretenons ensemble notre jardin partagé et partageons nos récoltes.
              </p>
            </div>

            <div class="bg-white p-6 rounded-xl shadow-lg">
              <div class="text-center mb-4">
                <i class="fas fa-gamepad text-3xl text-blue-600"></i>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3 text-center">Soirée Jeux</h3>
              <div class="space-y-2 text-sm text-gray-600">
                <div class="flex items-center">
                  <i class="fas fa-calendar text-blue-600 mr-2"></i>
                  <span>1er vendredi du mois</span>
                </div>
                <div class="flex items-center">
                  <i class="fas fa-clock text-blue-600 mr-2"></i>
                  <span>19h00 - 22h00</span>
                </div>
                <div class="flex items-center">
                  <i class="fas fa-map-marker-alt text-blue-600 mr-2"></i>
                  <span>Salle des fêtes</span>
                </div>
              </div>
              <p class="text-gray-600 mt-4 text-sm">
                Jeux de société, cartes et jeux de rôle pour tous les âges.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>,
    { title: 'Événements - Pour Bien Vivre Ensemble' }
  )
})

// Page Contact
app.get('/contact', (c) => {
  return c.render(
    <Layout activeMenu="contact">
      {/* Hero Contact */}
      <section class="bg-gradient-to-r from-teal-600 to-cyan-700 text-white py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center">
            <h1 class="text-4xl md:text-5xl font-bold mb-6">
              Contactez-Nous
            </h1>
            <p class="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Une question ? Une envie de nous rejoindre ? N'hésitez pas à nous contacter !
            </p>
          </div>
        </div>
      </section>

      {/* Informations de contact */}
      <section class="py-16 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid lg:grid-cols-2 gap-12">
            {/* Coordonnées */}
            <div>
              <h2 class="text-3xl font-bold text-gray-900 mb-8">Nos Coordonnées</h2>
              
              <div class="space-y-6">
                <div class="flex items-start space-x-4">
                  <div class="flex-shrink-0">
                    <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <i class="fas fa-map-marker-alt text-blue-600"></i>
                    </div>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-1">Adresse</h3>
                    <p class="text-gray-600">
                      Association PBVE<br/>
                      250 rue Wagner<br/>
                      Lille Sud, France
                    </p>
                  </div>
                </div>

                <div class="flex items-start space-x-4">
                  <div class="flex-shrink-0">
                    <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <i class="fas fa-phone text-green-600"></i>
                    </div>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-1">Téléphone</h3>
                    <p class="text-gray-600">01 23 45 67 89</p>
                    <p class="text-sm text-gray-500">Du lundi au vendredi, 9h-17h</p>
                  </div>
                </div>

                <div class="flex items-start space-x-4">
                  <div class="flex-shrink-0">
                    <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <i class="fas fa-envelope text-purple-600"></i>
                    </div>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-1">Email</h3>
                    <p class="text-gray-600">contact@pourbienvivreensemble.fr</p>
                    <p class="text-sm text-gray-500">Réponse sous 48h</p>
                  </div>
                </div>

                <div class="flex items-start space-x-4">
                  <div class="flex-shrink-0">
                    <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <i class="fas fa-clock text-orange-600"></i>
                    </div>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-1">Permanences</h3>
                    <p class="text-gray-600">
                      Mercredi : 14h-18h<br/>
                      Samedi : 10h-12h
                    </p>
                    <p class="text-sm text-gray-500">Sans rendez-vous</p>
                  </div>
                </div>
              </div>

              {/* Réseaux sociaux */}
              <div class="mt-8">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Suivez-nous</h3>
                <div class="flex space-x-4">
                  <a href="#" class="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
                    <i class="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" class="w-12 h-12 bg-sky-500 text-white rounded-lg flex items-center justify-center hover:bg-sky-600 transition-colors">
                    <i class="fab fa-twitter"></i>
                  </a>
                  <a href="#" class="w-12 h-12 bg-pink-600 text-white rounded-lg flex items-center justify-center hover:bg-pink-700 transition-colors">
                    <i class="fab fa-instagram"></i>
                  </a>
                  <a href="#" class="w-12 h-12 bg-blue-800 text-white rounded-lg flex items-center justify-center hover:bg-blue-900 transition-colors">
                    <i class="fab fa-linkedin-in"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Formulaire de contact */}
            <div>
              <h2 class="text-3xl font-bold text-gray-900 mb-8">Envoyez-nous un Message</h2>
              
              <form class="space-y-6" onsubmit="handleContactForm(event)">
                <div class="grid md:grid-cols-2 gap-6">
                  <div>
                    <label for="firstname" class="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                    <input
                      type="text"
                      id="firstname"
                      name="firstname"
                      required
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div>
                    <label for="lastname" class="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                    <input
                      type="text"
                      id="lastname"
                      name="lastname"
                      required
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Votre nom"
                    />
                  </div>
                </div>

                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="votre.email@exemple.com"
                  />
                </div>

                <div>
                  <label for="subject" class="block text-sm font-medium text-gray-700 mb-2">Sujet</label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Choisissez un sujet</option>
                    <option value="adhesion">Adhésion à l'association</option>
                    <option value="benevolat">Devenir bénévole</option>
                    <option value="evenement">Informations sur un événement</option>
                    <option value="partenariat">Proposition de partenariat</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label for="message" class="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Votre message..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  class="w-full bg-teal-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-teal-700 transition-colors flex items-center justify-center"
                >
                  <i class="fas fa-paper-plane mr-2"></i>
                  Envoyer le message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Comment nous rejoindre */}
      <section class="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">Comment Nous Rejoindre ?</h2>
            <p class="text-xl text-gray-600">Plusieurs façons de faire partie de notre communauté</p>
          </div>

          <div class="grid md:grid-cols-3 gap-8">
            <div class="bg-white p-6 rounded-xl shadow-lg text-center">
              <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-user-plus text-2xl text-blue-600"></i>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">Devenir Membre</h3>
              <p class="text-gray-600 mb-4">
                Adhérez à notre association pour participer à toutes nos activités 
                et avoir voix au chapitre dans nos décisions.
              </p>
              <div class="text-2xl font-bold text-blue-600 mb-2">15€/an</div>
              <p class="text-sm text-gray-500">Tarif réduit : 5€ (étudiants, chômeurs)</p>
            </div>

            <div class="bg-white p-6 rounded-xl shadow-lg text-center">
              <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-hands-helping text-2xl text-green-600"></i>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">Devenir Bénévole</h3>
              <p class="text-gray-600 mb-4">
                Donnez de votre temps selon vos disponibilités pour organiser 
                des événements ou aider dans nos différentes missions.
              </p>
              <div class="text-2xl font-bold text-green-600 mb-2">Gratuit</div>
              <p class="text-sm text-gray-500">Selon vos disponibilités</p>
            </div>

            <div class="bg-white p-6 rounded-xl shadow-lg text-center">
              <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-calendar-check text-2xl text-purple-600"></i>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">Participer aux Événements</h3>
              <p class="text-gray-600 mb-4">
                Rejoignez-nous ponctuellement lors de nos événements ouverts 
                à tous, même sans être membre de l'association.
              </p>
              <div class="text-2xl font-bold text-purple-600 mb-2">Variable</div>
              <p class="text-sm text-gray-500">Selon l'événement</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>,
    { title: 'Contact - Pour Bien Vivre Ensemble' }
  )
})

export default app
