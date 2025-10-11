# 🚀 Guide de Déploiement cPanel pour pourbienvivreensemble.com

## 📁 **ÉTAPE 1 : Préparation des fichiers**

### **Fichiers à télécharger :**
- Tout le contenu du dossier `static-site/`
- Ces fichiers sont prêts pour un hébergement web traditionnel

### **Structure des fichiers :**
```
static-site/
├── index.html              # Page d'accueil
├── contact.html             # Page contact (déjà créée)
├── a-propos.html           # À créer
├── actualites.html         # À créer  
├── galerie.html            # À créer
├── evenements.html         # À créer
└── static/                 # Dossier avec tous les assets
    ├── logo-pbve-authentique.png
    ├── pbve-colors.css
    ├── app.js
    ├── manifest.json
    ├── sw.js
    └── photo-*.jpg          # Toutes les photos
```

## 🎯 **ÉTAPE 2 : Accès à votre cPanel**

1. **Connectez-vous** à votre espace client hébergeur
2. **Ouvrez cPanel** (interface d'administration)
3. **Trouvez "Gestionnaire de fichiers"** ou "File Manager"

## 📤 **ÉTAPE 3 : Upload des fichiers**

### **Méthode 1 - Via le Gestionnaire de fichiers cPanel :**
1. **Ouvrir le dossier `public_html`** (dossier racine du site)
2. **Supprimer** l'ancien contenu (sauvegardez si nécessaire)
3. **Uploader** tous les fichiers du dossier `static-site/`
4. **Respecter l'arborescence** : le dossier `static/` doit être à la racine

### **Méthode 2 - Via FTP (plus rapide pour beaucoup de fichiers) :**
1. **Utiliser FileZilla** ou un client FTP
2. **Se connecter** avec vos identifiants FTP
3. **Naviguer** vers `/public_html/`
4. **Transférer** tous les fichiers

## ⚙️ **ÉTAPE 4 : Configuration du domaine**

### **Domaine principal :**
- Si `pourbienvivreensemble.com` est votre domaine principal → Les fichiers vont dans `public_html/`
- Si c'est un sous-domaine → Créer un sous-dossier ou utiliser les addon domains

### **Redirection www :**
Dans cPanel → **Redirections** → Ajouter :
```
www.pourbienvivreensemble.com → https://pourbienvivreensemble.com
```

## 🔐 **ÉTAPE 5 : Configuration SSL (HTTPS)**

### **Si SSL gratuit disponible (Let's Encrypt) :**
1. **cPanel** → **SSL/TLS** → **Let's Encrypt**
2. **Sélectionner** votre domaine
3. **Activer** le certificat

### **Si SSL payant :**
- Suivre les instructions de votre hébergeur

### **Forcer HTTPS :**
Créer/modifier le fichier `.htaccess` dans `public_html/` :
```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

## 📧 **ÉTAPE 6 : Configuration Email**

### **Créer l'adresse email :**
1. **cPanel** → **Comptes Email**
2. **Créer** : `contact@pourbienvivreensemble.fr`
3. **Configurer** la redirection ou la boîte mail

### **Formulaire de contact :**
Le formulaire actuel utilise `mailto:` (ouvre le client mail).
Pour un vrai formulaire qui envoie directement, il faudrait du PHP.

## 🧪 **ÉTAPE 7 : Tests et Vérification**

### **Tests à effectuer :**
1. ✅ **Navigation** : Tester tous les liens de menu
2. ✅ **Images** : Vérifier que toutes les photos s'affichent  
3. ✅ **Facebook** : Vérifier que les iframes se chargent
4. ✅ **Responsive** : Tester sur mobile/tablette
5. ✅ **SSL** : Vérifier que https:// fonctionne
6. ✅ **Email** : Tester le formulaire de contact

### **URLs à tester :**
- https://pourbienvivreensemble.com
- https://pourbienvivreensemble.com/contact.html
- https://pourbienvivreensemble.com/actualites.html (une fois créée)

## 🚨 **ÉTAPES SUIVANTES NÉCESSAIRES**

### **Pages manquantes à créer :**
1. **a-propos.html** - Page "À propos" 
2. **actualites.html** - Page actualités Facebook
3. **galerie.html** - Galerie photos  
4. **evenements.html** - Page événements

### **Améliorations possibles :**
1. **Formulaire PHP** - Envoi d'emails direct
2. **Système de gestion** - Pour ajouter du contenu facilement
3. **Blog/News** - Pour ajouter des actualités
4. **SEO** - Optimisation référencement

## 📞 **Support technique**

### **Si problèmes rencontrés :**
1. **Vérifier** les chemins des fichiers (sensible à la casse)
2. **Contrôler** les permissions des fichiers (644 pour les fichiers, 755 pour les dossiers)
3. **Consulter** les logs d'erreur dans cPanel
4. **Contacter** le support de votre hébergeur si nécessaire

## 💡 **Notes importantes**

### **Avantages du site statique :**
- ✅ **Très rapide** - Pas de base de données
- ✅ **Sécurisé** - Pas de failles de sécurité backend  
- ✅ **Économique** - Compatible hébergement mutualisé
- ✅ **SEO friendly** - Bien référencé par Google

### **Limitations :**
- ❌ **Pas d'interface admin** - Modifications directes dans le code
- ❌ **Pas de base de données** - Contenu statique seulement
- ❌ **Formulaires basiques** - Mailto seulement (sans PHP)

**Voulez-vous que je génère les pages manquantes (À propos, Actualités, Galerie, Événements) pour compléter le site ?**