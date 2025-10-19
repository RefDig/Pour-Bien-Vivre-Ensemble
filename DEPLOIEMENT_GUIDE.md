# 🚀 Guide de Déploiement - Cloudflare Pages

## ✅ Build réussi !

Le projet a été compilé avec succès :
- **Taille du bundle** : 432.14 kB
- **Fichiers générés** : `dist/_worker.js`, `dist/static/`, `dist/_redirects`, `dist/_routes.json`
- **CSS minifié** : ✅ Généré dans `dist/static/style.css`

## 📋 Étapes de déploiement sur Cloudflare Pages

### Option 1 : Déploiement via Git (Recommandé)

1. **Commit et push des changements** :
   ```bash
   git add .
   git commit -m "Fix: Correction complète des .map() et routes - Prêt pour production"
   git push origin main
   ```

2. **Connecter le repository à Cloudflare Pages** :
   - Allez sur https://dash.cloudflare.com/
   - Sélectionnez "Workers & Pages" → "Create application" → "Pages"
   - Connectez votre repository GitHub : `RefDig/Pour-Bien-Vivre-Ensemble`
   - Branch : `main`

3. **Configuration du build** :
   - **Build command** : `npm run build`
   - **Build output directory** : `dist`
   - **Root directory** : `webapp`
   - **Node version** : `18` ou supérieur

4. **Variables d'environnement** (optionnel) :
   - Aucune variable nécessaire pour le moment
   - Les KV namespaces sont déjà configurés dans `wrangler.toml`

5. **Déployer** :
   - Cliquez sur "Save and Deploy"
   - Cloudflare va automatiquement :
     - Cloner le repo
     - Installer les dépendances
     - Exécuter `npm run build`
     - Déployer le contenu de `dist/`

### Option 2 : Déploiement direct avec Wrangler CLI

1. **Installer Wrangler** (si pas déjà fait) :
   ```bash
   npm install -g wrangler
   ```

2. **Se connecter à Cloudflare** :
   ```bash
   wrangler login
   ```

3. **Déployer** :
   ```bash
   wrangler pages deploy dist --project-name=pour-bien-vivre-ensemble
   ```

### Option 3 : Déploiement via l'interface Cloudflare

1. **Aller sur Cloudflare Dashboard** :
   - https://dash.cloudflare.com/ → Workers & Pages → Create application → Upload assets

2. **Upload du dossier dist** :
   - Glissez-déposez le dossier `dist/` ou sélectionnez-le
   - Nom du projet : `pour-bien-vivre-ensemble`

3. **Configuration** :
   - Cloudflare détectera automatiquement la structure
   - Validez et déployez

## 🔧 Configuration Cloudflare Pages

### Redirections (_redirects)
Déjà configurées dans `dist/_redirects` :
```
/auth/*   /admin/realisations/login   302
/admin       /admin/realisations        302
```

### KV Namespaces
Configurés dans `wrangler.toml` :
- **GALERIE_DATA** : `42da596772d84aa3bbf313755fca2fde`
- **REALISATIONS_DATA** : `66a3c6babc1d4867bd97f5d90b31a454`

Pour lier les KV à votre projet Pages :
1. Dashboard Cloudflare → Workers & Pages → Votre projet
2. Settings → Functions → KV namespace bindings
3. Ajouter :
   - Variable : `GALERIE_DATA`, KV : sélectionner le namespace
   - Variable : `REALISATIONS_DATA`, KV : sélectionner le namespace

### Routes personnalisées
Configurées automatiquement via `dist/_routes.json`

## ✅ Vérifications post-déploiement

Une fois déployé, testez :

1. **Page d'accueil** : `https://votre-site.pages.dev/`
2. **Galerie** : `https://votre-site.pages.dev/galerie`
3. **Réalisations** : `https://votre-site.pages.dev/nos-realisations`
4. **Login** : `https://votre-site.pages.dev/login`
5. **Admin galerie** : `https://votre-site.pages.dev/admin/galerie`

## 🔍 Troubleshooting

### Si erreur "Cannot read properties of undefined"
- Vérifier que tous les `.map()` sont protégés avec `?? []`
- ✅ Déjà corrigé dans cette version

### Si les routes ne fonctionnent pas
- Vérifier `_redirects` dans dist/
- Vérifier que les KV namespaces sont liés

### Si les styles ne s'appliquent pas
- Vérifier que `dist/static/style.css` existe
- ✅ Déjà généré avec `npm run build:css`

## 📊 Performance

- **Bundle size** : 432.14 kB
- **Build time** : ~1.5s
- **CSS minified** : ✅

## 🎯 Domaine personnalisé

Pour utiliser `pourbienvivreensemble.com` :
1. Dashboard Cloudflare → Pages → Votre projet → Custom domains
2. Ajouter `pourbienvivreensemble.com`
3. Cloudflare configurera automatiquement les DNS

## 🔐 Sécurité

- HTTPS automatique (certificat SSL gratuit)
- Protection DDoS Cloudflare
- Cache global CDN

---

## 🚀 Commande rapide

Pour rebuilder et vérifier avant le déploiement :
```bash
npm run build && ls dist
```

**Projet prêt pour la production ! 🎉**
