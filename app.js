const controls = document.querySelectorAll('.control');
const sections = document.querySelectorAll('.container');
const themeBtn = document.querySelector('.theme-btn');

// Section switching
function switchSection(event) {
    const control = event.target.closest('.control');
    if (!control) return;

    const id = control.dataset.id;
    
    // Update buttons
    controls.forEach(btn => btn.classList.remove('active-btn'));
    control.classList.add('active-btn');
    
    // Update sections
    sections.forEach(section => {
        section.classList.remove('active');
        if(section.id === id) section.classList.add('active');
    });
}

// Theme toggle
function toggleTheme() {
    document.body.classList.toggle('light-mode');
}

// Counter animation
function animateCounters() {
    const counters = document.querySelectorAll('.count-up');
    const speed = 200;
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.count);
                let count = 0;
                
                const updateCount = () => {
                    const increment = target / speed;
                    if (count < target) {
                        count += increment;
                        counter.textContent = Math.ceil(count);
                        requestAnimationFrame(updateCount);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCount();
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.1 });

    counters.forEach(counter => counterObserver.observe(counter));
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    // Event listeners
    document.querySelector('.main-content').addEventListener('click', switchSection);
    themeBtn.addEventListener('click', toggleTheme);
    
    // Initial animations
    animateCounters();
    
    // Form submission
    document.querySelector('.contact-form').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Form submitted successfully!');
    });
});

// Add this to your existing JavaScript
function initializeExperienceSection() {
    const expItems = document.querySelectorAll('.exp-item');
    
    expItems.forEach((item, index) => {
        // Add animation delays
        item.style.transitionDelay = `${index * 0.2}s`;
        
        // Initialize Intersection Observer for each experience item
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        observer.observe(item);
    });
}

// Add to your DOMContentLoaded event
document.addEventListener('DOMContentLoaded', () => {
    // Existing initializations...
    initializeExperienceSection();
});