// Scroll Progress Bar
window.addEventListener('scroll', () => {
    const scrollBar = document.querySelector('.scroll-progress-bar');
    if (scrollBar) {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollBar.style.width = scrollPercent + '%';
    }
});

// =====================
// Full Page Scroll & Dot Nav
// =====================
(function () {
    const dotNav = document.getElementById('scrollDotNav');
    const dotLinks = document.querySelectorAll('.dot-link');
    const sections = ['home', 'about', 'services', 'works', 'contact'];
    const lightSections = ['services']; // sections with light background
    
    // Variables for wheel scroll logic
    let isScrolling = false;
    let currentSectionIndex = 0;

    // Get ordered section elements
    const sectionElements = sections.map(id => document.getElementById(id)).filter(el => el);

    if (!dotNav || sectionElements.length === 0) return;

    // Find active section by position
    function getActiveSection() {
        let activeId = sections[0];
        let minDiff = Infinity;
        
        sectionElements.forEach((el, index) => {
            const rect = el.getBoundingClientRect();
            const diff = Math.abs(rect.top);
            if (diff < minDiff) {
                minDiff = diff;
                activeId = el.id;
                currentSectionIndex = index;
            }
        });
        return activeId;
    }

    function updateDots() {
        const activeId = getActiveSection();
        dotLinks.forEach(link => {
            const section = link.getAttribute('data-section');
            link.classList.toggle('active', section === activeId);
        });
        dotNav.classList.toggle('on-light', lightSections.includes(activeId));
        
        if (window.scrollY > 80) {
            dotNav.classList.add('visible');
        } else {
            dotNav.classList.remove('visible');
        }
    }

    // Smooth scroll on dot click
    dotLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const targetId = link.getAttribute('data-section');
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            updateDots();
        }
    }, { passive: true });

    // Init
    updateDots();
})();

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Active Navigation Link on Scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Toggle Mobile Menu
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar')) {
        navMenu?.classList.remove('active');
    }
});

// Scroll reveal animations - Advanced
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            scrollObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.animate').forEach(el => {
    scrollObserver.observe(el);
});

// Parallax effect on scroll
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const elements = document.querySelectorAll('[data-parallax]');
    
    elements.forEach(el => {
        const speed = el.getAttribute('data-parallax') || 0.5;
        el.style.transform = `translateY(${scrollY * speed}px)`;
    });
});

// Gallery Filter
const filterButtons = document.querySelectorAll('.filter-btn');
function applyFilter(filterValue) {
    const items = document.querySelectorAll('.gallery-item, .gallery-item-minimal');
    items.forEach(item => {
        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
            item.style.display = 'block';
            setTimeout(() => {
                item.style.opacity = '1';
            }, 10);
        } else {
            item.style.opacity = '0';
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
}

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        applyFilter(button.getAttribute('data-filter'));
    });
});

// FAQ Toggle
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        
        // Close other FAQs
        document.querySelectorAll('.faq-item').forEach(item => {
            if (item !== faqItem) {
                item.classList.remove('active');
            }
        });

        // Toggle current FAQ
        faqItem.classList.toggle('active');
    });
});

// Contact Form Submit
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            service: formData.get('service'),
            message: formData.get('message')
        };

        // Here you would send the data to your backend server
        console.log('Form Data:', data);

        // Show success message
        alert('شكراً لتواصلك معنا! سنرد عليك في أقرب وقت.');
        contactForm.reset();
    });
}

// Smooth Scroll for Navigation
const navLinks = document.querySelectorAll('a[href^="#"]');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// Load More Works
const loadMoreBtn = document.querySelector('.load-more-btn');

if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', (e) => {
        e.preventDefault();
        alert('سيتم تحميل المزيد من الأعمال قريباً');
    });
}

// Load More Logos
const loadMoreLogosBtn = document.getElementById('loadMoreLogos');

// Floating scroll‑to‑top button behaviour
const scrollTopBtn = document.getElementById('scrollToTop');
window.addEventListener('scroll', () => {
    if (!scrollTopBtn) return;
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add('show');
    } else {
        scrollTopBtn.classList.remove('show');
    }
});

if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

if (loadMoreLogosBtn) {
    loadMoreLogosBtn.addEventListener('click', () => {
        alert('سيتم تحميل المزيد من الشعارات قريباً');
    });
}

// Animate elements on scroll
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

// Observe service cards
document.querySelectorAll('.service-card, .community-card, .team-member').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Add active class to current nav link
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

setActiveNavLink();

// Counter Animation
function animateCounters() {
    const stats = document.querySelectorAll('.stat-number');
    const speed = 200;

    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target')) || 0;
        let count = 0;

        const updateCount = () => {
            const increment = target / speed;
            if (count < target) {
                count += increment;
                if (count > target) count = target;
                stat.textContent = Math.floor(count) + (stat.textContent.includes('+') ? '+' : '');
            }
        };

        // Trigger animation when element is in view
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                const interval = setInterval(() => {
                    updateCount();
                    if (count >= target) clearInterval(interval);
                }, 10);
            }
        });

        observer.observe(stat);
    });
}

// Call counter animation
animateCounters();

// Add smooth page transitions
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    document.body.style.animation = 'pageLoad 0.6s ease-in-out';
});

// Page fade in animation
const style = document.createElement('style');
style.textContent = `
    @keyframes pageLoad {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

console.log('Ambrand Studio Website Loaded Successfully');
