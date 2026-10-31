#!/bin/sh
# Stellt im Ordner dist/ genau die Dateien zusammen, die auf den Webserver gehoeren.
# Aufruf im Projektordner: ./build-dist.sh
set -e

cd "$(dirname "$0")"

FILES="index.html 404.html favicon.ico styles.css scripts.js sitemap.xml robots.txt .htaccess"
FOLDERS="css views assets"

branch=$(git branch --show-current 2>/dev/null || echo "?")
if [ "$branch" != "main" ]; then
    echo "Hinweis: Du bist auf dem Branch '$branch', nicht auf main."
fi

for item in $FILES $FOLDERS; do
    if [ ! -e "$item" ]; then
        echo "Fehler: $item fehlt. Abbruch."
        exit 1
    fi
done

rm -rf dist
mkdir dist
cp $FILES dist/
for folder in $FOLDERS; do
    cp -R "$folder" dist/
done
find dist -name '.DS_Store' -delete

count=$(find dist -type f | wc -l | tr -d ' ')
size=$(du -sh dist | cut -f1)
echo "Fertig: $count Dateien ($size) in dist/."
echo "Lade den Inhalt von dist/ in das Hauptverzeichnis des Webservers. Auf dem Server nichts loeschen."
