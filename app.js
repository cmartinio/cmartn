// Accessible, mobile-friendly section switching with deep linking and theme persistence

// Cache nodes
const body = document.body;
const controlsRoot = document.querySelector('.controls');
const controls = Array.from(document.querySelectorAll('.controls .control'));
const sections = Array.from(document.querySelectorAll('.container'));
const themeBtn = document.querySelector('.theme-btn');

// ---- Accessibility wiring for current div-based controls and sections ----
function initA11y() {
  // Treat controls container as a tablist
  if (controlsRoot) {
    controlsRoot.setAttribute('role', 'tablist');
    controlsRoot.setAttribute('aria-label', 'Section tabs');
  }

  // Make each control behave like a tab button
  controls.forEach((ctrl) => {
    const id = ctrl.dataset.id;
    const tabId = `tab-${id}`;
    ctrl.id = ctrl.id || tabId;
    ctrl.setAttribute('role', 'tab');
    ctrl.setAttribute('aria-controls', id);
    ctrl.setAttribute('tabindex', ctrl.classList.contains('active-btn') ? '0' : '-1');
    ctrl.setAttribute('aria-selected', ctrl.classList.contains('active-btn') ? 'true' : 'false');
  });

  // Make sections proper tabpanels
  sections.forEach((section) => {
    const id = section.id;
    const labelledBy = `tab-${id}`;
    section.setAttribute('role', 'tabpanel');
    section.setAttribute('aria-labelledby', labelledBy);
    section.setAttribute('tabindex', '-1');
    const isActive = section.classList.contains('active');
    section.setAttribute('aria-hidden', isActive ? 'false' : 'true');
  });

  // Theme toggle as an accessible control
  if (themeBtn) {
    themeBtn.setAttribute('role', 'button');
    themeBtn.setAttribute('tabindex', '0');
    themeBtn.setAttribute('aria-label', 'Toggle color theme');
    themeBtn.setAttribute('aria-pressed', 'false');
  }
}

// ---- Navigation / state management ----
function setActiveControl(targetCtrl) {
  controls.forEach((ctrl) => {
    const isSelected = ctrl === targetCtrl;
    ctrl.classList.toggle('active-btn', isSelected);
    ctrl.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    ctrl.setAttribute('tabindex', isSelected ? '0' : '-1');
  });
}

function setActiveSection(id) {
  sections.forEach((section) => {
    const isActive = section.id === id;
    section.classList.toggle('active', isActive);
    section.setAttribute('aria-hidden', isActive ? 'false' : 'true');
  });

  const activeSection = sections.find((s) => s.id === id);
  if (activeSection) {
    const heading = activeSection.querySelector('h1, h2, h3, [tabindex="-1"]');
    // Focus the section's first heading if available
    if (heading && typeof heading.focus === 'function') {
      heading.focus({ preventScroll: true });
    } else {
      activeSection.focus({ preventScroll: true });
    }
    // Smoothly scroll into view (mobile-friendly)
    activeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function activate(id, pushHash = true) {
  const ctrl = controls.find((c) => c.dataset.id === id);
  const section = sections.find((s) => s.id === id);
  if (!ctrl || !section) return;

  setActiveControl(ctrl);
  setActiveSection(id);

  if (pushHash && location.hash !== `#${id}`) {
    history.pushState(null, '', `#${id}`);
  }
}

// Click navigation
function onControlsClick(e) {
  const ctrl = e.target.closest('.control');
  if (!ctrl || !controlsRoot.contains(ctrl)) return;
  activate(ctrl.dataset.id);
}

// Keyboard navigation for tabs
function onControlsKeydown(e) {
  const activeEl = document.activeElement;
  const idx = controls.indexOf(activeEl);
  if (idx === -1) return;

  let nextIdx = null;
  switch (e.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      nextIdx = (idx + 1) % controls.length;
      break;
    case 'ArrowLeft':
    case 'ArrowUp':
      nextIdx = (idx - 1 + controls.length) % controls.length;
      break;
    case 'Home':
      nextIdx = 0;
      break;
    case 'End':
      nextIdx = controls.length - 1;
      break;
    case 'Enter':
    case ' ':
      activate(controls[idx].dataset.id);
      e.preventDefault();
      return;
    default:
      return;
  }
  controls[nextIdx].focus();
  e.preventDefault();
}

// Hash routing for deep links
function initRouting() {
  const goToHash = () => {
    const id = (location.hash || '#home').slice(1);
    const exists = sections.some((s) => s.id === id);
    activate(exists ? id : 'home', /* pushHash */ false);
  };

  window.addEventListener('hashchange', goToHash);
  goToHash(); // initial load
}

// ---- Theme handling with persistence ----
const THEME_KEY = 'pref-theme'; // 'light' | 'dark'

function applyTheme(mode) {
  const isLight = mode === 'light';
  body.classList.toggle('light-mode', isLight);
  if (themeBtn) themeBtn.setAttribute('aria-pressed', isLight ? 'true' : 'false');
}

function detectInitialTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  return prefersLight ? 'light' : 'dark';
}

function toggleTheme() {
  const isLight = body.classList.contains('light-mode');
  const next = isLight ? 'dark' : 'light';
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
}

function initTheme() {
  applyTheme(detectInitialTheme());
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
    themeBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        toggleTheme();
        e.preventDefault();
      }
    });
  }
}

// ---- Counter animation (safe if elements exist) ----
function animateCountersSafe() {
  const counters = document.querySelectorAll('.count-up');
  if (!counters.length) return;

  const speed = 200;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const counter = entry.target;
        const target = parseInt(counter.dataset.count, 10) || 0;
        let count = 0;

        const update = () => {
          const increment = Math.max(1, target / speed);
          if (count < target) {
            count += increment;
            counter.textContent = Math.min(target, Math.ceil(count));
            requestAnimationFrame(update);
          } else {
            counter.textContent = target;
          }
        };

        update();
        io.unobserve(counter);
      });
    },
    { threshold: 0.1 }
  );

  counters.forEach((c) => io.observe(c));
}

// ---- Experience section reveal (safe if elements exist) ----
function initializeExperienceSectionSafe() {
  const expItems = document.querySelectorAll('.exp-item');
  if (!expItems.length) return;

  expItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.2}s`;
    const ob = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1 }
    );
    ob.observe(item);
  });
}

// ---- Contact form stub (prevents errors without backend) ----
function wireContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Form submitted successfully!');
  });
}

// ---- Boot ----
document.addEventListener('DOMContentLoaded', () => {
  initA11y();
  initTheme();

  // Controls: click + keyboard
  if (controlsRoot) {
    controlsRoot.addEventListener('click', onControlsClick);
    controlsRoot.addEventListener('keydown', onControlsKeydown);
  }

  initRouting();
  animateCountersSafe();
  initializeExperienceSectionSafe();
  wireContactForm();
});