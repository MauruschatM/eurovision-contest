# Eurovision Song Contest Tippspiel

Eine Next.js-App für ein Eurovision Song Contest Tippspiel mit Supabase als Backend.

## Funktionen

- Einfache Anmeldung nur mit Namen (keine Passwörter erforderlich)
- Vorhersage der Platzierungen für alle teilnehmenden Länder
- Einsehen der Vorhersagen anderer Teilnehmer
- Admin-Bereich zum Eintragen der tatsächlichen Ergebnisse
- Automatische Berechnung der Punkte und Rangliste basierend auf den Vorhersagen

## Technologien

- [Next.js 14](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.io/)

## Einrichtung

### Voraussetzungen

- Node.js 18.17 oder höher
- Ein Supabase-Konto und -Projekt

### Installation

1. Repository klonen und in das Verzeichnis wechseln
2. Abhängigkeiten installieren:

```bash
npm install
```

3. Eine `.env.local` Datei im Wurzelverzeichnis erstellen und die Supabase-Verbindungsdaten eintragen:

```
NEXT_PUBLIC_SUPABASE_URL=https://deine-supabase-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dein-supabase-anon-key
```

### Supabase-Datenbank einrichten

In deinem Supabase-Projekt musst du folgende Tabellen erstellen:

1. `users` Tabelle:

   - `id` (UUID, generiert)
   - `created_at` (Timestamp)
   - `name` (Text)
   - `is_admin` (Boolean)

2. `countries` Tabelle:

   - `id` (Integer)
   - `name` (Text)
   - `flag_code` (Text)

3. `predictions` Tabelle:

   - `id` (Integer, generiert)
   - `created_at` (Timestamp)
   - `user_id` (UUID, Fremdschlüssel zu users.id)
   - `country_id` (Integer, Fremdschlüssel zu countries.id)
   - `position` (Integer)

4. `results` Tabelle:
   - `id` (Integer, generiert)
   - `country_id` (Integer, Fremdschlüssel zu countries.id)
   - `position` (Integer)

Nach dem Erstellen der Tabellen kannst du die Länder aus der `countries.ts` Datei in die Datenbank importieren.

### Entwicklungsserver starten

```bash
npm run dev
```

Die App ist dann unter http://localhost:3000 verfügbar.

## Nutzung

- Jeder Benutzer kann sich einfach mit einem Namen anmelden
- Ein Benutzer mit dem Namen "Admin" erhält automatisch Admin-Rechte
- Normale Benutzer können ihre Vorhersagen für die Platzierungen abgeben und die Tipps anderer einsehen
- Der Admin kann die tatsächlichen Ergebnisse eintragen
- Nach Eintragung der Ergebnisse wird eine Rangliste mit den Punkten aller Teilnehmer angezeigt

## Punktesystem

- Exakte Position: 12 Punkte
- 1 Position daneben: 10 Punkte
- 2 Positionen daneben: 8 Punkte
- 3 Positionen daneben: 6 Punkte
- 4 Positionen daneben: 4 Punkte
- 5 Positionen daneben: 2 Punkte
- 6+ Positionen daneben: 0 Punkte
