# 🗄️ Migration vers Base de Données MySQL (cPanel)

## 📋 **Structure de la base de données**

### **Tables nécessaires :**

```sql
-- Table des administrateurs
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('admin') DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des réalisations
CREATE TABLE achievements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    category ENUM('texte', 'vidéos', 'livre audios', 'podcast', 'flipbook') NOT NULL,
    content_url TEXT,
    image_url TEXT,
    status ENUM('draft', 'published') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Données initiales
INSERT INTO users (email, password, name) VALUES 
('admin@pourbienvivreensemble.fr', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrateur PBVE');

-- Exemples de réalisations
INSERT INTO achievements (title, description, category, status) VALUES 
('Guide des Services Publics', 'Guide pratique des démarches administratives pour les seniors', 'texte', 'published'),
('Atelier Couture Intergénérationnel', 'Vidéo de notre atelier couture avec les mamies du quartier', 'vidéos', 'published'),
('Histoires de Lille Sud', 'Livre audio des témoignages des anciens du quartier', 'livre audios', 'published'),
('Podcast Solidarité', 'Émission mensuelle sur les initiatives solidaires', 'podcast', 'published'),
('Flipbook Activités', 'Présentation interactive de toutes nos activités', 'flipbook', 'draft');
```

## 🛠️ **Fichiers PHP à créer**

### **1. Configuration (config.php)**
```php
<?php
// Configuration base de données
define('DB_HOST', 'localhost');
define('DB_NAME', 'votre_nom_bdd');  // À adapter
define('DB_USER', 'votre_user_bdd'); // À adapter  
define('DB_PASS', 'votre_pass_bdd'); // À adapter

// Connexion PDO
try {
    $pdo = new PDO("mysql:host=".DB_HOST.";dbname=".DB_NAME.";charset=utf8", DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die('Erreur de connexion : ' . $e->getMessage());
}

// Gestion des sessions
session_start();

// Vérification admin
function isAdmin() {
    return isset($_SESSION['admin_id']);
}

// Redirection si non admin
function requireAdmin() {
    if (!isAdmin()) {
        header('Location: /admin/login.php');
        exit;
    }
}
?>
```

### **2. Interface admin (admin/index.php)**
```php
<?php require_once '../config.php'; requireAdmin(); ?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Administration PBVE</title>
    <!-- CSS identique au site -->
</head>
<body>
    <div class="admin-container">
        <h1>Administration PBVE</h1>
        
        <!-- Dashboard avec stats -->
        <div class="stats-grid">
            <?php
            $stmt = $pdo->query("SELECT 
                COUNT(*) as total,
                SUM(status='published') as published,
                SUM(status='draft') as draft 
                FROM achievements");
            $stats = $stmt->fetch();
            ?>
            
            <div class="stat-card">
                <h3>Réalisations totales</h3>
                <span class="stat-number"><?= $stats['total'] ?></span>
            </div>
            <div class="stat-card">
                <h3>Publiées</h3>
                <span class="stat-number"><?= $stats['published'] ?></span>
            </div>
            <div class="stat-card">
                <h3>Brouillons</h3>
                <span class="stat-number"><?= $stats['draft'] ?></span>
            </div>
        </div>

        <!-- Liste des réalisations -->
        <div class="achievements-management">
            <h2>Gestion des Réalisations</h2>
            <a href="add-achievement.php" class="btn-primary">Ajouter une réalisation</a>
            
            <table class="achievements-table">
                <thead>
                    <tr>
                        <th>Titre</th>
                        <th>Catégorie</th>
                        <th>Statut</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    $stmt = $pdo->query("SELECT * FROM achievements ORDER BY created_at DESC");
                    while ($achievement = $stmt->fetch()) {
                    ?>
                    <tr>
                        <td><?= htmlspecialchars($achievement['title']) ?></td>
                        <td><?= $achievement['category'] ?></td>
                        <td>
                            <span class="status-<?= $achievement['status'] ?>">
                                <?= $achievement['status'] === 'published' ? 'Publié' : 'Brouillon' ?>
                            </span>
                        </td>
                        <td><?= date('d/m/Y', strtotime($achievement['created_at'])) ?></td>
                        <td>
                            <a href="edit-achievement.php?id=<?= $achievement['id'] ?>">Modifier</a>
                            <a href="delete-achievement.php?id=<?= $achievement['id'] ?>" 
                               onclick="return confirm('Supprimer cette réalisation ?')">Supprimer</a>
                        </td>
                    </tr>
                    <?php } ?>
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>
```

### **3. Affichage public (realisations.php)**
```php
<?php require_once 'config.php'; ?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Nos Réalisations - PBVE</title>
    <!-- CSS du site -->
</head>
<body>
    <!-- Header du site -->
    
    <main>
        <section class="py-16">
            <div class="max-w-7xl mx-auto px-4">
                <h1 class="text-4xl font-bold text-center mb-12">Nos Réalisations</h1>
                
                <!-- Filtres par catégorie -->
                <div class="filters mb-8">
                    <button onclick="filterCategory('all')" class="filter-btn active">Toutes</button>
                    <button onclick="filterCategory('texte')" class="filter-btn">Textes</button>
                    <button onclick="filterCategory('vidéos')" class="filter-btn">Vidéos</button>
                    <button onclick="filterCategory('livre audios')" class="filter-btn">Livres audios</button>
                    <button onclick="filterCategory('podcast')" class="filter-btn">Podcasts</button>
                    <button onclick="filterCategory('flipbook')" class="filter-btn">Flipbooks</button>
                </div>

                <!-- Grille des réalisations -->
                <div class="achievements-grid">
                    <?php
                    $stmt = $pdo->query("SELECT * FROM achievements WHERE status = 'published' ORDER BY created_at DESC");
                    while ($achievement = $stmt->fetch()) {
                    ?>
                    <div class="achievement-card" data-category="<?= $achievement['category'] ?>">
                        <div class="card-header">
                            <span class="category-badge category-<?= str_replace(' ', '-', $achievement['category']) ?>">
                                <?= ucfirst($achievement['category']) ?>
                            </span>
                        </div>
                        <div class="card-content">
                            <h3><?= htmlspecialchars($achievement['title']) ?></h3>
                            <p><?= htmlspecialchars($achievement['description']) ?></p>
                            
                            <?php if ($achievement['content_url']) { ?>
                            <a href="<?= $achievement['content_url'] ?>" class="btn-primary" target="_blank">
                                Voir la réalisation
                            </a>
                            <?php } ?>
                        </div>
                        <div class="card-footer">
                            <small>Ajouté le <?= date('d/m/Y', strtotime($achievement['created_at'])) ?></small>
                        </div>
                    </div>
                    <?php } ?>
                </div>
            </div>
        </section>
    </main>
    
    <!-- Footer du site -->
</body>
</html>
```

## 🔧 **PROCÉDURE D'INSTALLATION cPanel**

### **Étape 1 : Créer la base de données**
1. **cPanel** → **Bases de données MySQL**
2. **Créer une nouvelle base** : `pbve_website`
3. **Créer un utilisateur** avec mot de passe
4. **Associer l'utilisateur** à la base (tous les privilèges)

### **Étape 2 : Importer les tables**
1. **cPanel** → **phpMyAdmin**
2. **Sélectionner** votre base `pbve_website`
3. **Onglet SQL** → Coller le code SQL ci-dessus
4. **Exécuter** pour créer les tables

### **Étape 3 : Upload des fichiers PHP**
1. **Uploader** tous les fichiers HTML existants
2. **Ajouter** les fichiers PHP (config.php, admin/, etc.)
3. **Modifier config.php** avec vos identifiants de BDD

### **Étape 4 : Configuration**
- **Tester** la connexion à `/admin/login.php`
- **Identifiants** : `admin@pourbienvivreensemble.fr` / `password123`
- **Modifier** le mot de passe par défaut

## 📊 **FONCTIONNALITÉS AVEC BDD**

### **Interface publique :**
✅ Page des réalisations dynamique (`/realisations.php`)  
✅ Filtres par catégorie  
✅ Contenu mis à jour automatiquement  

### **Interface admin :**
✅ Dashboard avec statistiques  
✅ Ajout/modification/suppression des réalisations  
✅ Gestion des statuts (brouillon/publié)  
✅ Upload d'images  
✅ Authentification sécurisée  

### **Évolutions possibles :**
✅ Gestion des événements  
✅ Newsletter  
✅ Formulaire de contact avancé  
✅ Galerie photos dynamique  

## 💰 **COÛT ET RESSOURCES**

### **Hébergement mutualisé standard :**
- ✅ PHP 7.4+ (inclus)
- ✅ MySQL (inclus)  
- ✅ Espace disque suffisant
- ✅ Pas de coût supplémentaire

**Voulez-vous que je génère tous les fichiers PHP pour la version avec base de données ?**