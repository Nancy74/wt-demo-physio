/**
 * ActivePhysio — Main JavaScript
 * Theme toggle, mobile nav, FAQ accordion, scroll effects, form handler
 */
document.addEventListener('DOMContentLoaded', () => {

    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    function getPreferredTheme() {
        const stored = localStorage.getItem('activephysio-theme');
        if (stored === 'light' || stored === 'dark') return stored;
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
        return 'light';
    }
    function setTheme(theme) {
        html.setAttribute('data-theme', theme);
        localStorage.setItem('activephysio-theme', theme);
    }
    setTheme(getPreferredTheme());
    if (themeToggle) themeToggle.addEventListener('click', () => setTheme(html.getAttribute('data-theme') === 'light' ? 'dark' : 'light'));
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => { if (!localStorage.getItem('activephysio-theme')) setTheme(e.matches ? 'dark' : 'light'); });

    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => { hamburger.classList.toggle('active'); navLinks.classList.toggle('open'); document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : ''; });
        navLinks.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => { hamburger.classList.remove('active'); navLinks.classList.remove('open'); document.body.style.overflow = ''; }));
        document.addEventListener('click', (e) => { if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !hamburger.contains(e.target)) { hamburger.classList.remove('active'); navLinks.classList.remove('open'); document.body.style.overflow = ''; } });
    }

    document.querySelectorAll('.faq-item').forEach(item => {
        item.querySelector('.faq-question').addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(o => { o.classList.remove('active'); o.querySelector('.faq-question').setAttribute('aria-expanded', 'false'); });
            if (!isActive) { item.classList.add('active'); item.querySelector('.faq-question').setAttribute('aria-expanded', 'true'); }
        });
    });

    const sections = document.querySelectorAll('section[id]');
    const navLinkEls = document.querySelectorAll('.nav-link');
    function setActiveNav() { const pos = window.scrollY + 120; sections.forEach(s => { if (pos >= s.offsetTop && pos < s.offsetTop + s.offsetHeight) navLinkEls.forEach(l => { l.classList.toggle('active', l.getAttribute('href') === '#' + s.id); }); }); }
    window.addEventListener('scroll', setActiveNav, { passive: true });

    const backToTop = document.getElementById('backToTop');
    function toggleBTT() { backToTop?.classList.toggle('visible', window.scrollY > 400); }
    window.addEventListener('scroll', toggleBTT, { passive: true });
    if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    const form = document.getElementById('contactForm');
    if (form) form.addEventListener('submit', (e) => { e.preventDefault(); const d = Object.fromEntries(new FormData(form)); if (!d.firstName || !d.lastName || !d.email || !d.phone) { alert('Please fill in all required fields.'); return; } alert("Thank you! We'll be in touch shortly."); form.reset(); });

    const revealEls = document.querySelectorAll('.service-card, .team-card, .testimonial-card, .feature-card, .blog-card, .faq-item, .contact-card');
    if ('IntersectionObserver' in window) {
        const obs = new IntersectionObserver((entries) => { entries.forEach((entry, i) => { if (entry.isIntersecting) { setTimeout(() => { entry.target.style.opacity = '1'; entry.target.style.transform = 'translateY(0)'; }, i * 60); obs.unobserve(entry.target); } }); }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(20px)'; el.style.transition = 'opacity 0.5s ease, transform 0.5s ease'; obs.observe(el); });
    }

    setActiveNav(); toggleBTT();
});
