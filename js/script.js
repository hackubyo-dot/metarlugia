/**
 * ==========================================================================
 * PROJECT: LEONARDO SERRA SHOP - V9 SUPREME INDUSTRIAL ENGINE
 * VERSION: 9.5 - ULTRA FINAL EDITION (FULL ARCHITECTURE)
 * ENGINEER: FRONTEND SOLUTIONS ARCHITECT (GOD LEVEL)
 * 
 * JAVASCRIPT SYSTEMS:
 * - DEEP THEME ENGINE (LocalStorage Persistence + Multi-button Sync)
 * - INDUSTRIAL CLOCK & DATE (Real-time Sidebar Widgets)
 * - LERP MAGNETIC CURSOR (High-Fidelity Desktop Interaction)
 * - SIDEBAR MOBILE CONTROLLER (Video-BG + Lock Scroll Logic)
 * - TECHNICAL WHATSAPP FORMATTER (Industrial Query Generator)
 * - INTERSECTION OBSERVER (Hardware Accelerated Scroll Reveal)
 * - DYNAMIC TABS & EXPERT INTERACTION
 * ==========================================================================
 */

"use strict";

const V9IndustrialEngine = (function() {

    // --- 1. ESTADO GLOBAL PRIVADO (Single Source of Truth) ---
    const _state = {
        isLoaded: false,
        theme: localStorage.getItem('v9_theme') || 'dark',
        sidebarActive: false,
        lastScroll: 0,
        currentSlide: 0,
        whatsappNumber: "244939717295",
        isMobile: window.innerWidth < 992,
        startTime: Date.now()
    };

    // --- 2. CACHE DE ELEMENTOS DA DOM (Performance Superior) ---
    const _ui = {
        html: document.documentElement,
        body: document.body,
        preloader: document.getElementById('v9Preloader'),
        loadFill: document.getElementById('v9LoadFill'),
        cursor: document.getElementById('v9Cursor'),
        cursorCircle: document.querySelector('.v9-cursor-circle'),
        cursorDot: document.querySelector('.v9-cursor-dot'),
        navbar: document.getElementById('v9Navbar'),
        sidebar: document.getElementById('v9Sidebar'),
        sidebarOverlay: document.getElementById('v9Overlay'),
        sidebarClose: document.getElementById('v9SidebarClose'),
        sidebarOpen: document.getElementById('v9SidebarOpen'),
        themeToggle: document.getElementById('darkModeBtn'),
        sidebarThemeBtn: document.getElementById('sidebarModeToggle'),
        sidebarTime: document.getElementById('sidebarTime'),
        sidebarDate: document.getElementById('sidebarDate'),
        heroSlides: document.querySelectorAll('.v9-hero-slide'),
        heroDots: document.querySelectorAll('.v9-hero-dots .dot'),
        tabBtns: document.querySelectorAll('.v9-tab-btn'),
        expertItems: document.querySelectorAll('.v9-expert-names li'),
        contactForm: document.getElementById('v9WhatsAppForm'),
        animateElements: document.querySelectorAll('.animate-on-scroll'),
        loadItems: document.querySelectorAll('.animate-on-load'),
        yearSpan: document.getElementById('currentYear')
    };

    // --- 3. MÉTODOS DE UTILIDADE (Logs e Helpers) ---
    const _log = (msg, type = 'info') => {
        const colors = { 
            info: '#ff6a00', 
            success: '#00ff00', 
            error: '#ff0000', 
            system: '#ffffff' 
        };
        console.log(
            `%c[V9-ENGINE]%c ${msg}`, 
            `color: ${colors[type]}; font-weight: 900; background: #000; padding: 2px 5px; border-radius: 3px;`, 
            `color: #fff; background: #222; padding: 2px 5px; border-radius: 3px;`
        );
    };

    // --- 4. SISTEMA DE RELÓGIO E DATA (SIDEBAR WIDGET) ---
    const _initClockSystem = () => {
        const updateClock = () => {
            const now = new Date();
            
            // Atualiza Hora
            if (_ui.sidebarTime) {
                _ui.sidebarTime.textContent = now.toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
            }

            // Atualiza Data
            if (_ui.sidebarDate) {
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                _ui.sidebarDate.textContent = now.toLocaleDateString('pt-BR', options).toUpperCase();
            }
        };

        setInterval(updateClock, 1000);
        updateClock();
        _log("Sistema de Relógio Industrial Sincronizado.", "info");
    };

    // --- 5. THEME ENGINE (MODO CLARO E DARK FULL) ---
    const _initThemeEngine = () => {
        const applyTheme = (theme) => {
            _ui.html.setAttribute('data-theme', theme);
            
            if (theme === 'light') {
                _ui.body.classList.add('light-mode');
                _ui.body.classList.remove('dark-mode');
            } else {
                _ui.body.classList.add('dark-mode');
                _ui.body.classList.remove('light-mode');
            }
            
            localStorage.setItem('v9_theme', theme);
            _state.theme = theme;
            _log(`Switching Theme to: ${theme.toUpperCase()}`, 'system');
        };

        // Aplicação Inicial Baseada no LocalStorage
        applyTheme(_state.theme);

        // Handler para Botão da Nav
        if (_ui.themeToggle) {
            _ui.themeToggle.addEventListener('click', () => {
                const nextTheme = _state.theme === 'dark' ? 'light' : 'dark';
                applyTheme(nextTheme);
            });
        }

        // Handler para Botão da Sidebar Mobile
        if (_ui.sidebarThemeBtn) {
            _ui.sidebarThemeBtn.addEventListener('click', () => {
                const nextTheme = _state.theme === 'dark' ? 'light' : 'dark';
                applyTheme(nextTheme);
            });
        }
    };

    // --- 6. INDUSTRIAL PRELOADER (STATE MANAGEMENT) ---
    const _initPreloader = () => {
        let progress = 0;
        const interval = setInterval(() => {
            // Incremento randômico para simular checagem de hardware
            progress += Math.floor(Math.random() * 12) + 1;
            
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                _revealSite();
            }

            if (_ui.loadFill) _ui.loadFill.style.width = `${progress}%`;
        }, 100);
    };

    const _revealSite = () => {
        if (_ui.preloader) {
            _ui.preloader.style.opacity = '0';
            _ui.preloader.style.visibility = 'hidden';
            setTimeout(() => _ui.preloader.remove(), 800); // Remove da DOM após fade
        }
        _ui.body.classList.add('v9-ready');
        _state.isLoaded = true;
        
        // Disparar animações de carregamento inicial (Hero Section)
        _ui.loadItems.forEach((el, index) => {
            setTimeout(() => el.classList.add('animate-active'), index * 180);
        });

        _log("Site Fully Loaded & Revealed.", "success");
    };

    // --- 7. LERP CURSOR ENGINE (Linear Interpolation) ---
    const _initCursor = () => {
        // Desativar em touch screens ou mobile para performance
        if ('ontouchstart' in window || window.innerWidth < 992) {
            if (_ui.cursor) _ui.cursor.style.display = 'none';
            return;
        }

        let mX = 0, mY = 0; // Posição do Mouse
        let cX = 0, cY = 0; // Posição do Círculo

        window.addEventListener('mousemove', (e) => {
            mX = e.clientX;
            mY = e.clientY;
            
            // Dot instantâneo
            if (_ui.cursorDot) {
                _ui.cursorDot.style.left = `${mX}px`;
                _ui.cursorDot.style.top = `${mY}px`;
            }
        });

        const renderCursor = () => {
            // LERP: valor += (alvo - valor) * suavidade
            cX += (mX - cX) * 0.15;
            cY += (mY - cY) * 0.15;

            if (_ui.cursorCircle) {
                _ui.cursorCircle.style.left = `${cX}px`;
                _ui.cursorCircle.style.top = `${cY}px`;
            }

            requestAnimationFrame(renderCursor);
        };
        renderCursor();

        // Estados de Hover em Elementos Interativos
        const interactives = 'a, button, .v9-feat-card, .v9-sol-card, .v9-gallery-item, input, select, textarea';
        document.querySelectorAll(interactives).forEach(el => {
            el.addEventListener('mouseenter', () => {
                _ui.cursorCircle.style.width = '75px';
                _ui.cursorCircle.style.height = '75px';
                _ui.cursorCircle.style.backgroundColor = 'rgba(255, 106, 0, 0.12)';
                _ui.cursorCircle.style.borderColor = 'transparent';
                _ui.cursorDot.style.transform = 'translate(-50%, -50%) scale(2.5)';
            });
            el.addEventListener('mouseleave', () => {
                _ui.cursorCircle.style.width = '40px';
                _ui.cursorCircle.style.height = '40px';
                _ui.cursorCircle.style.backgroundColor = 'transparent';
                _ui.cursorCircle.style.borderColor = 'var(--v9-primary)';
                _ui.cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        });
    };

    // --- 8. SIDEBAR & NAVIGATION (MOBILE FIRST) ---
    const _initNavigation = () => {
        const toggleSidebar = (isActive) => {
            _state.sidebarActive = isActive;
            if (isActive) {
                _ui.sidebar.classList.add('active');
                _ui.sidebarOverlay.classList.add('active');
                _ui.body.style.overflow = 'hidden'; // Trava Scroll
                _log("Sidebar Opened.", "info");
            } else {
                _ui.sidebar.classList.remove('active');
                _ui.sidebarOverlay.classList.remove('active');
                _ui.body.style.overflow = ''; // Destrava Scroll
                _log("Sidebar Closed.", "info");
            }
        };

        if (_ui.sidebarOpen) _ui.sidebarOpen.addEventListener('click', () => toggleSidebar(true));
        if (_ui.sidebarClose) _ui.sidebarClose.addEventListener('click', () => toggleSidebar(false));
        if (_ui.sidebarOverlay) _ui.sidebarOverlay.addEventListener('click', () => toggleSidebar(false));

        // Fechar ao clicar em links do menu
        document.querySelectorAll('.v9-sidebar-menu a').forEach(link => {
            link.addEventListener('click', () => toggleSidebar(false));
        });

        // Navbar Scroll Logic (Fundo e Hide/Show)
        window.addEventListener('scroll', () => {
            const currentST = window.pageYOffset || document.documentElement.scrollTop;
            
            // Background morphing
            if (currentST > 80) {
                _ui.navbar.classList.add('scrolled');
            } else {
                _ui.navbar.classList.remove('scrolled');
            }

            // Auto-hide ao descer rápido
            if (currentST > _state.lastScroll && currentST > 600) {
                _ui.navbar.style.transform = "translateY(-100%)";
            } else {
                _ui.navbar.style.transform = "translateY(0)";
            }

            _state.lastScroll = currentST <= 0 ? 0 : currentST;
        }, { passive: true });
    };

    // --- 9. HERO SLIDER ENGINE ---
    const _initHeroSlider = () => {
        if (!_ui.heroSlides.length) return;

        const updateSlides = (index) => {
            _ui.heroSlides.forEach(s => s.classList.remove('active'));
            _ui.heroDots.forEach(d => d.classList.remove('active'));
            
            _ui.heroSlides[index].classList.add('active');
            _ui.heroDots[index].classList.add('active');
            _state.currentSlide = index;
        };

        _ui.heroDots.forEach((dot, i) => {
            dot.addEventListener('click', () => updateSlides(i));
        });

        // Loop Automático (8 segundos)
        setInterval(() => {
            if (!_state.sidebarActive) {
                let next = (_state.currentSlide + 1) % _ui.heroSlides.length;
                updateSlides(next);
            }
        }, 8000);
    };

    // --- 10. WHATSAPP TECHNICAL FORM ENGINE ---
    const _initWhatsAppForm = () => {
        if (!_ui.contactForm) return;

        _ui.contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const btn = this.querySelector('button');
            const data = {
                nome: document.getElementById('waName').value.trim(),
                email: document.getElementById('waEmail').value.trim(),
                servico: document.getElementById('waSubject').value,
                desc: document.getElementById('waMessage').value.trim()
            };

            // Feedback Industrial
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-gear fa-spin"></i> ENCRIPTANDO DADOS...';
            btn.style.pointerEvents = "none";
            btn.style.opacity = "0.7";

            // Formatação de Mensagem Técnica
            const message = encodeURIComponent(
                `*⚙️ SOLICITAÇÃO DE ORÇAMENTO - V9 SUPREME*\n` +
                `------------------------------------\n` +
                `*CLIENTE:* ${data.nome}\n` +
                `*E-MAIL:* ${data.email}\n` +
                `*CATEGORIA:* ${data.servico}\n\n` +
                `*DESCRIÇÃO TÉCNICA:* \n${data.desc}\n` +
                `------------------------------------\n` +
                `_Gerado por Leonardo Serra Shop Online Engine_`
            );

            // Redirecionamento após processamento fake
            setTimeout(() => {
                window.open(`https://wa.me/${_state.whatsappNumber}?text=${message}`, '_blank');
                btn.innerHTML = 'DADOS TRANSMITIDOS <i class="fa-solid fa-check"></i>';
                btn.style.background = "#25d366";
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.pointerEvents = "auto";
                    btn.style.opacity = "1";
                    btn.style.background = "";
                    this.reset();
                }, 3000);
            }, 1800);
        });
    };

    // --- 11. SCROLL REVEAL ENGINE (INTERSECTION OBSERVER) ---
    const _initScrollReveal = () => {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        };

        const revealCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const delay = el.getAttribute('data-delay') || "0s";
                    
                    setTimeout(() => {
                        el.classList.add('animate-active');
                    }, parseFloat(delay) * 1000);

                    observer.unobserve(el); // Anima apenas uma vez
                }
            });
        };

        const observer = new IntersectionObserver(revealCallback, observerOptions);
        _ui.animateElements.forEach(el => observer.observe(el));
    };

    // --- 12. INDUSTRIAL TABS ENGINE (ABOUT SECTION) ---
    const _initTabs = () => {
        _ui.tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                _ui.tabBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const target = this.getAttribute('data-tab');
                const pane = document.getElementById('pane-mission');
                
                const data = {
                    mission: {
                        p: "Desde a Revolução Industrial moderna, a manufatura de precisão tornou-se o motor da economia global. Nós aplicamos essa excelência em cada projeto executado.",
                        li: ["Suporte Técnico Permanente", "Engenheiros de Materiais Seniores", "Equipa Certificada de Montagem"]
                    },
                    vision: {
                        p: "Ser a maior referência em metalurgia futurista de Angola, unindo design de vanguarda e segurança estrutural absoluta para grandes obras nacionais.",
                        li: ["Inovação Tecnológica", "Sustentabilidade em Aço", "Expansão Continental"]
                    },
                    history: {
                        p: "Fundada por Leonardo dos Santos em 2020, o que começou como uma oficina de precisão transformou-se em uma potência industrial com legado de robustez.",
                        li: ["5 Anos de Sucesso", "Pioneiros no Ramo", "Mais de 500 Obras"]
                    }
                };

                // Transição de Fade
                pane.style.opacity = '0';
                setTimeout(() => {
                    pane.querySelector('p').textContent = data[target].p;
                    const items = pane.querySelectorAll('li');
                    data[target].li.forEach((txt, i) => {
                        if (items[i]) items[i].innerHTML = `<i class="fa-solid fa-circle-check"></i> ${txt}`;
                    });
                    pane.style.opacity = '1';
                }, 300);
            });
        });
    };

    // --- 13. UTILITIES & FINAL TOUCHES ---
    const _initUtils = () => {
        // Atualiza Ano do Footer
        if (_ui.yearSpan) _ui.yearSpan.textContent = new Date().getFullYear();

        // Expert List Hover
        _ui.expertItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                _ui.expertItems.forEach(i => i.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // Smooth Scroll para Âncoras
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetID = this.getAttribute('href');
                if (targetID === '#') return;
                
                const targetEl = document.querySelector(targetID);
                if (targetEl) {
                    e.preventDefault();
                    const offset = 80;
                    const pos = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
                    window.scrollTo({ top: pos, behavior: 'smooth' });
                }
            });
        });
    };

    // --- 14. BOOTSTRAP (IGNITION) ---
    return {
        ignite: function() {
            _log("Igniting V9 Supreme Engine...", "info");
            
            _initClockSystem();
            _initThemeEngine();
            _initPreloader();
            _initCursor();
            _initNavigation();
            _initHeroSlider();
            _initWhatsAppForm();
            _initScrollReveal();
            _initTabs();
            _initUtils();

            _log("All Systems Operational. Ready for Production.", "success");
        }
    };

})();

// DISPARO OFICIAL
(function() {
        const sidebar = document.getElementById('v9Sidebar');
        const overlay = document.getElementById('v9Overlay');
        const openBtn = document.getElementById('v9SidebarOpen'); // Referência do index.html
        const closeBtn = document.getElementById('v9SidebarClose');
        const themeBtn = document.getElementById('sidebarThemeToggle');
        
        // 1. FUNÇÃO ABRIR/FECHAR
        const toggleSidebar = () => {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
        };

        if(openBtn) openBtn.addEventListener('click', toggleSidebar);
        if(closeBtn) closeBtn.addEventListener('click', toggleSidebar);
        if(overlay) overlay.addEventListener('click', toggleSidebar);

        // Fechar ao clicar em um link
        const navLinks = sidebar.querySelectorAll('.v9-sidebar-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', toggleSidebar);
        });

        // 2. RELÓGIO ATÔMICO
        function updateClock() {
            const now = new Date();
            const timeEl = document.getElementById('sidebarTime');
            const dateEl = document.getElementById('sidebarDate');
            
            if(timeEl) timeEl.textContent = now.toLocaleTimeString('pt-BR');
            if(dateEl) {
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                dateEl.textContent = now.toLocaleDateString('pt-BR', options).toUpperCase();
            }
        }
        setInterval(updateClock, 1000);
        updateClock();

        // 3. ALTERNAR TEMA
        if(themeBtn) {
            themeBtn.addEventListener('click', () => {
                const html = document.documentElement;
                const currentTheme = html.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                html.setAttribute('data-theme', newTheme);
                localStorage.setItem('v9_theme', newTheme);
                
                // Sincroniza classes no body se necessário
                document.body.classList.remove('dark-mode', 'light-mode');
                document.body.classList.add(newTheme + '-mode');
            });
        }
    })();
    
document.addEventListener('DOMContentLoaded', V9IndustrialEngine.ignite);

/**
 * [FINISH] MASTER SCRIPT V9 FULL - LEONARDO SERRA SHOP
 */