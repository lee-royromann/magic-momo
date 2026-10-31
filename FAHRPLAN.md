# Fahrplan (geparkt)

Dieser Branch enthält den Wochen-Fahrplan mit der Heute-Zeile im Hero. Er ist noch nicht live, weil die echten Standorte fehlen.

## Reaktivieren

1. Branch auf den aktuellen Stand bringen: `git checkout feature/fahrplan && git rebase main`
2. In `data/fahrplan.json` die echten Daten eintragen:
   - `plaetze`: Name, Hinweis und Koordinaten (lat, lng) pro Standplatz
   - `woche`: pro Tag die Einsätze mit `von`, `bis` und `platz`
   - `ausnahmen`: Ausfälle oder Sondereinsätze mit Datum
3. `"beispiel": false` setzen, damit der Hinweis auf Beispieldaten verschwindet.
4. Lokal prüfen: `python3 -m http.server 8000`, dann http://127.0.0.1:8000 öffnen.
   Mit `?jetzt=2026-11-02T12:00` lässt sich ein beliebiger Zeitpunkt testen.
5. Pull Request auf `main` öffnen, mergen, deployen.

Danach reicht es, nur noch `data/fahrplan.json` anzupassen.
