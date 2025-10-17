-- Script SQL pour la table realisations
CREATE TABLE IF NOT EXISTS realisations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titre TEXT NOT NULL,
  description TEXT,
  categorie TEXT NOT NULL,
  url_contenu TEXT NOT NULL,
  url_thumbnail TEXT,
  en_vedette INTEGER DEFAULT 0,
  auteur TEXT,
  duree INTEGER,
  statut TEXT NOT NULL,
  date_creation DATETIME DEFAULT CURRENT_TIMESTAMP
);
