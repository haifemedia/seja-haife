document.addEventListener('DOMContentLoaded', () => {
    initLoadingScreen();
    initCursor();
    initScrollProgress();
    initHeader();
    initMobileMenu();
    initCarousel();
    initScrollAnimations();
    initCounters();
    initWhatsAppFloat();
    initContactForm();
    initSmoothScroll();
    initMagneticButtons();
});

function initLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        document.body.classList.remove('loading');
    }, 2000);
}

function initCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    if (!cursor || !follower) return;
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 4 + 'px';
        cursor.style.top = e.clientY - 4 + 'px';
        follower.style.left = e.clientX - 20 + 'px';
        follower.style.top = e.clientY - 20 + 'px';
    });
    
    const interactiveElements = document.querySelectorAll('a, button, .carousel-btn, .dot');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            follower.classList.add('hover');
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            follower.classList.remove('hover');
        });
    });
}

function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');
    
    function updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
    }
    
    window.addEventListener('scroll', updateProgress);
    updateProgress();
}

function initHeader() {
    const header = document.getElementById('header');
    
    function updateHeader() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', updateHeader);
    updateHeader();
}

function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    
    if (!menuToggle || !mobileMenu) return;
    
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

function initCarousel() {
    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const dots = document.querySelectorAll('.dot');
    const progressBar = document.getElementById('progressBar');
    
    if (!track) return;
    
    const slides = track.querySelectorAll('.carousel-slide');
    let currentIndex = 0;
    let autoplayInterval;
    let progressInterval;
    let isHovering = false;
    const autoplayDelay = 5000;
    
    function goToSlide(index) {
        currentIndex = index;
        if (currentIndex < 0) currentIndex = slides.length - 1;
        if (currentIndex >= slides.length) currentIndex = 0;
        
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
        
        resetProgress();
    }
    
    function nextSlide() {
        goToSlide(currentIndex + 1);
    }
    
    function prevSlide() {
        goToSlide(currentIndex - 1);
    }
    
    function startAutoplay() {
        let progress = 0;
        const increment = 100 / (autoplayDelay / 50);
        
        progressInterval = setInterval(() => {
            if (!isHovering) {
                progress += increment;
                progressBar.style.width = `${progress}%`;
                
                if (progress >= 100) {
                    progress = 0;
                    nextSlide();
                }
            }
        }, 50);
    }
    
    function resetProgress() {
        progress = 0;
        progressBar.style.width = '0%';
    }
    
    let progress = 0;
    
    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetProgress();
    });
    
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetProgress();
    });
    
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            goToSlide(parseInt(dot.dataset.index));
            resetProgress();
        });
    });
    
    const carousel = track.parentElement;
    carousel.addEventListener('mouseenter', () => { isHovering = true; });
    carousel.addEventListener('mouseleave', () => { isHovering = false; });
    
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) nextSlide();
        if (touchEndX - touchStartX > 50) prevSlide();
    }, { passive: true });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });
    
    startAutoplay();
}

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, delay);
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.dataset.count);
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(easeOutQuart * target);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }
    
    requestAnimationFrame(update);
}

function initWhatsAppFloat() {
    const whatsappFloat = document.getElementById('whatsappFloat');
    const whatsappNumber = '5547992170977';
    
    if (whatsappFloat) {
        const message = encodeURIComponent('Oii! Vi no site da Haife Media e gostaria de mais informações');
        whatsappFloat.href = `https://wa.me/${whatsappNumber}?text=${message}`;
    }
}

function initContactForm() {
    const form = document.getElementById('contact-form');
    
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const message = document.getElementById('message').value;
        const whatsappNumber = '5547992170977';
        
        let whatsappMessage = `Olá, Haife Media! 👋\n\nMeu nome é *${name}*.\n\nGostaria de solicitar um orçamento.`;
        
        if (message.trim() !== '') {
            whatsappMessage += `\n\n*Mensagem:*\n${message}`;
        }
        
        whatsappMessage += `\n\n---\nEnviado via site.`;
        
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
        
        window.open(whatsappUrl, '_blank');
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'submit_form', {
                'event_category': 'Contact',
                'event_label': 'WhatsApp Form Submission'
            });
        }
    });
}

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initMagneticButtons() {
    const magneticButtons = document.querySelectorAll('.btn-magnetic, .btn-primary-magnetic');
    
    magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}
