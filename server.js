const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Verzeichnis für JSON-Dateien
const METADATA_DIR = path.join(__dirname, "metadata");
const IMAGES_DIR = path.join(__dirname, "images");

// Middleware für JSON-Dekodierung
app.use(express.json());
app.use(express.static("public")); // Serviert statische Dateien (Frontend)
app.use('/images', express.static(IMAGES_DIR));

// Route: Hole die Liste der Dateien aus dem Ordner
app.get("/files", (req, res) => {
    fs.readdir(METADATA_DIR, (err, files) => {
        if (err) {
            return res.status(500).send("Fehler beim Lesen des Verzeichnisses");
        }

        const jsonFiles = files.filter((file) => file.endsWith(".json"));
        const filteredFiles = [];

        jsonFiles.forEach((file) => {
            const filePath = path.join(METADATA_DIR, file);

            // Dateiinhalt synchron lesen und prüfen
            const fileContent = fs.readFileSync(filePath, "utf-8");
            try {
                const jsonData = JSON.parse(fileContent);
                if (!jsonData.done) {
                    filteredFiles.push(file); // Nur Dateien ohne "done: true" hinzufügen
                }
            } catch (e) {
                console.error(`Ungültiges JSON in Datei ${file}`);
            }
        });

        res.json(filteredFiles);
    });
});

// Route: Hole die Inhalte einer einzelnen Datei
app.get("/metadata/:filename", (req, res) => {
    const filename = req.params.filename;

    const filePath = path.join(METADATA_DIR, filename);

    // Datei existiert nicht
    if (!fs.existsSync(filePath)) {
        return res.status(404).send("Datei nicht gefunden");
    }

    // Datei lesen
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).send("Fehler beim Lesen der Datei");
        }

        try {
            const jsonData = JSON.parse(data);
            res.json(jsonData);
        } catch (e) {
            res.status(500).send("Ungültiges JSON-Format");
        }
    });
});

// Route: Überschreibe eine Datei mit neuen Daten
app.post("/update", (req, res) => {
    const { filename, data } = req.body;

    if (!filename || !data) {
        return res.status(400).send("Dateiname und Daten müssen angegeben werden");
    }

    const filePath = path.join(METADATA_DIR, filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).send("Datei nicht gefunden");
    }

    fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
        if (err) {
            return res.status(500).send("Fehler beim Überschreiben der Datei");
        }

        res.send("Datei erfolgreich aktualisiert!");
    });
});


// Server starten
app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});
