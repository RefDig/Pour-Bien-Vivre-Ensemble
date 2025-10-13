-- Création de la table des réalisations PBVE
CREATE TABLE IF NOT EXISTS realisations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titre TEXT NOT NULL,
  description TEXT,
  categorie TEXT NOT NULL CHECK (categorie IN ('textes', 'videos', 'livres_audio', 'podcasts', 'flipbooks')),
  url_contenu TEXT NOT NULL, -- URL du fichier ou lien vers le contenu
  url_thumbnail TEXT, -- URL de l'image de prévisualisation
  en_vedette BOOLEAN DEFAULT 0, -- Mise en vedette (1 = oui, 0 = non)
  date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
  date_modification DATETIME DEFAULT CURRENT_TIMESTAMP,
  statut TEXT DEFAULT 'publie' CHECK (statut IN ('brouillon', 'publie', 'archive')),
  auteur TEXT, -- Nom de l'auteur ou créateur
  duree INTEGER, -- Durée en secondes pour audio/vidéo
  taille_fichier INTEGER, -- Taille du fichier en octets
  nombre_vues INTEGER DEFAULT 0,
  metadata JSON -- Métadonnées additionnelles (tags, ISBN pour livres, etc.)
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_realisations_categorie ON realisations(categorie);
CREATE INDEX IF NOT EXISTS idx_realisations_date ON realisations(date_creation);
CREATE INDEX IF NOT EXISTS idx_realisations_vedette ON realisations(en_vedette);
CREATE INDEX IF NOT EXISTS idx_realisations_statut ON realisations(statut);

-- Table des administrateurs (pour l'authentification)
CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  nom TEXT NOT NULL,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'moderateur')),
  derniere_connexion DATETIME,
  actif BOOLEAN DEFAULT 1,
  date_creation DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Créer un administrateur par défaut (mot de passe: pbve2024!)
INSERT OR IGNORE INTO admin_users (email, password_hash, nom, role) 
VALUES ('admin@pbve.fr', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'Administrateur PBVE', 'admin');

-- Table de sessions pour l'authentification
CREATE TABLE IF NOT EXISTS admin_sessions (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES admin_users(id)
);

-- Données d'exemple de réalisations
INSERT OR IGNORE INTO realisations (titre, description, categorie, url_contenu, en_vedette, auteur) VALUES 
('Guide de la Solidarité 2024', 'Manuel pratique pour développer l''entraide dans le quartier de Lille Sud', 'textes', '/static/documents/guide-solidarite-2024.pdf', 1, 'Marie Cappello'),
('Témoignages Habitants', 'Recueil des témoignages des habitants sur leurs expériences associatives', 'textes', '/static/documents/temoignages-habitants.pdf', 0, 'Équipe PBVE'),
('Atelier Cuisine Communautaire', 'Vidéo des ateliers cuisine du mois de septembre', 'videos', 'https://www.youtube.com/embed/example1', 0, 'Atelier Cuisine PBVE'),
('Jardins Partagés en Action', 'Documentaire sur nos jardins communautaires', 'videos', 'https://www.youtube.com/embed/example2', 0, 'Équipe Jardinage'),
('Histoires de Lille Sud', 'Livre audio racontant l''histoire du quartier par ses habitants', 'livres_audio', '/static/audio/histoires-lille-sud.mp3', 0, 'Groupe Histoire Locale'),
('Mémoires d''Anciens', 'Témoignages audio des anciens du quartier', 'livres_audio', '/static/audio/memoires-anciens.mp3', 0, 'Club Seniors PBVE'),
('PBVE Radio - Épisode 1', 'Premier épisode de notre podcast associatif', 'podcasts', '/static/audio/pbve-radio-ep1.mp3', 0, 'Radio PBVE'),
('Actualités du Quartier', 'Podcast mensuel sur les actualités locales', 'podcasts', '/static/audio/actualites-quartier.mp3', 0, 'Équipe Communication'),
('Rapport Activité 2023', 'Bilan complet des actions menées en 2023', 'flipbooks', 'https://online.fliphtml5.com/example1', 0, 'Bureau PBVE'),
('Brochure Nouveaux Arrivants', 'Guide d''accueil pour les nouveaux habitants', 'flipbooks', 'https://online.fliphtml5.com/example2', 0, 'Comité d''Accueil');