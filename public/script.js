const tableBody = document.getElementById("tableBody");
const searchInput = document.getElementById("searchInput");

// Node.js-Server-URL
const SERVER_URL = "http://localhost:3000";

async function loadMetadata() {
    try {
        const response = await fetch(`${SERVER_URL}/files`);
        const files = await response.json();

        tableBody.innerHTML = ""; // Lösche bestehende Tabelle

        // Lade und zeige alle Dateien
        for (const filename of files) {
            const row = document.createElement("tr");
            row.className = "text-center";

            // Inhalte einer Datei abrufen
            const fileData = await fetch(`${SERVER_URL}/metadata/${filename}`).then((res) =>
                res.ok ? res.json() : null
            );

            if (fileData) {
                row.innerHTML = `
                    <td><img src="/images/${filename.replace(".json", ".png")}" alt="Bild" width="80"></td>
                    <td>${fileData.name || "-"}</td>
                `;

                row.onclick = () => openModal(filename, fileData);
                tableBody.appendChild(row);
            }
        }
    } catch (error) {
        console.error("Fehler beim Laden der Dateien:", error);
    }
}

// Öffne eine Datei im Modal
function openModal(filename, fileData) {
    const modalTitle = document.getElementById("modalTitle");
    const modalDesc = document.getElementById("modalDesc");
    const modalImg = document.getElementById("modalImg");
    const attrList = document.getElementById("attrList");

    // Titel mit Kopierfunktion
    modalTitle.innerHTML = fileData.name || "Unbekannt";

    const copyTitleIcon = document.createElement("span");
    copyTitleIcon.className = "copy-icon";
    copyTitleIcon.textContent = "📋";
    copyTitleIcon.style.cursor = "pointer";
    copyTitleIcon.addEventListener("click", () => copyText(fileData.name));
    modalTitle.appendChild(copyTitleIcon);

    // Beschreibung mit Kopierfunktion
    modalDesc.textContent = fileData.description || "Keine Beschreibung vorhanden";

    const copyDescIcon = document.createElement("span");
    copyDescIcon.className = "copy-icon";
    copyDescIcon.textContent = "📋";
    copyDescIcon.style.cursor = "pointer";
    copyDescIcon.addEventListener("click", () => copyText(fileData.description));
    modalDesc.appendChild(copyDescIcon);

    // Bild
    modalImg.src = `/images/${filename.replace(".json", ".png")}`;
    modalImg.alt = fileData.name || "NFT Bild";

    // Attribute
    attrList.innerHTML = "";
    if (fileData.attributes) {
        fileData.attributes.forEach((attr) => {
            const li = document.createElement("li");
            li.className = "list-group-item bg-dark text-light";
            li.innerHTML = `<strong>${attr.trait_type}</strong>`;

            // Kopier-Icon für `trait_type`
            const copyTraitIcon = document.createElement("span");
            copyTraitIcon.className = "copy-icon ms-2";
            copyTraitIcon.textContent = "📋";
            copyTraitIcon.style.cursor = "pointer";
            copyTraitIcon.addEventListener("click", () => copyText(attr.trait_type));
            li.appendChild(copyTraitIcon);

            li.appendChild(document.createTextNode(`: ${attr.value}`));
            // Kopier-Icon für `value`
            const copyValueIcon = document.createElement("span");
            copyValueIcon.className = "copy-icon ms-2";
            copyValueIcon.textContent = "📋";
            copyValueIcon.style.cursor = "pointer";
            copyValueIcon.addEventListener("click", () => copyText(attr.value));
            li.appendChild(copyValueIcon);

            attrList.appendChild(li);
        });
    }

    const doneButton = document.getElementById("doneButton");
    doneButton.onclick = async () => {
        fileData.done = true;
        await fetch(`${SERVER_URL}/update`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filename, data: fileData }),
        });
        loadMetadata();
        bootstrap.Modal.getInstance(document.getElementById("detailModal")).hide();
    };

    bootstrap.Modal.getOrCreateInstance(document.getElementById("detailModal")).show();
}

function copyText(text) {
    if (!text) {
        console.error("Kein Text zum Kopieren vorhanden.");
        return;
    }

    navigator.clipboard.writeText(text).then(() => {
        console.log(`"${text}" wurde in die Zwischenablage kopiert!`);
    }).catch(err => {
        console.error("Fehler beim Kopieren:", err);
    });
}

// Filtert die Tabelle basierend auf Suchkriterien
searchInput.addEventListener("input", () => {
    const filter = searchInput.value.toLowerCase();
    Array.from(tableBody.children).forEach((row) => {
        const filename = row.children[1].textContent.toLowerCase();
        row.style.display = filename.includes(filter) ? "" : "none";
    });
});

// Initialisierung
document.addEventListener("DOMContentLoaded", () => {
    loadMetadata();
});
