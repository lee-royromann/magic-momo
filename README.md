# Magic Momo & More

<p align="center">
  <img src="assets/img/magic-momo.webp" alt="Magic Momo & More Foodtruck" width="960">
</p>

Magic Momo & More ist die offizielle Website des Foodtrucks von Jigme Losal Ngathak im Kanton Zürich. Die Seite präsentiert tibetische Momos und asiatische Spezialitäten und führt Besucherinnen und Besucher schnell zu Angebot, Kontaktmöglichkeiten und rechtlichen Informationen.

Das Projekt ist als schlanke statische Website umgesetzt. Im Fokus stehen eine klare mobile Nutzung, schnelle Ladezeiten, optimierte WebP-Bilder und eine saubere Struktur für Suchmaschinen und Gäste.

## Inhalt

Die Website umfasst eine Startseite mit Foodtruck-Vorstellung, Menü, Story und Kontaktbereich. Ergänzt wird sie durch eigenständige Seiten für Impressum, Datenschutz sowie Herkunft und Allergene.

## Technik

Die technische Basis besteht aus HTML, CSS und JavaScript. Das Projekt verwendet keine Build-Pipeline und kann direkt lokal geöffnet oder auf klassischem Webhosting bereitgestellt werden.

## Projektstruktur

Die Hauptseite liegt in index.html. styles.css bindet die CSS-Module aus dem Ordner css ein, scripts.js steuert Navigation und Interaktionen. Im Ordner assets liegen Logo, Favicon, Bilder und die selbst gehosteten Schriften (Figtree und Fraunces, SIL Open Font License). Der Ordner views enthält die rechtlichen Unterseiten.

## Deploy

CSS und JavaScript werden mit einem Versionsparameter eingebunden (zum Beispiel `styles.css?v=20261031`). Nach jeder Änderung an CSS oder JavaScript den Wert in index.html, views/*.html, 404.html und styles.css auf das neue Datum setzen, damit Besucher nicht die alte Version aus dem Browser-Cache sehen.

Zum Hochladen im Projektordner `./build-dist.sh` ausführen. Das Skript legt im Ordner `dist/` genau die Dateien für den Webserver ab. Den Inhalt von `dist/` ins Hauptverzeichnis des Webservers laden und dort nichts löschen.

## Live-Website

https://magic-momo.ch/
