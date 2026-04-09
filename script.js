// Spotlight Effect - Mouse tracking
document.addEventListener('mousemove', (e) => {
    const spotlight = document.getElementById('spotlight');
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    
    spotlight.style.setProperty('--mouse-x', `${x}%`);
    spotlight.style.setProperty('--mouse-y', `${y}%`);
});

// Smooth scroll for navigation
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

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
    observer.observe(section);
});

// Project cards hover effect
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.zIndex = '10';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.zIndex = '1';
    });
});

// Horizontal scroll for projects
const projectsSlider = document.querySelector('.projects-slider');

if (projectsSlider) {
    let isDown = false;
    let startX;
    let scrollLeft;

    projectsSlider.addEventListener('mousedown', (e) => {
        isDown = true;
        projectsSlider.style.cursor = 'grabbing';
        startX = e.pageX - projectsSlider.offsetLeft;
        scrollLeft = projectsSlider.scrollLeft;
    });

    projectsSlider.addEventListener('mouseleave', () => {
        isDown = false;
        projectsSlider.style.cursor = 'grab';
    });

    projectsSlider.addEventListener('mouseup', () => {
        isDown = false;
        projectsSlider.style.cursor = 'grab';
    });

    projectsSlider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - projectsSlider.offsetLeft;
        const walk = (x - startX) * 2;
        projectsSlider.scrollLeft = scrollLeft - walk;
    });
}

// Skill orbs interaction
document.querySelectorAll('.skill-orb').forEach(orb => {
    orb.addEventListener('mouseenter', function() {
        const skillName = this.getAttribute('data-skill');
        
        // Create tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'skill-tooltip';
        tooltip.textContent = skillName;
        tooltip.style.cssText = `
            position: absolute;
            top: -40px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(15px);
            padding: 0.5rem 1rem;
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            font-size: 0.75rem;
            white-space: nowrap;
            pointer-events: none;
            z-index: 1000;
            animation: fade-in-up 0.3s ease both;
        `;
        
        this.style.position = 'relative';
        this.appendChild(tooltip);
    });
    
    orb.addEventListener('mouseleave', function() {
        const tooltip = this.querySelector('.skill-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    });
});

// Active navigation item based on scroll
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.dock-item');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) {
            item.classList.add('active');
        }
    });
});

// Parallax effect for hero background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    const gridOverlay = document.querySelector('.grid-overlay');
    
    if (heroContent) {
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroContent.style.opacity = 1 - scrolled / 800;
    }
    
    if (gridOverlay) {
        gridOverlay.style.transform = `translate(${scrolled * 0.1}px, ${scrolled * 0.1}px)`;
    }
});

// Performance: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize scroll performance
const optimizedScroll = debounce(() => {
    // Your scroll-dependent code here
}, 10);

window.addEventListener('scroll', optimizedScroll);

// Loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Animate elements on load
    const heroElements = document.querySelectorAll('.hero-content > *');
    heroElements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// Glass morphism hover effect enhancement
document.querySelectorAll('.glass').forEach(element => {
    element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        element.style.setProperty('--mouse-x-local', `${x}px`);
        element.style.setProperty('--mouse-y-local', `${y}px`);
    });
});

// Dock animation on scroll
let lastScrollTop = 0;
const dock = document.getElementById('dock');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling down
        dock.style.transform = 'translateX(-50%) translateY(150px)';
    } else {
        // Scrolling up
        dock.style.transform = 'translateX(-50%) translateY(0)';
    }
    
    lastScrollTop = scrollTop;
}, false);

// Project cards keyboard navigation
document.querySelectorAll('.project-card').forEach((card, index) => {
    card.setAttribute('tabindex', '0');
    
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            const link = card.querySelector('.project-link');
            if (link) link.click();
        }
    });
});

// Add glow effect to buttons on hover
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 0 40px rgba(255, 255, 255, 0.3), 0 0 80px rgba(255, 255, 255, 0.15)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.boxShadow = '';
    });
});

// Dynamic year in footer
const footerYear = document.querySelector('.footer-text p');
if (footerYear && footerYear.textContent.includes('2026')) {
    const currentYear = new Date().getFullYear();
    footerYear.textContent = footerYear.textContent.replace('2026', currentYear);
}

// Skill orbs orbital animation pause on hover
document.querySelectorAll('.orbit').forEach(orbit => {
    orbit.addEventListener('mouseenter', function() {
        this.style.animationPlayState = 'paused';
        const orb = this.querySelector('.skill-orb');
        if (orb) {
            orb.style.animationPlayState = 'paused';
        }
    });
    
    orbit.addEventListener('mouseleave', function() {
        this.style.animationPlayState = 'running';
        const orb = this.querySelector('.skill-orb');
        if (orb) {
            orb.style.animationPlayState = 'running';
        }
    });
});

// Enhanced scroll indicator
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) {
            scrollIndicator.style.opacity = '0';
        } else {
            scrollIndicator.style.opacity = '1';
        }
    });
}

// Preload critical resources
const preloadImages = () => {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preloadImages);
} else {
    preloadImages();
}

// Console easter egg
console.log('%c🚀 Olá, Dev!', 'font-size: 20px; font-weight: bold; color: #fff;');
console.log('%cGostou do código? Entre em contato!', 'font-size: 14px; color: #aaa;');
console.log('%cpedrogm.dev@gmail.com', 'font-size: 14px; color: #fff; font-weight: bold;');
console.log('%cGitHub: github.com/opgmoraes', 'font-size: 14px; color: #fff;');

// Accessibility improvements
document.addEventListener('keydown', (e) => {
    // Skip to main content on Tab key
    if (e.key === 'Tab' && !e.shiftKey && document.activeElement === document.body) {
        const main = document.querySelector('main') || document.querySelector('section');
        if (main) {
            main.focus();
            e.preventDefault();
        }
    }
});

// Track scroll depth for analytics (placeholder)
let maxScroll = 0;
window.addEventListener('scroll', debounce(() => {
    const scrollPercent = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    
    if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        
        // Milestones
        if (maxScroll > 25 && maxScroll < 30) {
            console.log('Scroll depth: 25%');
        } else if (maxScroll > 50 && maxScroll < 55) {
            console.log('Scroll depth: 50%');
        } else if (maxScroll > 75 && maxScroll < 80) {
            console.log('Scroll depth: 75%');
        } else if (maxScroll > 95) {
            console.log('Scroll depth: 100% - Thanks for scrolling!');
        }
    }
}, 500));

// Add ripple effect to interactive elements
document.querySelectorAll('.btn-primary, .btn-secondary, .project-link, .contact-card').forEach(element => {
    element.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            width: 20px;
            height: 20px;
            left: ${e.clientX - rect.left - 10}px;
            top: ${e.clientY - rect.top - 10}px;
            animation: ripple-effect 0.6s ease-out;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple-effect {
        to {
            transform: scale(20);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
