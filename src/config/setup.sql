DROP TABLE IF EXISTS cars
CREATE TABLE IF NOT EXISTS cars (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  marca TEXT NOT NULL,
  modelo TEXT NOT NULL,
  año TEXT NOT NULL,
  kilometros TEXT NOT NULL,
  color TEXT NOT NULL,
  aire INTEGER NOT NULL,
  pasajeros TEXT NOT NULL,
  transmision TEXT NOT NULL,
  imagen TEXT,
  created_at DATE DEFAULT (datetime('now', 'utc')) NOT NULL,
  updated_at DATE DEFAULT (datetime('now', 'utc')) NOT NULL
)