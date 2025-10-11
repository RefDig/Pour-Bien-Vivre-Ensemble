# Pour Bien Vivre Ensemble (PBVE) - Site Web Associatif

## Vue d'ensemble du projet
- **Nom** : Pour Bien Vivre Ensemble (PBVE)
- **Objectif** : Site web associatif pour renforcer les liens sociaux et la solidarité à Lille Sud
- **Type** : Progressive Web App (PWA) avec interface d'administration

## URLs de production
- **Site principal** : https://3000-iywdbfx48t6b30z2xpt11-3844e1b6.sandbox.novita.ai
- **Page Facebook** : https://www.facebook.com/pourbienvivreensemble
- **GitHub** : https://github.com/user/webapp

## Architecture des données
- **Modèles principaux** : Utilisateurs, Réalisations/Achievements
- **Services de stockage** : Cloudflare D1 (SQLite), authentification par sessions
- **Intégration sociale** : 3 iframes Facebook intégrés de manière responsive

## Fonctionnalités actuellement implémentées

### ✅ Interface publique complète
- **Page d'accueil** avec section héro, valeurs, galerie photo, citation inspirante
- **À propos** avec présentation de l'équipe, mission, et informations de contact  
- **Galerie photos** avec lightbox, filtres par catégories et animations
- **Actualités Facebook** avec 3 publications intégrées de manière responsive
- **Événements** avec planning et descriptions détaillées
- **Contact** avec coordonnées authentiques (Marie Cappello, 250 rue Wagner)
- **Navigation responsive** avec menu mobile adaptatif

### ✅ Identité visuelle authentique PBVE
- **Couleurs officielles** : jaune ocre (#D2691E), turquoise (#20B2AA), marron (#8B4513), violet (#8A2BE2)
- **Logo authentique** intégré dans l'en-tête et le footer
- **Photos réelles** des activités de l'association
- **Styles CSS personnalisés** avec !important pour forcer les couleurs PBVE

### ✅ Progressive Web App (PWA)
- **Service Worker** pour fonctionnement hors ligne
- **Manifest.json** pour installation sur mobile
- **Design responsive** optimisé tablettes et mobiles

### ✅ Intégration Facebook complète
- **3 iframes Facebook** intégrés avec ratios responsives différents :
  - Post 1 : ratio 127.8% (500x639px)
  - Post 2 : ratio 50% (500x250px) 
  - Post 3 : ratio 120.2% (500x601px)
- **Page dédiée actualités** (/actualites) avec les 3 publications
- **Section Facebook** sur la page d'accueil
- **Liens authentiques** vers @pourbienvivreensemble

### ✅ Système d'authentification et administration
- **Connexion sécurisée** avec hashage SHA-256 des mots de passe
- **Interface d'administration** pour gestion des réalisations
- **Système de sessions** avec cookies sécurisés
- **Dashboard administrateur** avec statistiques

### ✅ Gestion des réalisations
- **Catégories disponibles** : texte, vidéos, livres audios, podcast, flipbook
- **Interface CRUD complète** pour ajout/modification/suppression
- **Statut de publication** (brouillon/publié)
- **Métadonnées** avec dates et descriptions

## Fonctionnalités URI et paramètres

### Pages publiques
- `GET /` - Page d'accueil avec iframes Facebook
- `GET /a-propos` - Présentation de l'association
- `GET /actualites` - Page dédiée aux 3 publications Facebook
- `GET /galerie` - Galerie photos avec filtres
- `GET /evenements` - Calendrier des événements
- `GET /contact` - Informations de contact

### Interface d'administration
- `GET /auth/login` - Page de connexion administrateur
- `POST /auth/login` - Authentification (email, password)
- `GET /auth/logout` - Déconnexion
- `GET /admin` - Dashboard administrateur
- `GET /admin/achievements` - Liste des réalisations
- `POST /admin/achievements` - Création de réalisation
- `PUT /admin/achievements/:id` - Modification de réalisation
- `DELETE /admin/achievements/:id` - Suppression de réalisation

### Assets statiques
- `/static/*` - Fichiers CSS, JS, images, logos

## Fonctionnalités non encore implémentées

### ❌ Système de dons
- Intégration PayPal ou Stripe pour dons en ligne
- Page dédiée avec objectifs et transparence financière

### ❌ Espace membres
- Inscription/connexion pour les membres
- Accès aux contenus réservés membres
- Gestion des profils utilisateurs

### ❌ Déploiement production
- Configuration Cloudflare Pages sur pourbienvivreensemble.com
- Migration base de données vers production
- Configuration des secrets et variables d'environnement

## Guide d'utilisation

### Pour les visiteurs
1. **Naviguer** sur le site via le menu principal
2. **Découvrir** l'association via la page "À propos"
3. **Suivre l'actualité** via la page "Actualités" avec les posts Facebook
4. **Voir les photos** dans la galerie avec filtres par catégories
5. **Contacter** l'association via le formulaire

### Pour les administrateurs
1. **Se connecter** via `/auth/login` avec identifiants administrateur
2. **Accéder** au dashboard `/admin` pour voir les statistiques
3. **Gérer les réalisations** via `/admin/achievements`
4. **Ajouter du contenu** avec les différentes catégories disponibles

## Statut de déploiement
- **Platform** : Cloudflare Pages/Workers (Hono framework)
- **Statut** : ✅ Actif en développement
- **Tech Stack** : Hono + TypeScript + Tailwind CSS + D1 SQLite
- **Dernière mise à jour** : 11 octobre 2025

## Installation et développement

### Prérequis
```bash
npm install
```

### Développement local
```bash
# Construction du projet
npm run build

# Démarrage avec PM2 (recommandé pour sandbox)
pm2 start ecosystem.config.cjs

# Développement local (hors sandbox)
npm run dev
```

### Base de données
```bash
# Migration locale
npm run db:migrate:local

# Seed avec données de test
npm run db:seed

# Reset complet
npm run db:reset
```

### Déploiement
```bash
# Déploiement vers Cloudflare Pages
npm run deploy
```

### Types Cloudflare
```bash
# Génération/synchronisation des types
npm run cf-typegen
```

## Configuration technique

### Hono avec bindings Cloudflare
```typescript
// src/index.tsx
const app = new Hono<{ Bindings: CloudflareBindings }>()
```

### Facebook Integration
Les iframes Facebook sont intégrés avec des conteneurs responsives utilisant padding-bottom pour maintenir les ratios d'aspect corrects sur tous les écrans.

## Prochaines étapes recommandées
1. **Finaliser le système de dons** avec intégration PayPal/Stripe
2. **Implémenter l'espace membres** avec authentification
3. **Déployer en production** sur pourbienvivreensemble.com
4. **Optimiser le SEO** et les performances
5. **Ajouter plus de contenu** dans les réalisations