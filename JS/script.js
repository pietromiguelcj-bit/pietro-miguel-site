/**
 * ========================================
 * PIETRO MIGUEL - LANDING PAGE
 * JavaScript Moderno e Otimizado
 * ========================================
 * Funcionalidades:
 * - Dark/Light Mode com persistência
 * - Menu Mobile Responsivo
 * - Smooth Scroll
 * - Animações ao scroll
 * - Header com efeito scroll
 * - Botão WhatsApp flutuante
 * - Ano dinâmico no footer
 */

(function() {
    'use strict';

    // ========================================
    // 1. TEMA DARK/LIGHT
    // ========================================
    const ThemeManager = {
        toggle: null,
        html: null,
        
        init() {
            this.toggle = document.getElementById('themeToggle');
            this.html = document.documentElement;
            
            if (!this.toggle || !this.html) return;
            
            // Carregar tema salvo ou preferência do sistema
            const savedTheme = this.getSavedTheme();
            this.applyTheme(savedTheme);
            
            // Event listener
            this.toggle.addEventListener('click', () => this.toggleTheme());
            
            // Observar mudança de preferência do sistema
            this.watchSystemPreference();
        },
        
        getSavedTheme() {
            const saved = localStorage.getItem('pietro-theme');
            if (saved) return saved;
            
            // Verificar preferência do sistema
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            return prefersDark ? 'dark' : 'light';
        },
        
        applyTheme(theme) {
            this.html.setAttribute('data-theme', theme);
            localStorage.setItem('pietro-theme', theme);
            
            // Atualizar cor da theme-color meta tag
            const metaThemeColor = document.querySelector('meta[name="theme-color"]');
            if (metaThemeColor) {
                metaThemeColor.setAttribute('content', theme === 'dark' ? '#0f172a' : '#0a1929');
            }
        },
        
        toggleTheme() {
            const current = this.html.getAttribute('data-theme');
            const newTheme = current === 'dark' ? 'light' : 'dark';
            this.applyTheme(newTheme);
            
            // Feedback visual
            this.toggle.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.toggle.style.transform = '';
            }, 150);
        },
        
        watchSystemPreference() {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            mediaQuery.addEventListener('change', (e) => {
                // Só muda se não houver preferência salva
                if (!localStorage.getItem('pietro-theme')) {
                    this.applyTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    };

    // ========================================
    // 2. MENU MOBILE
    // ========================================
    const MobileMenu = {
        toggle: null,
        menu: null,
        links: null,
        
        init() {
            this.toggle = document.querySelector('.nav__toggle');
            this.menu = document.querySelector('.nav__menu');
            this.links = document.querySelectorAll('.nav__link');
            
            if (!this.toggle || !this.menu) return;
            
            this.toggle.addEventListener('click', () => this.toggleMenu());
            
            // Fechar menu ao clicar em link
            this.links.forEach(link => {
                link.addEventListener('click', () => this.closeMenu());
            });
            
            // Fechar menu ao clicar fora
            document.addEventListener('click', (e) => {
                if (!this.menu.contains(e.target) && !this.toggle.contains(e.target)) {
                    this.closeMenu();
                }
            });
            
            // Fechar menu ao pressionar ESC
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') this.closeMenu();
            });
        },
        
        toggleMenu() {
            const isActive = this.toggle.classList.contains('active');
            
            this.toggle.classList.toggle('active');
            this.menu.classList.toggle('active');
            this.toggle.setAttribute('aria-expanded', !isActive);
            
            // Prevenir scroll do body quando menu aberto
            document.body.style.overflow = isActive ? '' : 'hidden';
        },
        
        closeMenu() {
            this.toggle.classList.remove('active');
            this.menu.classList.remove('active');
            this.toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    };

    // ========================================
    // 3. SMOOTH SCROLL
    // ========================================
    const SmoothScroll = {
        init() {
            const links = document.querySelectorAll('a[href^="#"]');
            
            links.forEach(link => {
                link.addEventListener('click', (e) => this.handleScroll(e, link));
            });
        },
        
        handleScroll(e, link) {
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (!target) return;
            
            e.preventDefault();
            
            const headerOffset = document.querySelector('.header').offsetHeight;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
            // Atualizar URL sem scroll jump
            history.pushState(null, null, href);
        }
    };

    // ========================================
    // 4. HEADER SCROLL EFFECT
    // ========================================
    const HeaderScroll = {
        header: null,
        
        init() {
            this.header = document.querySelector('.header');
            if (!this.header) return;
            
            window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
        },
        
        handleScroll() {
            if (window.scrollY > 50) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }
        }
    };

    // ========================================
    // 5. ANIMAÇÕES AO SCROLL
    // ========================================
    const ScrollAnimations = {
        observer: null,
        
        init() {
            // Verificar suporte a Intersection Observer
            if (!('IntersectionObserver' in window)) {
                // Fallback para browsers antigos
                this.showAllElements();
                return;
            }
            
            this.observer = new IntersectionObserver(
                (entries) => this.handleIntersection(entries),
                {
                    threshold: 0.1,
                    rootMargin: '0px 0px -50px 0px'
                }
            );
            
            // Selecionar elementos para animar
            const elements = document.querySelectorAll(
                '.pricing-card, .service-card, .problem__item, .differential__item, .pricing-card-compact'
            );
            
            elements.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                this.observer.observe(el);
            });
        },
        
        handleIntersection(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    this.observer.unobserve(entry.target);
                }
            });
        },
        
        showAllElements() {
            const elements = document.querySelectorAll(
                '.pricing-card, .service-card, .problem__item, .differential__item'
            );
            elements.forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
        }
    };

    // ========================================
    // 6. BOTÃO WHATSAPP FLUTUANTE
    // ========================================
    const WhatsAppFloat = {
        button: null,
        
        init() {
            this.button = document.getElementById('whatsappFloat');
            if (!this.button) return;
            
            // Mostrar/esconder baseado no scroll
            window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
            
            // Efeito de clique
            this.button.addEventListener('click', () => this.handleClick());
        },
        
        handleScroll() {
            if (window.scrollY > 500) {
                this.button.style.opacity = '1';
                this.button.style.pointerEvents = 'auto';
            } else {
                this.button.style.opacity = '0.8';
            }
        },
        
        handleClick() {
            // Feedback visual
            this.button.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.button.style.transform = '';
            }, 150);
        }
    };

    // ========================================
    // 7. ANO DINÂMICO NO FOOTER
    // ========================================
    const DynamicYear = {
        init() {
            const yearElement = document.getElementById('year');
            if (yearElement) {
                yearElement.textContent = new Date().getFullYear();
            }
        }
    };

    // ========================================
    // 8. LAZY LOADING DE IMAGENS (Opcional)
    // ========================================
    const LazyLoad = {
        init() {
            if (!('loading' in HTMLImageElement.prototype)) {
                // Fallback para browsers sem suporte nativo
                const images = document.querySelectorAll('img[data-src]');
                images.forEach(img => {
                    img.src = img.dataset.src;
                });
            }
        }
    };

    // ========================================
    // 9. PERFORMANCE - DEBOUNCE/THROTTLE
    // ========================================
    const Utils = {
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        
        throttle(func, limit) {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        }
    };

    // ========================================
    // 10. INICIALIZAÇÃO
    // ========================================
    function init() {
        // Inicializar todos os módulos
        ThemeManager.init();
        MobileMenu.init();
        SmoothScroll.init();
        HeaderScroll.init();
        ScrollAnimations.init();
        WhatsAppFloat.init();
        DynamicYear.init();
        LazyLoad.init();
        
        // Console de boas-vindas para devs
        console.log('%c🚀 Pietro Miguel - Landing Page v3.0', 
            'font-size: 18px; font-weight: bold; color: #2563eb; background: #f0f9ff; padding: 10px; border-radius: 5px;');
        console.log('%c✅ Dark/Light Mode | ✅ Responsivo | ✅ SEO Otimizado', 
            'color: #22c55e; font-size: 14px;');
        console.log('%c💼 Vamos vender? https://wa.me/5531983596154', 
            'color: #25D366; font-size: 14px;');
        
        // Analytics de carregamento (opcional)
        if (window.performance) {
            const timing = window.performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            console.log(`%c⏱️ Página carregada em ${loadTime}ms`, 'color: #f59e0b;');
        }
    }

    // ========================================
    // 11. DOM READY
    // ========================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ========================================
    // 12. SERVICE WORKER (Opcional - PWA)
    // ========================================
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            // Descomente para ativar PWA
            // navigator.serviceWorker.register('/sw.js')
            //     .then(reg => console.log('SW registrado:', reg))
            //     .catch(err => console.log('SW falhou:', err));
        });
    }

})();   