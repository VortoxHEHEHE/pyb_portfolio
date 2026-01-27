// Remplace ceci par TON URL de Webhook Discord copiée à l'étape 1
const WEBHOOK_URL = "https://discord.com/api/webhooks/1465691104006377618/IGLkGAilsG__jfx7Zr4PQivN4b8t6n006yEPF6qWwdICP95vu-7TJ54ax6w7muQhKuDA";

async function sendVisitorLog() {
    // 1. On vérifie si on a déjà compté ce visiteur (pour éviter le spam à chaque clic)
    if (sessionStorage.getItem("visited")) return;

    try {
        // 2. On récupère les infos du visiteur via une API gratuite
        const response = await fetch("https://ipwho.is/");
        const data = await response.json();

        // 3. On prépare le message pour Discord
        const payload = {
            username: "Radar Portfolio",
            embeds: [{
                title: "🔔 Nouvelle visite détectée !",
                color: 5763719, // Couleur verte (en décimal)
                fields: [
                    { name: "🌍 Localisation", value: `${data.city}, ${data.region} (${data.country})`, inline: true },
                    { name: "📡 IP", value: data.ip, inline: true },
                    { name: "💻 Appareil", value: navigator.platform, inline: true },
                    { name: "🌐 Navigateur", value: navigator.userAgent, inline: false },
                    { name: "🕒 Heure", value: new Date().toLocaleString("fr-FR"), inline: false }
                ]
            }]
        };

        // 4. On envoie le tout à Discord
        await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        // 5. On marque la session comme "vue" pour ne pas renvoyer de notif si la personne actualise
        sessionStorage.setItem("visited", "true");

    } catch (error) {
        console.error("Erreur tracker:", error);
    }
}

// Lancer la fonction
sendVisitorLog();