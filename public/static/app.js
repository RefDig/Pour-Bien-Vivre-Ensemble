// Fonctionnalités JavaScript pour Pour Bien Vivre Ensemble

// Toggle Mobile Menu
function toggleMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenu) {
    mobileMenu.classList.toggle('hidden');
  }
}

// Installation PWA
let deferredPrompt;

// Écouter l'événement beforeinstallprompt
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showInstallButton();
});

function showInstallButton() {
  // Créer un bouton d'installation si pas déjà présent
  if (!document.getElementById('install-button')) {
    const installButton = document.createElement('button');
    installButton.id = 'install-button';
    installButton.innerHTML = '<i class="fas fa-download mr-2"></i>Installer l\'app';
    installButton.className = 'fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors z-50';
    installButton.onclick = installApp;
    document.body.appendChild(installButton);
  }
}

function installApp() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('PWA installée');
      }
      deferredPrompt = null;
      hideInstallButton();
    });
  }
}

function hideInstallButton() {
  const installButton = document.getElementById('install-button');
  if (installButton) {
    installButton.remove();
  }
}

// Masquer le bouton si l'app est déjà installée
window.addEventListener('appinstalled', () => {
  hideInstallButton();
});

// Smooth scroll pour les liens internes
document.addEventListener('DOMContentLoaded', () => {
  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Animation des cartes au scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in-up');
      }
    });
  }, observerOptions);

  // Observer les éléments à animer
  document.querySelectorAll('.bg-white.rounded-xl, .bg-gradient-to-br').forEach(el => {
    observer.observe(el);
  });
});

// Gestion du formulaire de contact
function handleContactForm(event) {
  event.preventDefault();
  
  // Récupérer les données du formulaire
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);
  
  // Simulation d'envoi (dans une vraie app, utiliser une API)
  console.log('Données du formulaire:', data);
  
  // Afficher un message de confirmation
  const button = event.target.querySelector('button[type="submit"]');
  const originalText = button.innerHTML;
  
  button.innerHTML = '<i class="fas fa-check mr-2"></i>Message envoyé !';
  button.classList.remove('bg-teal-600', 'hover:bg-teal-700');
  button.classList.add('bg-green-600');
  button.disabled = true;
  
  // Réinitialiser le formulaire après 3 secondes
  setTimeout(() => {
    button.innerHTML = originalText;
    button.classList.remove('bg-green-600');
    button.classList.add('bg-teal-600', 'hover:bg-teal-700');
    button.disabled = false;
    event.target.reset();
  }, 3000);
}

// Service Worker pour les fonctionnalités offline
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/static/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}