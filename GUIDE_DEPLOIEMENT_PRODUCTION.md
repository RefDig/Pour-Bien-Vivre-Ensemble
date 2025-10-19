# 🚀 Guide de Déploiement en Production
**Projet:** Pour Bien Vivre Ensemble  
**Version:** 1.0.0  
**Date:** 19 octobre 2025

---

## 📋 Pré-requis

### Comptes & Accès
- ✅ Compte Cloudflare avec accès à Workers & Pages
- ✅ Accès au repository GitHub (RefDig/Pour-Bien-Vivre-Ensemble)
- ✅ Node.js v18+ installé
- ✅ npm ou yarn installé

### Configuration Locale
```bash
# Cloner le repository
git clone https://github.com/RefDig/Pour-Bien-Vivre-Ensemble.git
cd Pour-Bien-Vivre-Ensemble/webapp

# Installer les dépendances
npm install

# Vérifier la configuration
npm run build
```

---

## 🔧 Configuration Cloudflare

### 1. Créer la Base de Données D1

```bash
# Se connecter à Cloudflare
wrangler login

# Créer la base de données
wrangler d1 create pbve-realisations

# Noter l'ID de la base (à ajouter dans wrangler.toml)
```

**Ajouter dans `wrangler.toml`:**
```toml
[[d1_databases]]
binding = "DB"
database_name = "pbve-realisations"
database_id = "VOTRE_DATABASE_ID_ICI"
```

### 2. Créer les KV Namespaces

```bash
# Créer KV pour la galerie
wrangler kv:namespace create "GALERIE_DATA"

# Créer KV pour les réalisations
wrangler kv:namespace create "REALISATIONS_DATA"
```

**Les IDs sont déjà dans `wrangler.toml`:**
- GALERIE_DATA: `42da596772d84aa3bbf313755fca2fde`
- REALISATIONS_DATA: `66a3c6babc1d4867bd97f5d90b31a454`

### 3. Appliquer les Migrations

```bash
# Appliquer les migrations en production
wrangler d1 migrations apply pbve-realisations

# Vérifier que les tables sont créées
wrangler d1 execute pbve-realisations --command "SELECT name FROM sqlite_master WHERE type='table';"
```

---

## 🔐 Sécurité - Credentials

### ⚠️ IMPORTANT - Changer le Mot de Passe Admin

**Credentials par défaut (À CHANGER IMMÉDIATEMENT):**
- Email: `admin@pbve.fr`
- Mot de passe: `pbve2024!`

**Pour changer le mot de passe:**

1. Générer un nouveau hash SHA-256:
```bash
echo -n "VOTRE_NOUVEAU_MOT_DE_PASSE" | sha256sum
```

2. Mettre à jour en base:
```bash
wrangler d1 execute pbve-realisations --command "UPDATE admin_users SET password_hash='NOUVEAU_HASH' WHERE email='admin@pbve.fr';"
```

3. Ou créer un nouveau compte:
```bash
wrangler d1 execute pbve-realisations --command "INSERT INTO admin_users (email, password_hash, nom, role) VALUES ('votre@email.fr', 'VOTRE_HASH', 'Votre Nom', 'admin');"
```

---

## 🚀 Déploiement

### Méthode 1: Déploiement Automatique (Recommandé)

```bash
# Build et déploiement en une commande
npm run deploy

# Ou avec le nom du projet spécifique
npm run deploy:prod
```

### Méthode 2: Déploiement Manuel

```bash
# 1. Build de l'application
npm run build

# 2. Déployer sur Cloudflare Pages
wrangler pages deploy dist --project-name pour-bien-vivre-ensemble

# 3. Lier la base D1 au projet
wrangler pages project create pour-bien-vivre-ensemble
```

### Méthode 3: GitHub Actions (CI/CD)

Créer `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
        working-directory: ./webapp
      
      - name: Build
        run: npm run build
        working-directory: ./webapp
      
      - name: Deploy to Cloudflare
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          workingDirectory: ./webapp
          command: pages deploy dist --project-name pour-bien-vivre-ensemble
```

---

## 🌐 Configuration DNS & Domaine

### 1. Configurer le Domaine Custom

Dans Cloudflare Dashboard:
1. Aller dans **Pages** > **pour-bien-vivre-ensemble**
2. **Custom domains** > **Set up a custom domain**
3. Ajouter: `pourbienvivreensemble.com`
4. Cloudflare configurera automatiquement les DNS

### 2. Forcer HTTPS

Dans Cloudflare Dashboard:
1. **SSL/TLS** > **Overview**
2. Mode: **Full (strict)**
3. **Edge Certificates** > **Always Use HTTPS**: ON
4. **Automatic HTTPS Rewrites**: ON

### 3. Optimisations Performance

**Auto Minify:**
- JavaScript: ON
- CSS: ON
- HTML: ON

**Brotli Compression:** ON

**Cache Level:** Standard

---

## 📊 Vérification Post-Déploiement

### 1. Tests de Base

```bash
# Tester la page d'accueil
curl https://pourbienvivreensemble.com

# Tester la page de login admin
curl https://pourbienvivreensemble.com/admin/realisations/login

# Tester les API
curl https://pourbienvivreensemble.com/api/realisations
```

### 2. Tests Fonctionnels

- [ ] Page d'accueil charge correctement
- [ ] Connexion admin fonctionne
- [ ] Dashboard admin accessible après login
- [ ] Galerie affiche les images
- [ ] Liste des réalisations s'affiche
- [ ] Pas de boucle de redirection
- [ ] Cookies fonctionnent (admin_session)

### 3. Tests de Sécurité

- [ ] HTTPS activé et fonctionnel
- [ ] Redirection HTTP → HTTPS active
- [ ] Cookies `secure` en production
- [ ] Headers de sécurité configurés
- [ ] Pas de credentials en clair dans le code

### 4. Tests de Performance

Utiliser Lighthouse ou PageSpeed Insights:
```bash
# Installer Lighthouse
npm install -g lighthouse

# Tester le site
lighthouse https://pourbienvivreensemble.com --view
```

**Objectifs:**
- Performance: >90
- Accessibility: >90
- Best Practices: >90
- SEO: >90

---

## 🔍 Monitoring & Logs

### Cloudflare Analytics

Dans Cloudflare Dashboard:
1. **Analytics & Logs** > **Web Analytics**
2. Activer pour le domaine
3. Monitorer:
   - Trafic
   - Erreurs 4xx/5xx
   - Temps de réponse
   - Bandwidth

### Cloudflare Logs

```bash
# Voir les logs en temps réel
wrangler tail

# Filtrer par méthode
wrangler tail --format pretty --method POST

# Filtrer par statut
wrangler tail --status error
```

### Alertes Email

Configurer des alertes dans Cloudflare:
1. **Notifications** > **Add**
2. Créer des alertes pour:
   - Erreurs 5xx élevées
   - Trafic inhabituel
   - Utilisation D1/KV élevée

---

## 🔄 Mises à Jour & Rollback

### Déployer une Mise à Jour

```bash
# 1. Mettre à jour le code
git pull origin main

# 2. Installer les nouvelles dépendances
npm install

# 3. Tester localement
npm run dev

# 4. Build et déployer
npm run deploy
```

### Rollback en Cas de Problème

```bash
# Lister les déploiements
wrangler pages deployments list --project-name pour-bien-vivre-ensemble

# Promouvoir un ancien déploiement
wrangler pages deployment tail <DEPLOYMENT_ID>
```

Ou dans Cloudflare Dashboard:
1. **Pages** > **pour-bien-vivre-ensemble**
2. **Deployments**
3. Cliquer sur un ancien déploiement
4. **Rollback to this deployment**

---

## 📦 Backups

### Sauvegarder la Base D1

```bash
# Exporter toutes les données
wrangler d1 execute pbve-realisations --command "SELECT * FROM realisations;" > backup_realisations_$(date +%Y%m%d).sql

wrangler d1 execute pbve-realisations --command "SELECT * FROM admin_users;" > backup_users_$(date +%Y%m%d).sql

# Créer un backup complet
wrangler d1 backup create pbve-realisations
```

### Restaurer un Backup

```bash
# Restaurer depuis un fichier SQL
wrangler d1 execute pbve-realisations --file=backup_realisations_20251019.sql
```

### Automatiser les Backups (Cron)

Créer un script `backup.sh`:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
wrangler d1 execute pbve-realisations --command "SELECT * FROM realisations;" > /backups/realisations_$DATE.sql
# Garder seulement les 30 derniers jours
find /backups -name "realisations_*.sql" -mtime +30 -delete
```

Ajouter au crontab:
```bash
0 2 * * * /path/to/backup.sh
```

---

## 🐛 Dépannage

### Problème: Boucle de Redirection

**Symptôme:** ERR_TOO_MANY_REDIRECTS sur la page login

**Solution:**
1. Vérifier que le cookie est bien dynamique (HTTP/HTTPS)
2. Vider le cache du navigateur
3. Vérifier les logs: `wrangler tail`
4. Vérifier la session en base D1

### Problème: 500 Internal Server Error

**Causes possibles:**
1. Base D1 non liée au projet
2. KV namespace non configuré
3. Erreur dans le code (migrations non appliquées)

**Solution:**
```bash
# Vérifier les bindings
wrangler pages project list

# Vérifier la configuration
cat wrangler.toml

# Relancer le déploiement
npm run deploy
```

### Problème: Session Expirée Immédiatement

**Solution:**
1. Vérifier l'expiration dans le code (24h par défaut)
2. Vérifier l'heure système du serveur
3. Nettoyer les sessions expirées:
```bash
wrangler d1 execute pbve-realisations --command "DELETE FROM admin_sessions WHERE expires_at < datetime('now');"
```

---

## 📞 Support

### Documentation Officielle
- [Cloudflare Pages](https://developers.cloudflare.com/pages/)
- [Cloudflare D1](https://developers.cloudflare.com/d1/)
- [Cloudflare KV](https://developers.cloudflare.com/workers/runtime-apis/kv/)
- [Hono Framework](https://hono.dev/)

### Commandes Utiles

```bash
# Status du projet
wrangler pages project list

# Logs en temps réel
wrangler tail

# Info sur la base D1
wrangler d1 info pbve-realisations

# Lister les KV
wrangler kv:key list --namespace-id=42da596772d84aa3bbf313755fca2fde

# Version de Wrangler
wrangler --version
```

---

## ✅ Checklist Finale

### Avant le Lancement
- [ ] Build réussi sans erreur
- [ ] Migrations D1 appliquées
- [ ] Credentials admin changés
- [ ] Domaine custom configuré
- [ ] HTTPS forcé
- [ ] Tests fonctionnels passés
- [ ] Backups configurés
- [ ] Monitoring activé
- [ ] Documentation à jour

### Après le Lancement
- [ ] Tester depuis différents navigateurs
- [ ] Vérifier Analytics Cloudflare
- [ ] Monitorer les erreurs 24h
- [ ] Informer l'équipe/client
- [ ] Planifier la prochaine mise à jour

---

**🎉 Félicitations ! Votre application est en production !**

Pour toute question technique, consultez le `RAPPORT_TECHNIQUE_CTO.md` ou contactez LYS Enterprise Solutions.
