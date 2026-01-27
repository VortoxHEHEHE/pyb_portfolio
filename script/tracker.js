// --- CONFIGURATION ---
const WEBHOOK_URL = "https://discord.com/api/webhooks/TA_SUITE_DE_CHIFFRES/TA_CLE_SECRETE";

// --- FONCTIONS UTILITAIRES ---

// Récupérer le nom du navigateur proprement
function getBrowser() {
    const userAgent = navigator.userAgent;
    if (userAgent.includes("Edg")) return "Edge (Microsoft)";
    if (userAgent.includes("Chrome")) return "Chrome (Google)";
    if (userAgent.includes("Firefox")) return "Firefox (Mozilla)";
    if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) return "Safari (Apple)";
    return "Autre / Bot";
}

// Récupérer les infos matériel (CPU/RAM)
function getHardwareInfo() {
    const cores = navigator.hardwareConcurrency || "Inconnu";
    const ram = navigator.deviceMemory ? `~${navigator.deviceMemory} Go` : "Inconnu";
    return `CPU: ${cores} Cœurs | RAM: ${ram}`;
}

// Récupérer les infos de connexion (4G/Wifi) - Chrome/Edge uniquement
function getConnectionInfo() {
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conn) {
        return `${conn.effectiveType.toUpperCase()} (Rtt: ${conn.rtt}ms)`;
    }
    return "Non détecté";
}

// Récupérer la batterie (Async)
async function getBatteryInfo() {
    if (navigator.getBattery) {
        try {
            const battery = await navigator.getBattery();
            const level = Math.round(battery.level * 100);
            const charging = battery.charging ? "⚡ En charge" : "🔋 Sur batterie";
            return `${level}% - ${charging}`;
        } catch (e) { return "Non supporté"; }
    }
    return "Non supporté";
}

// --- FONCTION PRINCIPALE ---
async function sendVisitorLog() {
    // Anti-spam session (Commenter cette ligne pour tester à chaque F5)
    if (sessionStorage.getItem("visited")) return;

    try {
        // 1. Appel API IP
        const response = await fetch("https://ipwho.is/");
        const data = await response.json();

        // 2. Récupération des données techniques
        const batteryStatus = await getBatteryInfo();
        const connectionStatus = getConnectionInfo();
        const hardwareStatus = getHardwareInfo();
        const browserName = getBrowser();
        const language = navigator.language.toUpperCase();

        // 3. Gestion du Referrer (D'où vient-il ?)
        let referrer = document.referrer || "Accès direct / Favori";
        if (referrer.includes("linkedin")) referrer = "🔵 LinkedIn";
        if (referrer.includes("google")) referrer = "🔍 Google";

        // 4. Construction du message Discord
        const payload = {
            username: "SISR Tracker",
            avatar_url: "https://cdn-icons-png.flaticon.com/512/3209/3209074.png", // Icone Hacker
            embeds: [{
                title: "📡 Connexion entrante détectée !",
                color: 65280, // Vert Matrix pur (#00FF00)
                description: `Visiteur localisé à **${data.city}** (${data.country})`,
                fields: [
                    { name: "🏢 FAI / Org", value: `\`${data.connection.isp}\`\n${data.connection.org || ''}`, inline: false },
                    { name: "📶 Réseau", value: connectionStatus, inline: true },
                    { name: "🔋 Énergie", value: batteryStatus, inline: true },
                    { name: "🗣️ Langue", value: language, inline: true },
                    { name: "💻 Matériel", value: hardwareStatus, inline: true },
                    { name: "📏 Écran", value: `${screen.width}x${screen.height}`, inline: true },
                    { name: "🔗 Source", value: referrer, inline: true },
                    { name: "🌐 Navigateur", value: browserName, inline: true },
                    { name: "📍 IP", value: `[${data.ip}](https://www.google.com/maps?q=${data.latitude},${data.longitude})`, inline: true }
                ],
                footer: { text: `OS: ${navigator.platform} • ${new Date().toLocaleTimeString()}` }
            }]
        };

        // 5. Envoi
        await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        sessionStorage.setItem("visited", "true");

    } catch (error) {
        console.error("Tracker Error:", error);
    }
}

sendVisitorLog();