// Script d'initialisation de la base de données locale pour les réalisations PBVE
import fs from 'fs'
import path from 'path'

// Créer le répertoire .wrangler/state/v3/d1 s'il n'existe pas
const dbDir = '.wrangler/state/v3/d1'
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

// Copier le fichier de migration
const migrationPath = 'migrations/0001_create_realisations.sql'
if (fs.existsSync(migrationPath)) {
  console.log('✅ Base de données configurée pour le développement local')
  console.log('📝 Exécutez les commandes suivantes pour finaliser:')
  console.log('')
  console.log('1. npm run build')
  console.log('2. npx wrangler d1 migrations apply pbve-realisations --local')
  console.log('3. npm start (ou pm2 restart)')
  console.log('')
  console.log('🔑 Accès admin: /admin/realisations/login')
  console.log('   Email: admin@pbve.fr')
  console.log('   Mot de passe: pbve2024!')
} else {
  console.error('❌ Fichier de migration introuvable')
}