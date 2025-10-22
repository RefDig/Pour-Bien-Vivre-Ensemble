# Guide de déploiement sur VPS avec MySQL

## 📋 Prérequis
- VPS avec accès SSH
- Node.js v18+ installé
- MySQL/MariaDB installé et configuré
- Base de données `pourbienvivreens_pbve` créée avec les tables (admin, realisations, galerie)

## 🚀 Étapes de déploiement

### 1. Préparer les fichiers sur votre machine locale

```powershell
# Dans le dossier du projet
cd "d:\Pour Bien Vivre Ensemble\PBVE\webapp"

# Compiler le frontend
npm run build

# Créer une archive pour le transfert
# Fichiers à inclure :
# - server-mysql.js
# - package-vps.json (à renommer en package.json sur le VPS)
# - .env.example (à renommer en .env et configurer sur le VPS)
# - dist/ (dossier compilé du frontend)
# - public/ (fichiers statiques)
```

### 2. Transférer les fichiers sur le VPS

Via SSH/SFTP, uploadez les fichiers dans `/var/www/pbve-backend/` (ou autre dossier de votre choix).

```bash
# Exemple avec scp (depuis votre machine locale)
scp -r dist/ user@votre-vps:/var/www/pbve-backend/
scp -r public/ user@votre-vps:/var/www/pbve-backend/
scp server-mysql.js user@votre-vps:/var/www/pbve-backend/
scp package-vps.json user@votre-vps:/var/www/pbve-backend/package.json
scp .env.example user@votre-vps:/var/www/pbve-backend/.env
```

### 3. Installer les dépendances sur le VPS

```bash
# Se connecter en SSH au VPS
ssh user@votre-vps

# Aller dans le dossier du backend
cd /var/www/pbve-backend

# Installer les dépendances Node.js
npm install
```

### 4. Configurer les variables d'environnement

```bash
# Éditer le fichier .env
nano .env

# Vérifier que les paramètres MySQL sont corrects :
DB_HOST=localhost
DB_USER=pourbienvivreens_pbve
DB_PASSWORD=1204@1958
DB_NAME=pourbienvivreens_pbve
PORT=3000
NODE_ENV=production
```

### 5. Créer un utilisateur admin initial

Connectez-vous à MySQL et créez un admin :

```bash
mysql -u pourbienvivreens_pbve -p pourbienvivreens_pbve
```

Dans MySQL :

```sql
-- Créer un admin avec mot de passe hashé (bcrypt)
-- Le mot de passe 'admin123' sera à changer
INSERT INTO admin (username, password_hash) 
VALUES ('admin', '$2a$10$rOvHQk5Z5Z5Z5Z5Z5Z5Z5uXxXxXxXxXxXxXxXxXxXxXxXxXxXx');

-- Pour générer un hash bcrypt, utilisez Node.js :
-- node -e "console.log(require('bcryptjs').hashSync('votre_mot_de_passe', 10))"
```

### 6. Lancer le serveur Node.js

```bash
# Test manuel
node server-mysql.js

# Avec PM2 pour la production (recommandé)
npm install -g pm2
pm2 start server-mysql.js --name pbve-backend
pm2 save
pm2 startup
```

### 7. Configurer Nginx/Apache (reverse proxy)

#### Exemple de configuration Nginx :

```nginx
server {
    listen 80;
    server_name votre-domaine.fr;

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Exemple de configuration Apache (.htaccess) :

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
```

### 8. Tester le déploiement

```bash
# Test de santé de l'API
curl http://localhost:3000/api/health

# Test de l'application
curl http://localhost:3000
```

## 🔒 Sécurité

- Changez le mot de passe admin par défaut
- Utilisez HTTPS (Let's Encrypt avec Certbot)
- Configurez un firewall (UFW, iptables)
- Limitez les accès SSH
- Activez les logs Nginx/Apache et PM2

## 📝 Commandes utiles

```bash
# Voir les logs PM2
pm2 logs pbve-backend

# Redémarrer le service
pm2 restart pbve-backend

# Arrêter le service
pm2 stop pbve-backend

# Supprimer le service
pm2 delete pbve-backend

# Mettre à jour le code
cd /var/www/pbve-backend
git pull  # si vous utilisez Git
npm install
pm2 restart pbve-backend
```

## 🆘 Dépannage

- **Erreur de connexion MySQL** : Vérifiez les identifiants dans le fichier .env
- **Port 3000 déjà utilisé** : Changez le port dans .env (ex: PORT=3001)
- **Erreur de permissions** : Vérifiez les droits sur /var/www/pbve-backend (chown -R www-data:www-data)
- **Service non accessible** : Vérifiez les logs PM2 et Nginx/Apache

## 📞 Support

Pour toute question, contactez votre administrateur système ou consultez la documentation Node.js, PM2, Nginx.
