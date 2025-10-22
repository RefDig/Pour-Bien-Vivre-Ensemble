# Script de création d'un utilisateur admin pour MySQL
# À exécuter sur le VPS après l'installation

import bcrypt from 'bcryptjs'

// Mot de passe à définir
const password = 'pbve2024!'  // Changez ce mot de passe

// Générer le hash bcrypt
const hash = bcrypt.hashSync(password, 10)

console.log('Hash bcrypt généré :')
console.log(hash)
console.log('')
console.log('Requête SQL à exécuter dans MySQL :')
console.log(`INSERT INTO admin (username, password_hash) VALUES ('admin', '${hash}');`)
console.log('')
console.log('Ou pour mettre à jour un admin existant :')
console.log(`UPDATE admin SET password_hash = '${hash}' WHERE username = 'admin';`)
