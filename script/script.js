/* =========================================
   GESTION DU MENU BURGER (MOBILE)
   ========================================= */
const menuToggle = document.getElementById('mobile-menu');
const navList = document.getElementById('nav-list');

function setMenuOpen(open) {
    navList.classList.toggle('active', open);
    menuToggle.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', open);
    // Empêche la page de défiler derrière le menu plein écran
    document.body.classList.toggle('menu-open', open);
}

if (menuToggle) {
    // Le bouton est une <div> : on le rend accessible au clavier et aux lecteurs d'écran
    menuToggle.setAttribute('role', 'button');
    menuToggle.setAttribute('tabindex', '0');
    menuToggle.setAttribute('aria-label', 'Ouvrir le menu');
    menuToggle.setAttribute('aria-controls', 'nav-list');
    menuToggle.setAttribute('aria-expanded', 'false');

    menuToggle.addEventListener('click', () => {
        setMenuOpen(!navList.classList.contains('active'));
    });

    menuToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setMenuOpen(!navList.classList.contains('active'));
        }
    });

    // Ferme le menu quand on choisit une page ou qu'on appuie sur Échap
    navList.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => setMenuOpen(false));
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navList.classList.contains('active')) setMenuOpen(false);
    });
}

/* =========================================
   GESTION DU LIEN ACTIF (NAVIGATION)
   ========================================= */
// Récupère le nom du fichier actuel (ex: "apropos.html")
// Si l'URL est racine "/", on considère que c'est "index.html"
const currentPage = window.location.pathname.split("/").pop() || "index.html";
const navLinks = document.querySelectorAll('nav a');

navLinks.forEach(link => {
    // Si l'attribut href du lien correspond à la page actuelle
    if (link.getAttribute('href') === currentPage) {
        link.classList.add('active-link');
    }
});

/* =========================================
   EFFET DE NAVIGATION AU SCROLL
   ========================================= */
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (nav) {
        if (window.scrollY > 50) {
            nav.classList.add('nav-scrolled');
        } else {
            nav.classList.remove('nav-scrolled');
        }
    }
});

/* =========================================
   ANIMATIONS D'APPARITION (SCROLL)
   ========================================= */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            
            // Ajoute un petit délai incrémental pour les logos (effet cascade)
            if (entry.target.classList.contains('logo-item')) {
                entry.target.style.transitionDelay = `${index * 80}ms`; 
            }

            // Ajoute la classe qui déclenche l'animation CSS
            entry.target.classList.add('is-visible');
            
            // Arrête d'observer l'élément une fois animé
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// On cible les éléments à animer
document.querySelectorAll('.timeline-item, .diploma-card, .logo-item, .spec-block').forEach(el => {
    observer.observe(el);
});

document.addEventListener("DOMContentLoaded", function() {
    // On récupère l'adresse URL de la page actuelle
    const currentLocation = location.href;
    
    // On récupère tous les liens du menu
    const menuItems = document.querySelectorAll('nav ul li a');
    
    // On vérifie chaque lien
    menuItems.forEach(item => {
        // Si le lien correspond à la page actuelle
        if(item.href === currentLocation) {
            // On ajoute la classe "active"
            item.classList.add('active');
        }
    });
});

/* =========================================
   SYNCHRONISATION DU PROMPTEUR
   ========================================= */
// Récupère le chemin de la page actuelle (ex: "/pages/apropos.html" ou "/")
const pagePath = window.location.pathname;

// Sauvegarde l'info dans la mémoire du navigateur (localStorage)
localStorage.setItem('portfolioPage', pagePath);

// On ajoute un timestamp (l'heure exacte) pour forcer le navigateur 
// à envoyer un signal même si on recharge la même page
localStorage.setItem('portfolioTrigger', Date.now());

/* =========================================
   EFFETS D'INTERFACE
   ========================================= */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* --- Commande du terminal tapée au chargement de la page --- */
const terminalCommand = document.querySelector('.terminal-title .command');
if (terminalCommand && !reduceMotion) {
    const fullText = terminalCommand.textContent;
    terminalCommand.textContent = '';
    let i = 0;
    const typeNext = () => {
        terminalCommand.textContent = fullText.slice(0, ++i);
        if (i < fullText.length) setTimeout(typeNext, 45);
    };
    setTimeout(typeNext, 350);
}

/* --- Barre de progression de lecture sous le menu --- */
const nav = document.querySelector('nav');
let progressBar = null;
if (nav) {
    progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    nav.appendChild(progressBar);
}

/* --- Bouton retour en haut --- */
const backToTop = document.createElement('button');
backToTop.type = 'button';
backToTop.className = 'back-to-top';
backToTop.setAttribute('aria-label', 'Revenir en haut de la page');
backToTop.innerHTML = '<span class="back-to-top-arrow">↑</span><span class="back-to-top-label">cd ~</span>';
backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
});
document.body.appendChild(backToTop);

function updateScrollUI() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar) progressBar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    backToTop.classList.toggle('visible', window.scrollY > 500);
}
window.addEventListener('scroll', updateScrollUI, { passive: true });
window.addEventListener('resize', updateScrollUI);
updateScrollUI();

/* --- Halo lumineux qui suit la souris sur les cartes (ordinateur uniquement) --- */
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const spotlightCards = document.querySelectorAll(
        '.holographic-card, .glass-card, .method-step, .tool-card, .timeline-item, .spec-block, .comp-item'
    );
    spotlightCards.forEach(card => {
        card.classList.add('spotlight');
        card.addEventListener('pointermove', (e) => {
            const r = card.getBoundingClientRect();
            card.style.setProperty('--mx', `${e.clientX - r.left}px`);
            card.style.setProperty('--my', `${e.clientY - r.top}px`);
        });
    });
}
