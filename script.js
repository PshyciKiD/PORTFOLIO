// Navigation active state on scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');
const nav = document.querySelector('.soc-nav');

window.addEventListener('scroll', () => {
    let current = '';
    
    // Determine active section
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    // Handle Active Link
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });

    // Frosted Glass Shrink Effect on Scroll
    if (scrollY > 50) {
        nav.style.background = 'rgba(13, 17, 23, 0.95)';
        nav.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.5)';
    } else {
        nav.style.background = 'rgba(13, 17, 23, 0.9)';
        nav.style.boxShadow = 'none';
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in-up').forEach(element => {
    observer.observe(element);
});

// Copy to Clipboard Utility
function copyToClipboard(text, btnElement) {
    navigator.clipboard.writeText(text).then(() => {
        // Change icon to checkmark momentarily
        const icon = btnElement.querySelector('i');
        const originalClass = icon.className;
        
        icon.className = 'fa-solid fa-check';
        icon.style.color = 'var(--accent)';
        
        setTimeout(() => {
            icon.className = originalClass;
            icon.style.color = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}
