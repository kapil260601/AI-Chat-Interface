// Initialize particles and animations on page load
document.addEventListener('DOMContentLoaded', function () {
    createParticles();
    initializeAnimations();
    setupScrollAnimations();
    setupButtonRipple();
    setupPhotoEntranceAnimations();
    hydrateGalleryImages();
    setupLikeDelegation();
    setupToTop();
});

// Create floating particles
function createParticles() {
    var particlesRoot = document.getElementById('particles');
    if (!particlesRoot) return;

    var particleEmojis = ['💝', '💕', '💖', '💗', '🌸', '🌺', '✨', '⭐', '🦋'];
    var particleCount = 20;

    for (var i = 0; i < particleCount; i++) {
        var particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = particleEmojis[Math.floor(Math.random() * particleEmojis.length)];

        // Random position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';

        // Random animation duration and delay
        particle.style.animationDuration = (Math.random() * 3 + 4) + 's';
        particle.style.animationDelay = (Math.random() * 2) + 's';

        particlesRoot.appendChild(particle);
    }
}

// Initialize typewriter and other animations
function initializeAnimations() {
    // Typewriter effect handled by CSS
    var fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(function (element, index) {
        element.style.animationDelay = (index * 0.2) + 's';
    });
}

// Scroll animations using IntersectionObserver
function setupScrollAnimations() {
    var observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');

                if (entry.target.classList.contains('message-card')) {
                    animateMessageText();
                }
            }
        });
    }, observerOptions);

    var elementsToObserve = document.querySelectorAll('[data-aos], .section-title, .message-card');
    elementsToObserve.forEach(function (element) {
        observer.observe(element);
        var delay = element.getAttribute('data-delay');
        if (delay) element.style.transitionDelay = delay + 'ms';
    });
}

// Animate message text with staggered effect
function animateMessageText() {
    var messageTexts = document.querySelectorAll('.message-text');
    messageTexts.forEach(function (text, index) {
        setTimeout(function () { text.classList.add('fade-in-animate'); }, index * 450);
    });
}

// Smooth scroll helper if needed (kept for completeness)
function scrollToSection(sectionId) {
    var section = document.getElementById(sectionId);
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Toggle like functionality for photos (imperative API kept for compatibility)
function toggleLike(button) {
    var heartIcon = button.querySelector('.heart-icon');
    button.classList.toggle('liked');
    var liked = button.classList.contains('liked');
    button.setAttribute('aria-pressed', liked ? 'true' : 'false');
    if (heartIcon) heartIcon.textContent = liked ? '❤️' : '🤍';
    if (liked) createFloatingHeart(button);
}

// Event delegation for like buttons
function setupLikeDelegation() {
    document.addEventListener('click', function (e) {
        var target = e.target;
        if (!target) return;
        var button = target.closest && target.closest('.like-btn');
        if (!button) return;
        e.preventDefault();
        toggleLike(button);
    });
}

// Create floating heart animation when photo is liked
function createFloatingHeart(button) {
    var heart = document.createElement('div');
    heart.textContent = '❤️';
    heart.style.position = 'fixed';
    heart.style.fontSize = '1.6rem';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '1000';

    var rect = button.getBoundingClientRect();
    heart.style.left = (rect.left + rect.width / 2) + 'px';
    heart.style.top = (rect.top) + 'px';

    document.body.appendChild(heart);

    heart.animate([
        { transform: 'translate(-10px, 0) scale(1)', opacity: 1 },
        { transform: 'translate(-60px, -80px) scale(1.6)', opacity: 0 }
    ], { duration: 1200, easing: 'ease-out' }).onfinish = function () {
        if (heart.parentNode) heart.parentNode.removeChild(heart);
    };
}

// Parallax effect for hero section and particles
window.addEventListener('scroll', function () {
    var scrolled = window.pageYOffset || document.documentElement.scrollTop;
    var king = document.querySelector('.king');
    var parallaxSpeed = 0.5;
    if (king) king.style.transform = 'translateY(' + (scrolled * parallaxSpeed) + 'px)';

    var particles = document.querySelectorAll('.particle');
    particles.forEach(function (particle, index) {
        var speed = 0.15 + (index % 3) * 0.08;
        particle.style.transform = 'translateY(' + (scrolled * speed) + 'px)';
    });
});

// Mouse movement effect on hero floating hearts
document.addEventListener('mousemove', function (e) {
    var king = document.querySelector('.king');
    if (!king) return;
    var x = e.clientX / window.innerWidth;
    var y = e.clientY / window.innerHeight;
    var moveX = (x - 0.5) * 20;
    var moveY = (y - 0.5) * 20;
    var floatingHearts = document.querySelector('.floating-hearts');
    if (floatingHearts) floatingHearts.style.transform = 'translate(' + moveX + 'px, ' + moveY + 'px)';
});

// Button ripple effect
function setupButtonRipple() {
    document.querySelectorAll('button').forEach(function (button) {
        button.addEventListener('click', function (e) {
            var ripple = document.createElement('span');
            var rect = button.getBoundingClientRect();
            var size = Math.max(rect.width, rect.height);
            var x = e.clientX - rect.left - size / 2;
            var y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = 'position:absolute;width:' + size + 'px;height:' + size + 'px;left:' + x + 'px;top:' + y + 'px;background:rgba(255,255,255,0.45);border-radius:50%;transform:scale(0);animation:ripple 0.6s ease-out;pointer-events:none;';

            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);

            setTimeout(function () { if (ripple.parentNode) ripple.parentNode.removeChild(ripple); }, 650);
        });
    });
}

// Add ripple animation style
(function injectRippleKeyframes() {
    var style = document.createElement('style');
    style.textContent = '@keyframes ripple { to { transform: scale(2); opacity: 0; } }';
    document.head.appendChild(style);
})();

// Entrance animations for photos when they come into view
function setupPhotoEntranceAnimations() {
    var photoObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var img = entry.target.querySelector('img');
                if (img) img.style.animation = 'photoEnter 0.8s ease-out forwards';
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.photo-card').forEach(function (card) { photoObserver.observe(card); });

    var photoStyle = document.createElement('style');
    photoStyle.textContent = '@keyframes photoEnter { from { transform: scale(0.92) rotate(-3deg); opacity: 0; } to { transform: scale(1) rotate(0deg); opacity: 1; } }';
    document.head.appendChild(photoStyle);
}

// Progressive image loading with local-first and network fallback
function hydrateGalleryImages() {
    var cards = document.querySelectorAll('.photo-card');
    cards.forEach(function (card) {
        var img = card.querySelector('img');
        var container = card.querySelector('.photo-container');
        if (!img || !container) return;

        // Mark loading state for skeleton
        container.classList.remove('is-loaded');

        // If image fails, switch to fallback URL (e.g., Unsplash)
        var fallbackSrc = img.getAttribute('data-fallback');
        var triedFallback = false;

        function onLoad() {
            container.classList.add('is-loaded');
        }

        function onError() {
            if (!triedFallback && fallbackSrc) {
                triedFallback = true;
                img.src = fallbackSrc;
            } else {
                // As a last resort, hide broken image container
                container.classList.add('is-loaded');
                img.style.opacity = '0';
            }
        }

        img.addEventListener('load', onLoad, { once: true });
        img.addEventListener('error', onError);

        // If browser already cached it
        if (img.complete && img.naturalWidth > 0) {
            onLoad();
        }
    });
}

// Back to top button behavior
function setupToTop() {
    var toTop = document.querySelector('.to-top');
    if (!toTop) return;
    function onScroll() {
        var scrolled = window.pageYOffset || document.documentElement.scrollTop;
        if (scrolled > 400) {
            toTop.classList.add('show');
        } else {
            toTop.classList.remove('show');
        }
    }
    window.addEventListener('scroll', onScroll);
    onScroll();
    toTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

