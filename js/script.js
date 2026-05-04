/**
 * ==========================================================================
 * PROJECT: LEONARDO SERRA SHOP - V10 ULTRA SUPREME INDUSTRIAL ENGINE
 * VERSION: 10.0.1 - HYPER FULL PRODUCTION READY (ZERO OMISSION)
 * ENGINEER: FRONTEND SOLUTIONS ARCHITECT (GOD LEVEL)
 * 
 * JAVASCRIPT SYSTEMS:
 * - ATOMIC THEME ENGINE (LocalStorage Persistence + Dual-Button Sync)
 * - INDUSTRIAL REAL-TIME CLOCK (Sidebar Atomic Precise Widget)
 * - SIDEBAR MOBILE CONTROLLER (Scroll-Lock + Staggered Animation Sync)
 * - TECHNICAL WHATSAPP GENERATOR (Industrial Lead Template Engine)
 * - HARDWARE ACCELERATED SCROLL REVEAL (Advanced Intersection Observer)
 * - DYNAMIC INDUSTRIAL TABS (About Section Content Engine)
 * - NAVBAR MORPHING & STICKY ENGINE (High Performance Scroll logic)
 * - PRELOADER ATOMIC SEQUENCE (Hardware Simulation & Site Reveal)
 * ==========================================================================
 */

"use strict";

const V10SupremeEngine = (function() {

    // --- 1. ESTADO GLOBAL PRIVADO (Single Source of Truth) ---
    const _state = {
        isLoaded: false,
        theme: localStorage.getItem('v9_theme') || 'dark',
        sidebarActive: false,
        lastScroll: 0,
        whatsappNumber: "244939717295",
        currentYear: new Date().getFullYear(),
        isMobile: window.innerWidth < 992,
        loadProgress: 0,
        startTime: Date.now()
    };

    // --- 2. CACHE DE ELEMENTOS DA DOM (Performance Superior) ---
    const _ui = {
        html: document.documentElement,
        body: document.body,
        preloader: document.getElementById('v9Preloader'),
        loadFill: document.getElementById('v9LoadFill'),
        loadPerc: document.getElementById('v9LoadPerc'),
        header: document.getElementById('v9Header'),
        navbar: document.getElementById('v9Navbar'),
        sidebar: document.getElementById('v9Sidebar'),
        sidebarOverlay: document.getElementById('v9Overlay'),
        sidebarClose: document.getElementById('v9SidebarClose'),
        sidebarOpen: document.getElementById('v9SidebarOpen'),
        // Coleção de botões de tema (Header e Sidebar)
        themeButtons: [
            document.getElementById('darkModeBtn'), 
            document.getElementById('sidebarThemeToggle')
        ],
        sidebarTime: document.getElementById('sidebarTime'),
        sidebarDate: document.getElementById('sidebarDate'),
        tabButtons: document.querySelectorAll('.v9-tab-trigger'),
        tabPanes: document.querySelectorAll('.v9-pane-content'),
        contactForm: document.getElementById('v9WhatsAppForm'),
        animateElements: document.querySelectorAll('.animate-on-scroll'),
        loadItems: document.querySelectorAll('.animate-on-load'),
        yearDisplay: document.getElementById('currentYear'),
        heroDots: document.querySelectorAll('.v9-dot-item')
    };

    // --- 3. THEME ENGINE (SINCRONIA TOTAL DARK/LIGHT) ---
    /**
     * Gerencia a alternância de cores através de Atributos de Dados.
     * Salva a preferência no LocalStorage e aplica inversão atômica de variáveis CSS.
     */
    const _initThemeEngine = () => {
        const applyTheme = (targetTheme) => {
            // Aplica Atributo no HTML (Dispara as variáveis do CSS)
            _ui.html.setAttribute('data-theme', targetTheme);
            
            // Persistência
            localStorage.setItem('v9_theme', targetTheme);
            _state.theme = targetTheme;
            
            // Log Industrial
            console.log(`%c[V10-THEME]%c Sistema Industrial operando em modo: ${targetTheme.toUpperCase()}`, "color: #ff6a00; font-weight: 900;", "color: #fff;");
        };

        // Aplicação Inicial (Anti-Flicker)
        applyTheme(_state.theme);

        // Registro de Eventos em todos os botões de tema
        _ui.themeButtons.forEach(btn => {
            if (btn) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const newTheme = _state.theme === 'dark' ? 'light' : 'dark';
                    applyTheme(newTheme);
                });
            }
        });
    };

    // --- 4. INDUSTRIAL REAL-TIME CLOCK (SIDEBAR WIDGET) ---
    /**
     * Mantém um relógio atômico digital na sidebar com data formatada para Angola.
     */
    const _initClockSystem = () => {
        const updateClock = () => {
            const now = new Date();
            
            // Atualização da Hora (HH:MM:SS)
            if (_ui.sidebarTime) {
                _ui.sidebarTime.textContent = now.toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
            }

            // Atualização da Data Industrial
            if (_ui.sidebarDate) {
                const options = { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                };
                let dateString = now.toLocaleDateString('pt-BR', options).toUpperCase();
                _ui.sidebarDate.textContent = dateString;
            }
        };

        // Intervalo Atômico de 1 segundo
        setInterval(updateClock, 1000);
        updateClock();
    };

    // --- 5. PRELOADER & LOADING SEQUENCE ---
    /**
     * Simula o carregamento de módulos industriais e libera a interface.
     */
    const _initPreloader = () => {
        const loadingInterval = setInterval(() => {
            // Incremento calculado para realismo visual
            _state.loadProgress += Math.floor(Math.random() * 12) + 2;
            
            if (_state.loadProgress >= 100) {
                _state.loadProgress = 100;
                clearInterval(loadingInterval);
                _revealInterface();
            }

            // Atualiza UI do Preloader
            if (_ui.loadFill) _ui.loadFill.style.width = `${_state.loadProgress}%`;
            if (_ui.loadPerc) _ui.loadPerc.textContent = `${_state.loadProgress}%`;

        }, 110);
    };

    const _revealInterface = () => {
        if (_ui.preloader) {
            _ui.preloader.style.opacity = '0';
            _ui.preloader.style.visibility = 'hidden';
            
            // Remove da DOM após a transição para liberar recursos de hardware
            setTimeout(() => {
                _ui.preloader.remove();
            }, 800);
        }

        // Garante opacidade do corpo
        _ui.body.style.opacity = '1';
        _ui.body.classList.add('v9-ready');
        _state.isLoaded = true;
        
        // Disparo das animações de entrada (Hero Elements)
        _ui.loadItems.forEach((el, index) => {
            setTimeout(() => el.classList.add('animate-active'), index * 180);
        });
    };

    // --- 6. SIDEBAR & NAVIGATION SYSTEM ---
    /**
     * Gerencia a navegação mobile, travas de scroll e overlays.
     */
    const _initNavigation = () => {
        const toggleSidebar = (isActive) => {
            _state.sidebarActive = isActive;
            
            if (isActive) {
                _ui.sidebar.classList.add('active');
                _ui.sidebarOverlay.classList.add('active');
                _ui.body.style.overflow = 'hidden'; // Lock Scroll
            } else {
                _ui.sidebar.classList.remove('active');
                _ui.sidebarOverlay.classList.remove('active');
                _ui.body.style.overflow = ''; // Unlock Scroll
            }
        };

        // Gatilhos de Abertura e Fechamento
        if (_ui.sidebarOpen) _ui.sidebarOpen.addEventListener('click', () => toggleSidebar(true));
        if (_ui.sidebarClose) _ui.sidebarClose.addEventListener('click', () => toggleSidebar(false));
        if (_ui.sidebarOverlay) _ui.sidebarOverlay.addEventListener('click', () => toggleSidebar(false));

        // Auto-fechamento ao clicar em links (Otimização Mobile)
        const menuLinks = _ui.sidebar.querySelectorAll('.v9-sidebar-menu-list a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Pequeno delay para permitir o início do smooth scroll antes de fechar
                setTimeout(() => toggleSidebar(false), 150);
            });
        });

        // NAVBAR STICKY ENGINE (High Performance Scroll Listener)
        window.addEventListener('scroll', () => {
            const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (currentScrollTop > 100) {
                _ui.navbar.classList.add('v9-sticky');
            } else {
                _ui.navbar.classList.remove('v9-sticky');
            }

            _state.lastScroll = currentScrollTop <= 0 ? 0 : currentScrollTop;
        }, { passive: true });
    };

    // --- 7. DYNAMIC TABS ENGINE (SOBRE NÓS) ---
    /**
     * Sistema de troca de conteúdo industrial por abas.
     */
    const _initTabs = () => {
        _ui.tabButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const targetID = this.getAttribute('data-target');

                // Reseta estados dos botões
                _ui.tabButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                // Reseta e ativa painéis
                _ui.tabPanes.forEach(pane => {
                    pane.classList.remove('active');
                    if (pane.id === targetID) {
                        pane.classList.add('active');
                    }
                });
            });
        });
    };

    // --- 8. WHATSAPP TECHNICAL LEAD ENGINE ---
    /**
     * Formata os dados do formulário em um relatório industrial para o WhatsApp.
     */
    const _initWhatsAppForm = () => {
        if (!_ui.contactForm) return;

        _ui.contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const btnSubmit = this.querySelector('.v9-btn-submit-stamped');
            const formData = {
                nome: document.getElementById('waName').value.trim(),
                email: document.getElementById('waEmail').value.trim(),
                categoria: document.getElementById('waSubject').value,
                mensagem: document.getElementById('waMessage').value.trim()
            };

            // Feedback Visual de Processamento
            const originalText = btnSubmit.innerHTML;
            btnSubmit.innerHTML = '<i class="fa-solid fa-microchip fa-spin"></i> TRANSMITINDO DADOS TÉCNICOS...';
            btnSubmit.style.pointerEvents = 'none';

            // Formatação do Template Industrial
            const waMessage = encodeURIComponent(
                `*⚙️ REQUISIÇÃO TÉCNICA - LEONARDO SERRA SHOP*\n` +
                `----------------------------------------\n` +
                `*👤 CLIENTE:* ${formData.nome}\n` +
                `*📧 EMAIL:* ${formData.email}\n` +
                `*🛠️ PROJETO:* ${formData.categoria}\n\n` +
                `*📝 DETALHES TÉCNICOS:* \n${formData.mensagem}\n` +
                `----------------------------------------\n` +
                `_Sistema V10 Ultra Supreme - Luanda_`
            );

            // Redirecionamento após Simulação de Encriptação
            setTimeout(() => {
                window.open(`https://wa.me/${_state.whatsappNumber}?text=${waMessage}`, '_blank');
                
                btnSubmit.innerHTML = 'DADOS ENVIADOS COM SUCESSO! <i class="fa-solid fa-check"></i>';
                
                setTimeout(() => {
                    btnSubmit.innerHTML = originalText;
                    btnSubmit.style.pointerEvents = 'auto';
                    this.reset();
                }, 3000);
            }, 1800);
        });
    };

    // --- 9. SCROLL REVEAL (INTERSECTION OBSERVER ENGINE) ---
    /**
     * Hardware Accelerated animations disparadas pela rolagem.
     */
    const _initScrollReveal = () => {
        const revealOptions = {
            threshold: 0.15,
            rootMargin: "0px 0px -60px 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const targetEl = entry.target;
                    const animationDelay = targetEl.getAttribute('data-delay') || "0s";
                    
                    setTimeout(() => {
                        targetEl.classList.add('animate-active');
                    }, parseFloat(animationDelay) * 1000);

                    // Desativar observação para este elemento (Animação única por visita)
                    observer.unobserve(targetEl);
                }
            });
        }, revealOptions);

        _ui.animateElements.forEach(el => observer.observe(el));
    };

    // --- 10. UTILITIES & REFINEMENTS ---
    /**
     * Handlers gerais e polimentos de UX.
     */
    const _initUtils = () => {
        // Atualização do Ano no Rodapé
        if (_ui.yearDisplay) _ui.yearDisplay.textContent = _state.currentYear;

        // Smooth Scroll para Âncoras com Offset Matemático
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetID = this.getAttribute('href');
                if (targetID === '#') return;
                
                const targetElement = document.querySelector(targetID);
                if (targetElement) {
                    e.preventDefault();
                    // Offset de 90px para compensar a navbar sticky
                    const offsetPos = targetElement.getBoundingClientRect().top + window.pageYOffset - 90;
                    
                    window.scrollTo({
                        top: offsetPos,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Hero Nav Dots (Simulação de troca de slide visual)
        _ui.heroDots.forEach(dot => {
            dot.addEventListener('click', function() {
                _ui.heroDots.forEach(d => d.classList.remove('active'));
                this.classList.add('active');
            });
        });
    };

    // --- 11. BOOTSTRAP (IGNITION ENGINE) ---
    return {
        ignite: function() {
            // Log de Boas-vindas Industrial
            console.log("%c[V10-ENGINE]%c Motor Industrial Supreme Operacional.", "color: #ff6a00; font-weight: 900; background: #000; padding: 5px 10px;", "color: #fff;");
            
            // Inicialização Sequencial
            _initThemeEngine();
            _initClockSystem();
            _initPreloader();
            _initNavigation();
            _initTabs();
            _initWhatsAppForm();
            _initScrollReveal();
            _initUtils();
        }
    };

})();

// DISPARO OFICIAL DO SISTEMA APÓS DOM READY
document.addEventListener('DOMContentLoaded', V10SupremeEngine.ignite);

/**
 * [FINAL DO SCRIPT]
 * ARQUITETURA LEONARDO SERRA SHOP V10 - ROBUSTEZA E PERFEIÇÃO GARANTIDAS.
 */
