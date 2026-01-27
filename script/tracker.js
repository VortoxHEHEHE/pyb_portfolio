// Remplace par TON URL Webhook
const WEBHOOK_URL = "https://discord.com/api/webhooks/1465691104006377618/IGLkGAilsG__jfx7Zr4PQivN4b8t6n006yEPF6qWwdICP95vu-7TJ54ax6w7muQhKuDA";

async function sendVisitorLog() {
    if (sessionStorage.getItem("visited")) return;

    try {
        const response = await fetch("https://ipwho.is/");
        const data = await response.json();

        // Récupération de la provenance (Referrer)
        let referrer = document.referrer;
        if (!referrer) {
            referrer = "Accès direct / CV Papier / Favori";
        } else {
            // On nettoie l'URL pour que ce soit plus lisible
            if (referrer.includes("linkedin.com")) referrer = "🔵 LinkedIn";
            if (referrer.includes("instagram.com")) referrer = "📸 Instagram";
            if (referrer.includes("github.com")) referrer = "🐙 GitHub";
        }

        // Construction du message Discord
        const payload = {
            username: "Radar Portfolio",
            avatar_url: "https://cdn-icons-png.flaticon.com/512/3063/3063176.png", // Petite icône radar
            embeds: [{
                title: "🚨 Nouvelle visite détectée !",
                color: 3066993, // Couleur Vert Matrix
                description: `Quelqu'un regarde ton portfolio depuis **${data.city}** !`,
                fields: [
                    { 
                        name: "🏢 Entreprise / FAI", 
                        value: `**${data.connection.isp}**\n*Org: ${data.connection.org || 'N/A'}*`, 
                        inline: false 
                    },
                    { 
                        name: "🌍 Localisation", 
                        value: `${data.city}, ${data.region} ${data.flag.emoji}`, 
                        inline: true 
                    },
                    { 
                        name: "🔗 Provenance", 
                        value: referrer, 
                        inline: true 
                    },
                    { 
                        name: "📡 IP", 
                        value: `\`${data.ip}\``, 
                        inline: true 
                    },
                    { 
                        name: "💻 Système", 
                        value: `${navigator.platform}`, 
                        inline: true 
                    },
                    { 
                        name: "📏 Écran", 
                        value: `${screen.width}x${screen.height} px`, 
                        inline: true 
                    },
                    { 
                        name: "🗺️ Carte", 
                        value: `[Voir sur Google Maps](https://www.google.com/maps?q=${data.latitude},${data.longitude})`, 
                        inline: false 
                    }
                ],
                footer: {
                    text: `Mapsur : ${getBrowserName()} • ${new Date().toLocaleString("fr-FR")}`
                }
            }]
        };

        await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        sessionStorage.setItem("visited", "true");

    } catch (error) {
        console.error("Erreur tracker:", error);
    }
}

// Petite fonction pour rendre le nom du navigateur plus propre
function getBrowserName() {
    const agent = navigator.userAgent;
    if (agent.includes("Chrome")) return "Chrome / Edge";
    if (agent.includes("Firefox")) return "Firefox";
    if (agent.includes("Safari")) return "Safari";
    return "Autre";
}

sendVisitorLog();