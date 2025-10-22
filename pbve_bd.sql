-- Table des administrateurs
CREATE TABLE admin (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des réalisations
CREATE TABLE realisations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titre VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(255),
  date_realisation DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table galerie (images)
CREATE TABLE galerie (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titre VARCHAR(255),
  image_url VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);