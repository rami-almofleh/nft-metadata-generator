# **NFT Metadata Generator**
Dieses Projekt wurde entwickelt, um Metadaten für erstellte PNG-Bilder automatisch zu generieren, die anschließend direkt auf Marktplätzen wie OpenSea verwendet werden können. Mit dieser App kannst du datenreiche JSON-Dateien einfach generieren, bearbeiten und verwalten – perfekt für die Erstellung von NFTs.
## **Inhaltsverzeichnis**
1. [Einführung in die App](#einf%C3%BChrung-in-die-app)
2. [Voraussetzungen](#voraussetzungen)
3. [Schritt 1: Metadaten mit ](#schritt-1-metadaten-mit-generatemetadatajs-generieren)`generateMetadata.js` generieren
4. [Schritt 2: Server starten](#schritt-2-server-starten)
5. [Schritt 3: Nutzung der App](#schritt-3-nutzung-der-app)
6. [Erklärung der Funktionalitäten](#erkl%C3%A4rung-der-funktionalit%C3%A4ten)
    - Warum auf "Erledigt" klicken wichtig ist

7. [Beispiel für die Struktur](#beispiel-f%C3%BCr-die-struktur)

## **Einführung in die App**
Die **NFT Metadata Generator**-Anwendung hilft dir, Metadaten für deine PNG-Bilder zu generieren und diese Bilder als NFTs auf Plattformen wie OpenSea zu verwenden, ohne mühsam manuell Metadaten zu erstellen.
### **Ziele**:
- Automatische Generierung von Metadaten basierend auf visuellen Merkmalen der PNG-Bilder mithilfe von künstlicher Intelligenz.
- Übersichtliche Bearbeitung und Verwaltung von Metadaten über ein benutzerfreundliches Interface.
- Schneller Export und Nutzung der Daten in Marktplätzen wie OpenSea.

## **Voraussetzungen**
Bevor du die App verwenden kannst, stelle sicher, dass folgende Tools und Technologien installiert sind:
- **Node.js** (Version 18 oder höher)
- **npm** (Node Package Manager)
- Ein Ordner mit den PNG-Bildern, die du zu NFTs machen möchtest.

## **Schritt 1: Metadaten mit `generateMetadata.js` generieren**
### **Was ist `generateMetadata.js`?**
Die Datei `generateMetadata.js` ist ein Skript, das die Metadaten für deine PNG-Bilder erstellt. Es analysiert die visuellen Eigenschaften jedes Bildes (wie Farben, Formen, Größen, etc.) mithilfe von AI und generiert daraus JSON-Dateien mit Attributen, die später als Traits auf NFT-Marktplätzen wie OpenSea verwendet werden können.
### **Warum ist dies der erste Schritt?**
Da die Hauptaufgabe dieser App darin besteht, Metadaten zu erstellen, ist dieser Schritt entscheidend. Ohne diese Metadaten kannst du deine Bilder nicht direkt als NFTs verwenden, da OpenSea spezielle JSON-Metadaten benötigt, um die Traits und Attribute eines NFTs darzustellen.
### **Wie benutzt man `generateMetadata.js`?**
1. **Datei-Verzeichnis vorbereiten:**
    - Erstelle einen Ordner namens `images` in deinem Projektverzeichnis und füge dort alle PNG-Bilder hinzu, die du zu NFTs machen möchtest.

2. **Skript ausführen:**
    - Navigiere im Terminal ins Projektverzeichnis.
    - Führe das Skript mit dem Befehl aus:
``` bash
     node generateMetadata.js
```
1. **Was passiert während der Ausführung?**
    - Das Skript liest jedes Bild im Ordner `images` aus.
    - Es verwendet AI, um visuelle Eigenschaften zu analysieren (z. B. "Creature Type", "Color Scheme", "Season", usw.).
    - Für jedes Bild wird eine JSON-Datei mit den generierten Metadaten im Ordner `metadata` erstellt.
    - **Kommentarhinweis:** Falls der AI-Schritt in deinem Code auskommentiert ist, ist möglicherweise eine zusätzliche AI-API-Konfiguration nötig, um das Feature zu aktivieren.

2. **Ergebnis:**
    - Im Ordner `metadata` werden JSON-Dateien erstellt – für jedes PNG-Bild eine Datei (z. B. `image1.png` → `image1.json`).

## **Schritt 2: Server starten**
### **Warum wird der Server benötigt?**
Der Server dient als Backend für deine App. Er ermöglicht dir:
- Die JSON-Metadaten, die mit `generateMetadata.js` erstellt wurden, zu laden und im Frontend zu bearbeiten.
- Änderungen an den JSON-Dateien zu speichern oder den Status eines Bilds als "Erledigt" zu markieren.

### **Wie startet man den Server?**
1. **Installiere Dependencies:**
    - Führe im Projektordner den Befehl aus:
``` bash
     npm install
```
1. **Starte den Server:**
    - Führe den Server mit dem Befehl aus:
``` bash
     node server.js
```
1. **Standard-Port:**
    - Dein Server wird auf `http://localhost:3000` laufen. Der Port kann in der Datei `server.js` geändert werden.

2. **Testen:**
    - Öffne einen Browser und rufe die Anwendung auf unter:
``` bash
     http://localhost:3000
```
## **Schritt 3: Nutzung der App**
### **Was passiert in der App?**
1. Nach dem Start des Servers werden die generierten JSON-Dateien im Browser als Tabelle angezeigt.
2. Du kannst:
    - Metadaten für jedes Bild ansehen.
    - Attribute „kopieren“, um sie direkt auf OpenSea einzufügen.
    - Den Status eines Bildes als "Erledigt" markieren.

## **Erklärung der Funktionalitäten**
### **Wichtigkeit des Buttons "Erledigt"**
#### **Was passiert, wenn du auf "Erledigt" klickst?**
- Der Status des ausgewählten Bildes wird in der JSON-Datei auf `"done": true` gesetzt.
- Beim nächsten Laden werden alle JSON-Dateien mit `"done": true` aus der Tabelle ausgeblendet, sodass du nur siehst, welche Bilder noch bearbeitet werden müssen.
- Dies ist hilfreich, um die Übersicht zu behalten, wenn du mit vielen Bildern arbeitest.

#### **Warum ist das wichtig?**
NFT-Projekte können viele Bilder umfassen. Durch das Markieren erledigter Bilder als „fertig“ kannst du effizient arbeiten und den Fortschritt einfacher verwalten.
## **Beispiel für die Struktur**
Nach erfolgreicher Nutzung der App sieht dein Projekt wie folgt aus:
``` plaintext
projekt/
├── images/
│   ├── image1.png
│   ├── image2.png
│   └── ...
├── metadata/
│   ├── image1.json
│   ├── image2.json
│   └── ...
├── public/
│   ├── index.html
│   ├── script.js
│   ├── style.css
│   └── ...
├── generateMetadata.js
├── server.js
├── package.json
```
## **Technologien**
- **Node.js**: Backend-Server und JSON-Dateiverwaltung.
- **Bootstrap**: Zur Erstellung eines benutzerfreundlichen Frontends.
- **AI (optional)**: Zur Analyse und Generierung von Metadaten-Traits basierend auf Bildern.

## **Zusammenfassung**
Die NFT Metadata Generator-App vereinfacht den Prozess der Metadatenerstellung für NFTs. Ob du ein kleines Projekt oder eine große NFT-Sammlung verwalten möchtest – diese App hilft dir, deine Metadaten effizient zu generieren, zu bearbeiten und zu organisieren.
