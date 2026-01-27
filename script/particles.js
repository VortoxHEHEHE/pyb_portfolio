const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

let particlesArray;

// Réglages (Tu peux modifier ces valeurs !)
const numberOfParticles = 80; // Nombre de points
const connectionDistance = 120; // Distance pour tracer les lignes
const particleSpeed = 0.5; // Vitesse de déplacement
const particleColor = 'rgba(0, 255, 0, 0.8)'; // Couleur des points (Vert)
const lineColor = 'rgba(0, 255, 0,'; // Couleur des lignes (sans l'opacité)

// Adapter la taille du canvas à l'écran
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Gestion de la souris
let mouse = {
    x: null,
    y: null,
    radius: 150 // Rayon d'interaction autour de la souris
}

window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

// Création de la classe Particule
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    // Dessiner le point
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    // Mettre à jour la position
    update() {
        // Rebondir sur les bords
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        // Interaction avec la souris (les points fuient ou sont attirés ?)
        // Ici, on laisse juste le mouvement naturel
        
        // Déplacement
        this.x += this.directionX;
        this.y += this.directionY;

        this.draw();
    }
}

// Initialiser les particules
function init() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 1; // Taille aléatoire
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 2) - 1; // Vitesse X
        let directionY = (Math.random() * 2) - 1; // Vitesse Y
        let color = particleColor;

        particlesArray.push(new Particle(x, y, directionX * particleSpeed, directionY * particleSpeed, size, color));
    }
}

// Animation (boucle infini)
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

// Dessiner les lignes entre les points proches
function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + 
                           ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            
            // Lignes entre les particules
            if (distance < (connectionDistance * connectionDistance)) {
                opacityValue = 1 - (distance / 15000);
                ctx.strokeStyle = lineColor + opacityValue + ')';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
        
        // Lignes entre la souris et les particules (Effet interactif)
        let dx = mouse.x - particlesArray[a].x;
        let dy = mouse.y - particlesArray[a].y;
        let mouseDistance = (dx*dx) + (dy*dy);
        
        if (mouseDistance < (mouse.radius * mouse.radius)) {
             // Si la souris est proche, on dessine une ligne plus forte
            ctx.strokeStyle = lineColor + '0.5)'; // Opacité fixe pour la souris
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }
    }
}

// Gérer le redimensionnement de la fenêtre
window.addEventListener('resize', function() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    init();
});

// Lancer le script
init();
animate();

// Reset la position de la souris quand elle sort de l'écran
window.addEventListener('mouseout', function(){
    mouse.x = undefined;
    mouse.y = undefined;
});
