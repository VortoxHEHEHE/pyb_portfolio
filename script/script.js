/* =========================================
   GESTION DU MENU BURGER (MOBILE)
   ========================================= */
const menuToggle = document.getElementById('mobile-menu');
const navList = document.getElementById('nav-list');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navList.classList.toggle('active');
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