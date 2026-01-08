// MedCloud Landing Page JavaScript
// Handles animations, interactions, and form submissions

// ===========================
// Smooth Scrolling
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===========================
// Header Scroll Effect
// ===========================
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ===========================
// Mobile Menu Toggle
// ===========================
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });
}

// ===========================
// Animated Counter
// ===========================
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// ===========================
// Intersection Observer for Scroll Animations
// ===========================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');

            // Trigger counter animation for stats
            if (entry.target.classList.contains('stat-value')) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
            }

            // Trigger counter animation for hero stats
            if (entry.target.classList.contains('stat-number')) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
            }
        }
    });
}, observerOptions);

// Observe all elements that should animate on scroll
document.addEventListener('DOMContentLoaded', () => {
    // Add scroll-animate class to sections
    const animateElements = document.querySelectorAll('.feature-card, .benefit-card, .user-card, .testimonial-card, .stat-card');
    animateElements.forEach(el => {
        el.classList.add('scroll-animate');
        observer.observe(el);
    });

    // Observe stat counters
    const statValues = document.querySelectorAll('.stat-value, .stat-number');
    statValues.forEach(stat => observer.observe(stat));
});

// ===========================
// Contact Form Submission
// ===========================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            hospital: document.getElementById('hospital').value,
            message: document.getElementById('message').value
        };

        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Đang gửi...';
        submitButton.disabled = true;

        try {
            // Simulate API call (replace with actual endpoint)
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Success
            alert('Cảm ơn bạn đã đăng ký! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.');
            contactForm.reset();
        } catch (error) {
            // Error
            alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
            console.error('Form submission error:', error);
        } finally {
            // Reset button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    });
}

// ===========================
// Newsletter Form Submission
// ===========================
const newsletterForms = document.querySelectorAll('.newsletter-form');

newsletterForms.forEach(form => {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const emailInput = form.querySelector('input[type="email"]');
        const email = emailInput.value;

        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Đang xử lý...';
        submitButton.disabled = true;

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            alert('Đăng ký thành công! Cảm ơn bạn đã theo dõi.');
            emailInput.value = '';
        } catch (error) {
            alert('Có lỗi xảy ra. Vui lòng thử lại.');
            console.error('Newsletter subscription error:', error);
        } finally {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    });
});

// ===========================
// Parallax Effect (Optional)
// ===========================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroIllustration = document.querySelector('.hero-illustration');

    if (heroIllustration) {
        heroIllustration.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// ===========================
// Feature Card Hover Effect
// ===========================
const featureCards = document.querySelectorAll('.feature-card');

featureCards.forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-8px)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0)';
    });
});

// ===========================
// Lazy Loading Images (if needed)
// ===========================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    const lazyImages = document.querySelectorAll('img.lazy');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ===========================
// Console Welcome Message
// ===========================
console.log('%c🏥 MedCloud Landing Page', 'color: #0066CC; font-size: 20px; font-weight: bold;');
console.log('%cHệ Thống Quản Lý Bệnh Viện Thông Minh', 'color: #00A8A8; font-size: 14px;');
console.log('%cDeveloped with ❤️ for better healthcare', 'color: #6C757D; font-size: 12px;');
