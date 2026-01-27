// --- CONFIGURATION ---
// ⚠️ REMPLACE CECI PAR TA VRAIE URL DISCORD !
const WEBHOOK_URL = "https://discord.com/api/webhooks/1465691104006377618/IGLkGAilsG__jfx7Zr4PQivN4b8t6n006yEPF6qWwdICP95vu-7TJ54ax6w7muQhKuDA";

// --- FONCTIONS UTILITAIRES ---
function getBrowser() {
    const userAgent = navigator.userAgent;
    if (userAgent.includes("Edg")) return "Edge (Microsoft)";
    if (userAgent.includes("Chrome")) return "Chrome (Google)";
    if (userAgent.includes("Firefox")) return "Firefox (Mozilla)";
    if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) return "Safari (Apple)";
    return "Autre / Bot";
}

function getHardwareInfo() {
    const cores = navigator.hardwareConcurrency || "?";
    const ram = navigator.deviceMemory ? `~${navigator.deviceMemory} Go` : "?";
    return `CPU: ${cores} Cœurs | RAM: ${ram}`;
}

// Fonction pour récupérer la 4G/Wifi (Marche surtout sur Chrome/Edge/Android)
function getConnectionInfo() {
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    return conn ? `${conn.effectiveType.toUpperCase()} (${conn.rtt}ms)` : "Non détecté";
}

async function getBatteryInfo() {
    if (navigator.getBattery) {
        try {
            const battery = await navigator.getBattery();
            const level = Math.round(battery.level * 100);
            return `${level}% ${battery.charging ? "⚡" : "🔋"}`;
        } catch (e) { return "Non supporté"; }
    }
    return "Non supporté";
}

// --- FONCTION PRINCIPALE ---
async function sendVisitorLog() {
    // ❌ Anti-spam désactivé pour tes tests (réactive-le plus tard si tu veux)
    // if (sessionStorage.getItem("visited")) return;

    console.log("🚀 Démarrage du tracker...");

    try {
        // 1. Appel API IP
        const response = await fetch("https://ipwho.is/");
        if (!response.ok) throw new Error("Erreur API IP");
        const data = await response.json();
        
        // 2. Données techniques
        const battery = await getBatteryInfo();
        const connection = getConnectionInfo(); // On récupère l'info ici
        const hardware = getHardwareInfo();
        const browser = getBrowser();

        // 3. Provenance
        let referrer = document.referrer || "Accès direct";
        if (referrer.includes("linkedin")) referrer = "🔵 LinkedIn";

        // 4. Message Discord
        const payload = {
            username: "SISR Tracker",
            avatar_url: "https://cdn-icons-png.flaticon.com/512/3209/3209074.png",
            embeds: [{
                title: "📡 Visite détectée !",
                color: 65280, // Vert
                fields: [
                    { name: "🏢 FAI", value: data.connection.isp || "Inconnu", inline: false },
                    { name: "📍 Localisation", value: `${data.city} (${data.country})`, inline: true },
                    { name: "📡 IP", value: data.ip, inline: true },
                    
                    // --- AJOUT DE L'INFO RÉSEAU ICI ---
                    { name: "📶 Réseau", value: connection, inline: true },
                    
                    { name: "🔋 Batterie", value: battery, inline: true },
                    { name: "💻 Matériel", value: hardware, inline: true },
                    { name: "🌐 Navigateur", value: browser, inline: true },
                    { name: "🗺️ Carte", value: `[Voir sur Maps](https://www.google.com/maps?q=${data.latitude},${data.longitude})`, inline: false }
                ],
                footer: { text: new Date().toLocaleString() }
            }]
        };

        // 5. Envoi
        const discordResponse = await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (discordResponse.ok) {
            console.log("✅ Notification Discord envoyée !");
            // sessionStorage.setItem("visited", "true"); // À décommenter plus tard
        } else {
            console.error("❌ Erreur Discord :", discordResponse.status);
        }

    } catch (error) {
        console.error("❌ Erreur Tracker :", error);
    }
}

sendVisitorLog();