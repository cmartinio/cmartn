(function () {
    [...document.querySelectorAll(".control")].forEach(button => {
        button.addEventListener("click", function() {
            document.querySelector(".active-btn").classList.remove("active-btn");
            this.classList.add("active-btn");
            document.querySelector(".active").classList.remove("active");
            document.getElementById(button.dataset.id).classList.add("active");
        })
    });
    document.querySelector(".theme-btn").addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
    })
})();
// Add this to your app.js file
document.addEventListener('DOMContentLoaded', function() {
    // Get all certification badges
    const certBadges = document.querySelectorAll('.cert-badge a');
    
    certBadges.forEach(badge => {
        badge.addEventListener('click', function(e) {
            // Prevent default link behavior 
            e.preventDefault();
            
            // Get the image source
            const imgSrc = this.querySelector('img').src;
            
            // Create lightbox elements
            const lightbox = document.createElement('div');
            lightbox.className = 'cert-lightbox';
            
            const lightboxContent = document.createElement('div');
            lightboxContent.className = 'lightbox-content';
            
            const img = document.createElement('img');
            img.src = imgSrc;
            
            const closeBtn = document.createElement('span');
            closeBtn.className = 'lightbox-close';
            closeBtn.innerHTML = '&times;';
            
            // Build and append lightbox
            lightboxContent.appendChild(img);
            lightboxContent.appendChild(closeBtn);
            lightbox.appendChild(lightboxContent);
            document.body.appendChild(lightbox);
            
            // Handle closing
            lightbox.addEventListener('click', function() {
                document.body.removeChild(lightbox);
            });
            
            // Stop propagation when clicking on the image itself
            img.addEventListener('click', function(e) {
                e.stopPropagation();
            });
            
            // After displaying, open the verification link in a new tab
            setTimeout(() => {
                const verifyLink = badge.href;
                if (verifyLink && verifyLink !== '#') {
                    window.open(verifyLink, '_blank');
                }
            }, 500);
        });
    });
});
// Counter animation
document.addEventListener('DOMContentLoaded', function() {
    const counters = document.querySelectorAll('.count-up');
    const speed = 200; // The lower the faster
    
    // Start the counter when it comes into view
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                let count = 0;
                
                const updateCount = () => {
                    const increment = target / speed;
                    
                    if (count < target) {
                        count += increment;
                        counter.innerText = Math.ceil(count);
                        setTimeout(updateCount, 1);
                    } else {
                        counter.innerText = target;
                    }
                };
                
                updateCount();
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.2 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
});
