(() => {
    'use strict';

    // --- DOM refs ---
    const html = document.documentElement;
    const nav = document.getElementById('nav');
    const scrollProgress = document.getElementById('scrollProgress');
    const themeToggle = document.getElementById('themeToggle');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const backToTop = document.getElementById('backToTop');
    const contactForm = document.getElementById('contactForm');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const mobileLinks = document.querySelectorAll('.mobile-link[href^="#"]');
    const sections = document.querySelectorAll('.section, .hero');
    const reveals = document.querySelectorAll('.reveal');
    const counters = document.querySelectorAll('.hero-stat-number[data-count]');

    // --- Theme ---
    const THEME_KEY = 'cmartn-theme';

    function getPreferredTheme() {
        const saved = localStorage.getItem(THEME_KEY);
        if (saved === 'dark' || saved === 'light') return saved;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function applyTheme(theme) {
        html.setAttribute('data-theme', theme);
        localStorage.setItem(THEME_KEY, theme);
    }

    applyTheme(getPreferredTheme());

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            applyTheme(next);
        });
    }

    // --- Scroll: nav state, progress bar, active link, back-to-top ---
    let ticking = false;

    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;

            // Nav scrolled state
            if (nav) {
                nav.classList.toggle('scrolled', scrollY > 50);
            }

            // Scroll progress
            if (scrollProgress && docHeight > 0) {
                scrollProgress.style.width = ((scrollY / docHeight) * 100) + '%';
            }

            // Back to top
            if (backToTop) {
                backToTop.classList.toggle('visible', scrollY > 400);
            }

            // Active nav link
            let currentSection = '';
            sections.forEach(section => {
                const top = section.offsetTop - 120;
                if (scrollY >= top) {
                    currentSection = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === '#' + currentSection);
            });

            ticking = false;
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // --- Back to top ---
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Mobile menu ---
    function closeMobileMenu() {
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            const isOpen = hamburger.classList.contains('open');
            if (isOpen) {
                closeMobileMenu();
            } else {
                hamburger.classList.add('open');
                hamburger.setAttribute('aria-expanded', 'true');
                mobileMenu.classList.add('open');
                document.body.style.overflow = 'hidden';
            }
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }

    // --- Smooth scroll for nav links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const id = anchor.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // --- Reveal on scroll (Intersection Observer) ---
    if (reveals.length) {
        const revealObserver = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        );
        reveals.forEach(el => revealObserver.observe(el));
    }

    // --- Counter animation ---
    if (counters.length) {
        const counterObserver = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    const el = entry.target;
                    const target = parseInt(el.dataset.count, 10);
                    if (!target) return;

                    const duration = 1500;
                    const start = performance.now();

                    function tick(now) {
                        const elapsed = now - start;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        el.textContent = Math.round(eased * target);
                        if (progress < 1) requestAnimationFrame(tick);
                    }

                    requestAnimationFrame(tick);
                    counterObserver.unobserve(el);
                });
            },
            { threshold: 0.3 }
        );
        counters.forEach(c => counterObserver.observe(c));
    }

    // --- Contact form ---
    if (contactForm) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const orig = btn.textContent;
            btn.textContent = 'Sent!';
            btn.disabled = true;
            setTimeout(() => {
                btn.textContent = orig;
                btn.disabled = false;
                contactForm.reset();
            }, 2000);
        });
    }

    // --- Keyboard: Escape closes mobile menu ---
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('open')) {
            closeMobileMenu();
        }
    });
})();
