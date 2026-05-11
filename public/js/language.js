// Language Management System
const translations = {
    ar: {
        // Navigation
        'nav-home': 'الرئيسية',
        'nav-services': 'الخدمات',
        'nav-works': 'الأعمال',
        'nav-community': 'المجتمع',
        'nav-logos': 'معرض الشعارات',
        'nav-clients': 'العملاء',
        'nav-about': 'عننا',
        'nav-contact': 'تواصل معنا',
        'lang-btn': 'English',

        // Home Page
        'hero-title': 'Let\'s Make WOW...',
        'hero-subtitle': 'نحن نخلق الهوية البصرية المميزة التي تترك انطباعاً لا ينسى',
        'hero-btn': 'ابدأ معنا الآن',
        'featured-services': 'خدماتنا الرئيسية',
        'recent-works': 'أحدث المشاريع',
        'view-all-services': 'عرض جميع الخدمات',
        'view-all-works': 'عرض جميع الأعمال',
        'ready-headline': 'هل أنت مستعد لإنشاء شيء رائع؟',
        'ready-subtitle': 'دعنا نساعدك في بناء هوية بصرية تميزك عن المنافسة',
        'contact-btn': 'تواصل معنا اليوم',

        // Services Page
        'services-headline': 'خدماتنا المتكاملة',
        'services-subtitle': 'نقدم مجموعة شاملة من خدمات التصميم والعلامات التجارية',

        // Works Page
        'works-headline': 'معرض أعمالنا',
        'works-subtitle': 'مشاريع احترافية متنوعة من خدماتنا المختلفة',
        'filter-all': 'الكل',
        'filter-brand': 'تطوير العلامة',
        'filter-logo': 'تصميم الشعارات',
        'filter-packaging': 'تصميم الأغلفة',
        'filter-motion': 'الرسوميات المتحركة',
        'filter-website': 'تصميم المواقع',
        'filter-3d': 'تصميم ثلاثي الأبعاد',

        // Community Page
        'community-headline': 'مجتمعنا الإبداعي',
        'community-subtitle': 'انضم إلينا وكن جزءاً من الحركة الإبداعية',

        // About Page
        'about-headline': 'عن Ambrand Studio',
        'about-subtitle': 'تعرف علينا وعلى رؤيتنا وقيمنا',

        // Contact Page
        'contact-headline': 'تواصل معنا',
        'contact-subtitle': 'نحن هنا للإجابة على جميع أسئلتك',
    },
    en: {
        // Navigation
        'nav-home': 'Home',
        'nav-services': 'Services',
        'nav-works': 'Works',
        'nav-community': 'Community',
        'nav-logos': 'Logo Gallery',
        'nav-clients': 'Clients',
        'nav-about': 'About',
        'nav-contact': 'Contact',
        'lang-btn': 'العربية',

        // Home Page
        'hero-title': 'Let\'s Make WOW...',
        'hero-subtitle': 'We create distinctive visual identities that leave a lasting impression',
        'hero-btn': 'Start Now',
        'featured-services': 'Our Services',
        'recent-works': 'Recent Projects',
        'view-all-services': 'View All Services',
        'view-all-works': 'View All Works',
        'ready-headline': 'Ready to Create Something Amazing?',
        'ready-subtitle': 'Let us help you build a visual identity that sets you apart from the competition',
        'contact-btn': 'Contact Us Today',

        // Services Page
        'services-headline': 'Our Integrated Services',
        'services-subtitle': 'We offer a comprehensive range of design and branding services',

        // Works Page
        'works-headline': 'Our Portfolio',
        'works-subtitle': 'Diverse professional projects from our different services',
        'filter-all': 'All',
        'filter-brand': 'Brand Development',
        'filter-logo': 'Logo Design',
        'filter-packaging': 'Packaging Design',
        'filter-motion': 'Motion Graphics',
        'filter-website': 'Website Design',
        'filter-3d': '3D Design',

        // Community Page
        'community-headline': 'Our Creative Community',
        'community-subtitle': 'Join us and be part of the creative movement',

        // About Page
        'about-headline': 'About Ambrand Studio',
        'about-subtitle': 'Get to know us and our vision and values',

        // Contact Page
        'contact-headline': 'Contact Us',
        'contact-subtitle': 'We\'re here to answer all your questions',
    }
};

// Get current language from localStorage
function getCurrentLanguage() {
    return localStorage.getItem('language') || 'ar';
}

// Set language
function setLanguage(lang) {
    localStorage.setItem('language', lang);
    applyLanguage(lang);
}

// Apply language to page
function applyLanguage(lang) {
    const html = document.getElementById('htmlElement');
    const body = document.getElementById('bodyElement');
    const langBtn = document.getElementById('langBtn');

    if (html) html.lang = lang;
    if (body) body.dir = lang === 'ar' ? 'rtl' : 'ltr';
    if (langBtn) langBtn.textContent = translations[lang]['lang-btn'];

    // Update all elements with data attributes
    document.querySelectorAll('[data-ar][data-en]').forEach(element => {
        const text = lang === 'ar' ? element.getAttribute('data-ar') : element.getAttribute('data-en');
        if (element.tagName === 'A' || element.tagName === 'BUTTON' || element.tagName === 'SPAN') {
            element.textContent = text;
        } else if (element.tagName === 'H1' || element.tagName === 'H2' || element.tagName === 'H3' || element.tagName === 'P') {
            element.textContent = text;
        }
    });

    // Update navigation links
    updateNavigation(lang);

    // Store language in DOM for CSS
    document.documentElement.setAttribute('data-lang', lang);
}

// Update navigation text
function updateNavigation(lang) {
    const navItems = {
        'nav-home': document.querySelector('[class*="nav-home"]'),
        'nav-services': document.querySelector('[class*="nav-services"]'),
        'nav-works': document.querySelector('[class*="nav-works"]'),
        'nav-community': document.querySelector('[class*="nav-community"]'),
        'nav-logos': document.querySelector('[class*="nav-logos"]'),
        'nav-clients': document.querySelector('[class*="nav-clients"]'),
        'nav-about': document.querySelector('[class*="nav-about"]'),
        'nav-contact': document.querySelector('[class*="nav-contact"]'),
    };

    Object.entries(navItems).forEach(([key, element]) => {
        if (element) {
            element.textContent = translations[lang][key];
        }
    });
}

// Toggle language
function toggleLanguage() {
    const currentLang = getCurrentLanguage();
    const newLang = currentLang === 'ar' ? 'en' : 'ar';
    setLanguage(newLang);
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', () => {
    const currentLang = getCurrentLanguage();
    applyLanguage(currentLang);
});
