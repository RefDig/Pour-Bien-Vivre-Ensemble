# Guide de configuration du reverse proxy pour PBVE

## Déterminer quel serveur web vous utilisez

Sur le VPS, tapez cette commande pour savoir si vous utilisez Nginx ou Apache :

```bash
# Vérifier Nginx
systemctl status nginx

# Vérifier Apache
systemctl status apache2
# ou
systemctl status httpd
```

---

## Option A : Configuration avec Nginx

### 1. Créer le fichier de configuration

```bash
sudo nano /etc/nginx/sites-available/pbve.conf
```

Collez le contenu du fichier `nginx-pbve.conf` (remplacez `pourbienvivreensemble.fr` par votre domaine si différent).

### 2. Activer la configuration

```bash
# Créer un lien symbolique
sudo ln -s /etc/nginx/sites-available/pbve.conf /etc/nginx/sites-enabled/

# Tester la configuration
sudo nginx -t

# Recharger Nginx
sudo systemctl reload nginx
```

### 3. Ouvrir le port 80 dans le firewall

```bash
sudo ufw allow 80
sudo ufw allow 443
```

---

## Option B : Configuration avec Apache

### 1. Activer les modules nécessaires

```bash
sudo a2enmod proxy proxy_http proxy_wstunnel rewrite headers ssl
```

### 2. Créer le fichier de configuration

```bash
sudo nano /etc/apache2/sites-available/pbve.conf
```

Collez le contenu du fichier `apache-pbve.conf` (remplacez `pourbienvivreensemble.fr` par votre domaine si différent).

### 3. Activer la configuration

```bash
# Activer le site
sudo a2ensite pbve.conf

# Tester la configuration
sudo apache2ctl configtest

# Recharger Apache
sudo systemctl reload apache2
```

### 4. Ouvrir le port 80 dans le firewall

```bash
sudo ufw allow 80
sudo ufw allow 443
```

---

## Configurer PM2 pour garder Node.js en arrière-plan

Avant de continuer, il est recommandé de garder le serveur Node.js actif en permanence avec PM2 :

```bash
# Installer PM2 globalement
sudo npm install -g pm2

# Aller dans le dossier public_html
cd /home/pourbienvivreens/public_html

# Arrêter le serveur actuel (Ctrl+C si encore lancé)
# Puis démarrer avec PM2
pm2 start server-vps.js --name pbve-backend

# Vérifier le statut
pm2 status

# Sauvegarder la configuration PM2
pm2 save

# Configurer PM2 pour démarrer au boot
pm2 startup

# Copier-coller la commande affichée par PM2 et l'exécuter
```

### Commandes PM2 utiles

```bash
# Voir les logs
pm2 logs pbve-backend

# Redémarrer le serveur
pm2 restart pbve-backend

# Arrêter le serveur
pm2 stop pbve-backend

# Supprimer le serveur de PM2
pm2 delete pbve-backend
```

---

## Installer un certificat SSL (HTTPS) avec Let's Encrypt

Une fois le reverse proxy configuré et fonctionnel en HTTP, installez un certificat SSL :

### Avec Nginx

```bash
# Installer Certbot
sudo apt install certbot python3-certbot-nginx

# Obtenir et installer le certificat
sudo certbot --nginx -d pourbienvivreensemble.fr -d www.pourbienvivreensemble.fr

# Renouvellement automatique (déjà configuré par défaut)
sudo certbot renew --dry-run
```

### Avec Apache

```bash
# Installer Certbot
sudo apt install certbot python3-certbot-apache

# Obtenir et installer le certificat
sudo certbot --apache -d pourbienvivreensemble.fr -d www.pourbienvivreensemble.fr

# Renouvellement automatique (déjà configuré par défaut)
sudo certbot renew --dry-run
```

---

## Tester la configuration

1. **Tester depuis le VPS** :
   ```bash
   curl http://localhost:3000/api/health
   curl http://pourbienvivreensemble.fr/api/health
   ```

2. **Tester depuis votre navigateur** :
   - Ouvrez `http://pourbienvivreensemble.fr`
   - Vous devriez voir votre site

3. **Vérifier les logs** :
   ```bash
   # Logs Nginx
   sudo tail -f /var/log/nginx/pbve-error.log
   sudo tail -f /var/log/nginx/pbve-access.log

   # Logs Apache
   sudo tail -f /var/log/apache2/pbve-error.log
   sudo tail -f /var/log/apache2/pbve-access.log

   # Logs PM2
   pm2 logs pbve-backend
   ```

---

## Dépannage

### Le site n'est pas accessible depuis l'extérieur

1. Vérifiez que le serveur Node.js est bien lancé : `pm2 status`
2. Vérifiez que Nginx/Apache est lancé : `systemctl status nginx` ou `systemctl status apache2`
3. Vérifiez les ports ouverts : `sudo ufw status`
4. Vérifiez les logs : `sudo tail -f /var/log/nginx/pbve-error.log`

### Erreur 502 Bad Gateway

- Le serveur Node.js n'est probablement pas démarré : `pm2 restart pbve-backend`
- Vérifiez que le port 3000 est bien écouté : `sudo netstat -tuln | grep 3000`

### Erreur de connexion MySQL

- Vérifiez le fichier `.env` : `cat /home/pourbienvivreens/public_html/.env`
- Vérifiez que MySQL est lancé : `systemctl status mysql`
- Testez la connexion : `mysql -u pourbienvivreens_pbve -p pourbienvivreens_pbve`

---

## Résumé des commandes essentielles

```bash
# 1. Configurer PM2 pour Node.js
cd /home/pourbienvivreens/public_html
pm2 start server-vps.js --name pbve-backend
pm2 save
pm2 startup

# 2. Configurer Nginx (ou Apache)
sudo nano /etc/nginx/sites-available/pbve.conf
sudo ln -s /etc/nginx/sites-available/pbve.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 3. Ouvrir les ports
sudo ufw allow 80
sudo ufw allow 443

# 4. Installer SSL
sudo certbot --nginx -d pourbienvivreensemble.fr -d www.pourbienvivreensemble.fr

# 5. Tester
curl http://pourbienvivreensemble.fr/api/health
```

---

Votre site devrait maintenant être accessible depuis l'extérieur via votre nom de domaine !
