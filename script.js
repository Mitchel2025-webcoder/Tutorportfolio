/* ============================================================
   MITCHEL CHRIS — PORTFOLIO SCRIPTS
   ============================================================ */

'use strict';

/* ============================================================
   1. TYPEWRITER — Hero tagline animation
   ============================================================ */
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const phrases = [
    'Online Tutor',
    'Mathematics Teacher',
    'Web Developer',
    'Your Learning Partner',
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const TYPING_SPEED   = 90;   // ms per char when typing
  const DELETING_SPEED = 50;   // ms per char when deleting
  const PAUSE_END      = 1800; // ms pause at end of word
  const PAUSE_START    = 300;  // ms pause before typing new word

  function tick() {
    const current = phrases[phraseIndex];
    const displayed = isDeleting
      ? current.slice(0, charIndex - 1)
      : current.slice(0, charIndex + 1);

    el.textContent = displayed;

    if (!isDeleting) {
      charIndex++;
      if (charIndex > current.length) {
        // Finished typing — pause then start deleting
        isDeleting = true;
        setTimeout(tick, PAUSE_END);
        return;
      }
      setTimeout(tick, TYPING_SPEED);
    } else {
      charIndex--;
      if (charIndex < 0) {
        // Finished deleting — move to next phrase
        isDeleting = false;
        charIndex = 0;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(tick, PAUSE_START);
        return;
      }
      setTimeout(tick, DELETING_SPEED);
    }
  }

  // Small initial delay before starting
  setTimeout(tick, 600);
})();


/* ============================================================
   2. NAVIGATION — scroll state + mobile burger
   ============================================================ */
(function initNav() {
  const nav    = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const links  = document.getElementById('navLinks');

  if (!nav || !burger || !links) return;

  // Scroll → add .scrolled class
  function onScroll() {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  // Burger toggle
  burger.addEventListener('click', () => {
    const open = burger.classList.toggle('open');
    links.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
  });

  // Close menu on link click
  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      links.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) {
      burger.classList.remove('open');
      links.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });
})();


/* ============================================================
   3. SCROLL REVEAL — Fade-in elements with [data-reveal]
   ============================================================ */
(function initReveal() {
  const targets = document.querySelectorAll('[data-reveal]');
  if (!targets.length) return;

  // Stagger siblings within the same parent
  const staggerDelay = 100; // ms between siblings

  function staggerGroup(entries) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const parent = el.parentElement;
      const siblings = Array.from(parent.querySelectorAll('[data-reveal]'));
      const idx = siblings.indexOf(el);

      setTimeout(() => {
        el.classList.add('revealed');
      }, idx * staggerDelay);

      observer.unobserve(el);
    });
  }

  const observer = new IntersectionObserver(staggerGroup, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  });

  targets.forEach(t => observer.observe(t));
})();


/* ============================================================
   4. ACTIVE NAV LINK — Highlight current section
   ============================================================ */
(function initActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__links a');
  if (!sections.length || !navLinks.length) return;

  function updateActive() {
    let current = '';
    const scrollY = window.scrollY + window.innerHeight / 3;

    sections.forEach(section => {
      if (scrollY >= section.offsetTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
})();


/* ============================================================
   5. CONTACT FORM — Basic validation + simulated send
   ============================================================ */
(function initForm() {
  const submitBtn = document.getElementById('formSubmit');
  const successMsg = document.getElementById('formSuccess');
  if (!submitBtn || !successMsg) return;

  const fields = {
    name:    document.getElementById('fname'),
    email:   document.getElementById('femail'),
    subject: document.getElementById('fsubject'),
    message: document.getElementById('fmessage'),
  };

  function showError(input, msg) {
    input.style.borderColor = '#e74c3c';
    // Remove any existing error tip
    const existing = input.parentElement.querySelector('.field-error');
    if (existing) existing.remove();
    const tip = document.createElement('span');
    tip.className = 'field-error';
    tip.style.cssText = 'color:#e74c3c;font-size:0.75rem;margin-top:3px;display:block;';
    tip.textContent = msg;
    input.parentElement.appendChild(tip);
  }

  function clearError(input) {
    input.style.borderColor = '';
    const tip = input.parentElement.querySelector('.field-error');
    if (tip) tip.remove();
  }

  function validate() {
    let valid = true;

    if (!fields.name.value.trim()) {
      showError(fields.name, 'Please enter your name.');
      valid = false;
    } else { clearError(fields.name); }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(fields.email.value.trim())) {
      showError(fields.email, 'Please enter a valid email address.');
      valid = false;
    } else { clearError(fields.email); }

    if (!fields.subject.value.trim()) {
      showError(fields.subject, 'Please enter a subject.');
      valid = false;
    } else { clearError(fields.subject); }

    if (fields.message.value.trim().length < 10) {
      showError(fields.message, 'Message must be at least 10 characters.');
      valid = false;
    } else { clearError(fields.message); }

    return valid;
  }

  // Clear errors on input
  Object.values(fields).forEach(f => {
    f.addEventListener('input', () => clearError(f));
  });

  submitBtn.addEventListener('click', () => {
    if (!validate()) return;

    // Simulate sending
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.textContent = 'Send Message';
      submitBtn.disabled = false;
      successMsg.classList.add('show');

      // Reset form
      Object.values(fields).forEach(f => { f.value = ''; });

      setTimeout(() => {
        successMsg.classList.remove('show');
      }, 5000);
    }, 1400);
  });
})();


/* ============================================================
   6. SMOOTH SCROLL — Fill in any href="#…" that needs it
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navHeight = document.getElementById('nav')?.offsetHeight ?? 68;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
