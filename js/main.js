/* 
 * Nørva Car Detailing - Interactive Scripts
 * Handles navigation, mobile menu, service filtering tabs, FAQ accordions, 
 * form validation, and pre-filled WhatsApp booking links.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initServiceTabs();
  initFaqAccordion();
  initContactForm();
  initScrollAnimations();
});

/* --- 1. NAVIGATION LOGIC --- */
function initNavigation() {
  const header = document.querySelector('.header');
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close mobile menu on nav link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });
}

/* --- 2. SERVICE TAB FILTERING --- */
function initServiceTabs() {
  const tabs = document.querySelectorAll('.service-tab');
  const cards = document.querySelectorAll('.pricing-card');
  const pricingSection = document.querySelector('#prijzen');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const filter = tab.getAttribute('data-tab');

      // Update active tab styling
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Filter cards
      cards.forEach(card => {
        const categories = card.getAttribute('data-categories').split(' ');
        
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          // Force a slight reflow for animation
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Filter pricing cards on initial load based on active tab
  const activeTab = document.querySelector('.service-tab.active');
  if (activeTab) {
    const filter = activeTab.getAttribute('data-tab');
    cards.forEach(card => {
      const categories = card.getAttribute('data-categories').split(' ');
      if (filter === 'all' || categories.includes(filter)) {
        card.style.display = 'flex';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      } else {
        card.style.display = 'none';
      }
    });
  }
}

/* --- 3. FAQ ACCORDION --- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const body = item.querySelector('.faq-body');

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items first (accordion style)
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-body').style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        // Set height dynamically based on scrollHeight
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
}

/* --- 4. CONTACT & BOOKING FORM LOGIC --- */
function initContactForm() {
  const form = document.getElementById('booking-form');
  const successMsg = document.getElementById('form-success');
  const errorMsg = document.getElementById('form-error');
  
  const whatsappBtn = document.getElementById('btn-whatsapp-submit');
  const instagramBtn = document.getElementById('btn-instagram-submit');
  
  // Custom contact info - change these values if needed
  const phone = '32470123456'; // Belgium phone format
  const instagramHandle = 'norvadetailing';

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Basic Validation
      const name = document.getElementById('name').value.trim();
      const userPhone = document.getElementById('phone').value.trim();
      const email = document.getElementById('email').value.trim();
      const car = document.getElementById('car').value.trim();
      const packageSelected = document.getElementById('package').value;
      const message = document.getElementById('message').value.trim();

      if (!name || !userPhone || !email || !car || !packageSelected) {
        showResponse(errorMsg, 'Gelieve alle verplichte velden in te vullen.');
        return;
      }

      // Simulate sending booking request
      successMsg.style.display = 'none';
      errorMsg.style.display = 'none';
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Verzenden...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Show success state
        showResponse(successMsg, `Bedankt ${name}! Je aanvraag voor het pakket "${packageSelected}" is ontvangen. We nemen zo snel mogelijk contact met je op.`);
        form.reset();
      }, 1500);
    });
  }

  // Pre-filled WhatsApp message generation on click
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', (e) => {
      const name = document.getElementById('name').value.trim() || '[Naam]';
      const userPhone = document.getElementById('phone').value.trim() || '[Telefoon]';
      const car = document.getElementById('car').value.trim() || '[Merk/Model]';
      const packageSelected = document.getElementById('package').value || '[Geen pakket geselecteerd]';
      const message = document.getElementById('message').value.trim() || '';

      const text = `Hallo Nørva Car Detailing, ik wil graag een detailbeurt boeken:\n\n` +
                   `• Naam: ${name}\n` +
                   `• Telefoon: ${userPhone}\n` +
                   `• Wagen: ${car}\n` +
                   `• Pakket: ${packageSelected}\n` +
                   (message ? `• Opmerking: ${message}` : '');

      const encodedText = encodeURIComponent(text);
      const whatsappUrl = `https://wa.me/${phone}?text=${encodedText}`;
      
      window.open(whatsappUrl, '_blank');
    });
  }

  // Instagram DM Redirect
  if (instagramBtn) {
    instagramBtn.addEventListener('click', () => {
      // Instagram direct message URL structure
      const instagramUrl = `https://instagram.com/${instagramHandle}`;
      window.open(instagramUrl, '_blank');
    });
  }
}

function showResponse(element, message) {
  element.textContent = message;
  element.style.display = 'block';
  element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* --- 5. MICRO-ANIMATIONS (SCROLL REVEAL) --- */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '.pricing-card, .before-after-card, .step-card, .trust-card, .ceramic-benefit, .intro-image-wrapper'
  );

  // Set initial hidden styles
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(25px)';
    el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  animatedElements.forEach(el => observer.observe(el));
}
