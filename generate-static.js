const fs = require('fs');
const path = require('path');

// Script pour générer les pages statiques à partir du code Hono

const pages = [
  { route: '/', filename: 'index.html', title: 'Accueil' },
  { route: '/a-propos', filename: 'a-propos.html', title: 'À propos' },
  { route: '/actualites', filename: 'actualites.html', title: 'Actualités' },
  { route: '/galerie', filename: 'galerie.html', title: 'Galerie' },
  { route: '/evenements', filename: 'evenements.html', title: 'Événements' },
  { route: '/contact', filename: 'contact.html', title: 'Contact' }
];

const staticDir = path.join(__dirname, 'static-site');
const publicDir = path.join(__dirname, 'public');

// Créer le dossier de sortie
if (!fs.existsSync(staticDir)) {
  fs.mkdirSync(staticDir, { recursive: true });
}

// Copier les assets statiques
if (fs.existsSync(publicDir)) {
  const copyDir = (src, dest) => {
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      
      if (entry.isDirectory()) {
        copyDir(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  };
  
  copyDir(path.join(publicDir, 'static'), path.join(staticDir, 'static'));
}

console.log('✅ Génération du site statique terminée dans le dossier static-site/');
console.log('📁 Contenu à uploader sur votre serveur cPanel :');
console.log('   - Tous les fichiers du dossier static-site/');
console.log('   - Upload dans le dossier public_html/ de votre cPanel');