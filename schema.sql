-- Schema für die Eurovision Song Contest Tippspiel Datenbank

-- Benutzer-Tabelle
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL UNIQUE,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

-- Länder-Tabelle
CREATE TABLE IF NOT EXISTS countries (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  flag_code TEXT NOT NULL,
  artist TEXT,
  song TEXT
);

-- Vorhersagen-Tabelle
CREATE TABLE IF NOT EXISTS predictions (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  country_id INTEGER REFERENCES countries(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  UNIQUE(user_id, country_id),
  UNIQUE(user_id, position)
);

-- Ergebnisse-Tabelle
CREATE TABLE IF NOT EXISTS results (
  id SERIAL PRIMARY KEY,
  country_id INTEGER REFERENCES countries(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  UNIQUE(country_id),
  UNIQUE(position)
);

-- Berechtigungen einstellen (für Supabase)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

-- Öffentlichen Zugriff erlauben
CREATE POLICY "Alle können Benutzer einsehen" ON users
  FOR SELECT USING (true);

CREATE POLICY "Benutzer können sich selbst erstellen" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Alle können Länder einsehen" ON countries
  FOR SELECT USING (true);

CREATE POLICY "Alle können eigene Vorhersagen erstellen" ON predictions
  FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IN (SELECT id FROM users WHERE is_admin = true));

CREATE POLICY "Alle können eigene Vorhersagen aktualisieren" ON predictions
  FOR UPDATE USING (auth.uid() = user_id OR auth.uid() IN (SELECT id FROM users WHERE is_admin = true));

CREATE POLICY "Alle können eigene Vorhersagen löschen" ON predictions
  FOR DELETE USING (auth.uid() = user_id OR auth.uid() IN (SELECT id FROM users WHERE is_admin = true));

CREATE POLICY "Alle können Vorhersagen einsehen" ON predictions
  FOR SELECT USING (true);

CREATE POLICY "Nur Admins können Ergebnisse verwalten" ON results
  FOR ALL USING (auth.uid() IN (SELECT id FROM users WHERE is_admin = true))
  WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE is_admin = true));

CREATE POLICY "Alle können Ergebnisse einsehen" ON results
  FOR SELECT USING (true);

-- Beispiel-Daten für Länder einfügen
INSERT INTO countries (id, name, flag_code, artist, song) VALUES
  (1, 'Norwegen', 'no', 'Kyle Alessandro', 'Lighter'),
  (2, 'Luxemburg', 'lu', 'Laura Thorn', 'La poupée monte le son'),
  (3, 'Estland', 'ee', 'Tommy Cash', 'Espresso Macchiato'),
  (4, 'Israel', 'il', 'Yuval Raphael', 'New Day Will Rise'),
  (5, 'Litauen', 'lt', 'Katarsis', 'Tavo Akys'),
  (6, 'Spanien', 'es', 'Melody', 'Esa diva'),
  (7, 'Ukraine', 'ua', 'Ziferblat', 'Bird Of Pray'),
  (8, 'Großbritannien', 'gb', 'Remember Monday', 'What The Hell Just Happened?'),
  (9, 'Österreich', 'at', 'JJ', 'Wasted Love'),
  (10, 'Island', 'is', 'VÆB', 'Róa'),
  (11, 'Lettland', 'lv', 'Tautumeitas', 'Bur man laimi'),
  (12, 'Niederlande', 'nl', 'Claude', 'C''est la vie'),
  (13, 'Finnland', 'fi', 'Erika Vikman', 'Ich komme'),
  (14, 'Italien', 'it', 'Lucio Corsi', 'Volevo essere un duro'),
  (15, 'Polen', 'pl', 'Justyna Steczkowska', 'Gaja'),
  (16, 'Deutschland', 'de', 'Abor & Tynna', 'Baller'),
  (17, 'Griechenland', 'gr', 'Klavdia', 'Asteromata'),
  (18, 'Armenien', 'am', 'Parg', 'Survivor'),
  (19, 'Schweiz', 'ch', 'Zoë Mä', 'Voyage'),
  (20, 'Malta', 'mt', 'Miriana Conte', 'Serving'),
  (21, 'Portugal', 'pt', 'NAPA', 'Deslocado'),
  (22, 'Dänemark', 'dk', 'Sissal', 'Hallucination'),
  (23, 'Schweden', 'se', 'KAJ', 'Bara bada bastu'),
  (24, 'Frankreich', 'fr', 'Louane', 'Maman'),
  (25, 'San Marino', 'sm', 'Gabry Ponte', 'Tutta l''Italia'),
  (26, 'Albanien', 'al', 'Shkodra Elektronike', 'Zjerm'); 