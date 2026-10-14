CREATE DATABASE IF NOT EXISTS ecocycle CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ecocycle;

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  company VARCHAR(100),
  role ENUM('Admin','Operatore','Viewer') DEFAULT 'Operatore',
  reset_token VARCHAR(255),
  reset_expiry DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bins (
  id INT PRIMARY KEY AUTO_INCREMENT,
  bin_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  location VARCHAR(200),
  latitude DECIMAL(10,8),
  longitude DECIMAL(10,8),
  capacity INT DEFAULT 240,
  fill_level INT DEFAULT 0,
  status ENUM('Attivo','Manutenzione','Offline') DEFAULT 'Attivo',
  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE alerts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  bin_id INT,
  type VARCHAR(50),
  message TEXT,
  severity ENUM('Critico','Avviso','Info','Success') DEFAULT 'Info',
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (bin_id) REFERENCES bins(id)
);

CREATE TABLE collections (
  id INT PRIMARY KEY AUTO_INCREMENT,
  bin_id INT,
  collected_by INT,
  weight DECIMAL(10,2),
  collection_time DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (bin_id) REFERENCES bins(id),
  FOREIGN KEY (collected_by) REFERENCES users(id)
);

-- Password: admin123 (bcrypt)
INSERT INTO users (name, email, username, password, role) VALUES
('Admin', 'admin@ecocycle.com', 'admin', '$2y$10$jrNoDWZUFTyDT/rSedoojOx2qA9LPq4YbA87gy/RzTJ2JmUr6bSVm', 'Admin');

INSERT INTO bins (bin_id, name, location, capacity, fill_level, status) VALUES
('BIN-001','Cassonetto A1','Via Roma 12', 240, 85, 'Attivo'),
('BIN-002','Cassonetto A2','Via Roma 45', 240, 45, 'Attivo'),
('BIN-003','Cassonetto B1','Via Milano 23', 120, 15, 'Attivo'),
('BIN-004','Cassonetto B2','Via Milano 56', 240, 60, 'Manutenzione'),
('BIN-005','Cassonetto C1','Piazza San Marco', 240, 95, 'Attivo');

INSERT INTO alerts (bin_id, type, message, severity) VALUES
(1,'Bin Full','Cassonetto riempito al 95%','Critico'),
(2,'Maintenance','Manutenzione schedulata','Avviso'),
(3,'Low Battery','Batteria sensore scarica','Avviso'),
(4,'Online','Dispositivo tornato online','Info'),
(5,'Offline','Dispositivo offline','Critico');

