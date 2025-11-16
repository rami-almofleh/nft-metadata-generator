import fs from 'fs';
import path from 'path';
import ollama from 'ollama';

const imagesDir = 'images';
const metadataDir = 'metadata';

if (!fs.existsSync(metadataDir)) fs.mkdirSync(metadataDir);

async function processImage(imgPath) {
    const prompt = `Extract the traits (properties) from the image with maximum accuracy, without any additional text.
                    Provide a sorted JSON containing only the following:
                    [
                      {
                        "trait_type": "TraitName",
                        "value": "TraitValue"
                      }
                    ]`;

    const result = await ollama.generate({
        model: 'llava',
        prompt,
        images: [fs.readFileSync(imgPath)]
    });

    let traitsJSON;
    try {
        // Try to extract and parse JSON
        traitsJSON = JSON.parse(extractJsonArray(result.response));
    } catch (e) {
        console.error("Error parsing JSON:", e.message);
        console.error("AI Output:", result.response);
        return;
    }

    // Get the image name without ".png"
    const imageName = path.parse(imgPath).name;

    // Assemble metadata
    const metadata = {
        name: imageName, // Image name without extension
        description: `This NFT is generated based on the distinctive visual traits of the image "${imageName}". It includes key attributes such as ${traitsJSON.map(trait => `"${trait.trait_type}"`).join(', ')}.`,
        image: `ipfs://YOUR_CID/${path.basename(imgPath)}`,
        attributes: traitsJSON
    };

    // Save metadata to a file
    fs.writeFileSync(
        `${metadataDir}/${imageName}.json`,
        JSON.stringify(metadata, null, 2)
    );

    console.log(`Created metadata for ${imgPath}`);
}

function extractJsonArray(text) {
    // Suche nach dem ersten '[' und dem letzten ']'
    const start = text.indexOf('[');
    const end = text.lastIndexOf(']');

    // Wenn kein JSON-Array gefunden wurde
    if (start === -1 || end === -1 || end <= start) {
        throw new Error("Kein gültiges JSON-Array im Text gefunden!");
    }

    // Schneide den JSON-Teil aus
    const jsonStr = text.substring(start, end + 1);

    try {
        // Stelle sicher, dass es ein valides JSON ist
        JSON.parse(jsonStr);
        return jsonStr; // Gib den extrahierten JSON-String zurück
    } catch (err) {
        console.error("JSON-Parsing fehlgeschlagen:", jsonStr);
        throw new Error(`Ungültiges JSON: ${jsonStr}`);
    }
}

function getMissingMetadataFiles(imagesDir, metadataDir) {
    // Lese die Liste der Bilddateien im imagesDir (nur Dateien mit .png)
    const imageFiles = fs.readdirSync(imagesDir)
        .filter(file => path.extname(file).toLowerCase() === '.png')
        .map(file => path.parse(file).name); // Nur der Dateiname ohne Extension

    // Lese die Liste der Metadatendateien im metadataDir (nur Dateien mit .json)
    const metadataFiles = fs.readdirSync(metadataDir)
        .filter(file => path.extname(file).toLowerCase() === '.json')
        .map(file => path.parse(file).name); // Nur der Dateiname ohne Extension

    // Liste der fehlenden Metadateien erstellen
    return imageFiles.filter(imageName => !metadataFiles.includes(imageName));
}


async function main() {
    const files = fs.readdirSync(imagesDir);

    for (let i = 0; i < files.length; i++) {
        if (['Fey-Warden.png'].includes(files[i])) {
            console.log(`Processing ${files[i]}... Nro: ${i + 1} of ${files.length}`);
            const full = path.join(imagesDir, files[i]);
            await processImage(full);
        }
    }

    console.log("Done!");
}

/*const missingMetadataFiles = getMissingMetadataFiles(imagesDir, metadataDir);

if (missingMetadataFiles.length > 0) {
    console.log('Missing metadata files for the following images:');
    console.log(missingMetadataFiles);
} else {
    console.log('All images have corresponding metadata!');
}*/

// main()
