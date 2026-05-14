/**
 * ============================================
 * LEONARDO SERRA SHOP - ULTRA PREMIUM ENGINE
 * VERSION: FINAL 2.0
 * ============================================
 */

(function() {
    'use strict';

    // ============================================
    // PRELOADER
    // ============================================
    const preloader = document.getElementById('preloader');
    const progressBar = document.getElementById('preloaderProgress');

    if (preloader && progressBar) {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15 + 5;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => {
                    preloader.classList.add('hide');
                    setTimeout(() => {
                        preloader.style.display = 'none';
                    }, 500);
                }, 500);
            }
            progressBar.style.width = `${Math.min(progress, 100)}%`;
        }, 150);
    }

    // ============================================
    // THEME ENGINE (DARK/LIGHT MODE)
    // ============================================
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;

    const savedTheme = localStorage.getItem('ls_theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('ls_theme', newTheme);
        });
    }

    // ============================================
    // HERO SLIDER (SWIPER)
    // ============================================
    const heroSlider = new Swiper('#heroSlider', {
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        }
    });

    // ============================================
    // MOBILE MENU DRAWER
    // ============================================
    const mobileToggle = document.getElementById('mobileToggle');
    const drawerClose = document.getElementById('drawerClose');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const drawerOverlay = document.getElementById('drawerOverlay');

    function openDrawer() {
        if (mobileDrawer) mobileDrawer.classList.add('active');
        if (drawerOverlay) drawerOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        if (mobileDrawer) mobileDrawer.classList.remove('active');
        if (drawerOverlay) drawerOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (mobileToggle) {
        mobileToggle.addEventListener('click', openDrawer);
    }

    if (drawerClose) {
        drawerClose.addEventListener('click', closeDrawer);
    }

    if (drawerOverlay) {
        drawerOverlay.addEventListener('click', closeDrawer);
    }

    // Fecha o drawer ao clicar em qualquer link
    const drawerNavLinks = document.querySelectorAll('.drawer-nav a');
    drawerNavLinks.forEach(link => {
        link.addEventListener('click', closeDrawer);
    });

    // ============================================
    // HEADER SCROLL EFFECT (STICKY)
    // ============================================
    const header = document.getElementById('header');
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            if (header) header.classList.add('scrolled');
            if (navbar) navbar.style.padding = '0.5rem 0';
        } else {
            if (header) header.classList.remove('scrolled');
            if (navbar) navbar.style.padding = '1rem 0';
        }
    });

    // ============================================
    // ACTIVE NAV LINK ON SCROLL
    // ============================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.desktop-menu .nav-link, .drawer-nav a');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // ============================================
    // FAQ ACCORDION
    // ============================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Fecha todos os outros itens
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });
                
                // Abre o item clicado se não estava ativo
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });

    // ============================================
    // CONTACT FORM (WHATSAPP INTEGRATION)
    // ============================================
    const contactForm = document.querySelector('.contact-form-new');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.contact-submit-btn');
            const originalText = submitBtn.innerHTML;
            
            // Obtém os valores do formulário
            const name = contactForm.querySelector('input[placeholder="Name"]')?.value || '';
            const phone = contactForm.querySelector('input[placeholder="Phone Number"]')?.value || '';
            const email = contactForm.querySelector('input[placeholder="Email"]')?.value || '';
            const message = contactForm.querySelector('textarea')?.value || '';
            
            // Monta a mensagem para o WhatsApp
            const whatsappMessage = encodeURIComponent(
                `*🔧 NOVA SOLICITAÇÃO - LEONARDO SERRA*%0A%0A` +
                `*Nome:* ${name}%0A` +
                `*Telefone:* ${phone}%0A` +
                `*Email:* ${email}%0A` +
                `*Mensagem:* ${message}%0A%0A` +
                `_Enviado via site oficial_`
            );
            
            // Altera o botão para estado de carregamento
            submitBtn.innerHTML = 'ENVIANDO... <i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;
            
            // Redireciona para o WhatsApp após breve delay
            setTimeout(() => {
                window.open(`https://wa.me/244939717295?text=${whatsappMessage}`, '_blank');
                
                submitBtn.innerHTML = 'ENVIADO! <i class="fas fa-check"></i>';
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    contactForm.reset();
                }, 3000);
            }, 1000);
        });
    }

    // ============================================
    // SERVICE BUTTONS (SCROLL TO CONTACT)
    // ============================================
    const serviceButtons = document.querySelectorAll('.service-btn');
    const contactSection = document.getElementById('contacto');

    serviceButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ============================================
    // DRAWER CONTACT BUTTON
    // ============================================
    const drawerContactBtn = document.getElementById('drawerContactBtn');

    if (drawerContactBtn) {
        drawerContactBtn.addEventListener('click', () => {
            closeDrawer();
            setTimeout(() => {
                if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 300);
        });
    }

    // ============================================
    // SMOOTH SCROLL FOR ALL ANCHORS
    // ============================================
    const allAnchors = document.querySelectorAll('a[href^="#"]');

    allAnchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#' || targetId === '') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const headerHeight = header ? header.offsetHeight : 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // FOOTER CURRENT YEAR
    // ============================================
    const currentYearSpan = document.getElementById('currentYear');
    
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // ============================================
    // AOS INIT (SCROLL REVEAL ANIMATIONS)
    // ============================================
    AOS.init({
        duration: 800,
        once: true,
        offset: 100,
        easing: 'ease-out'
    });

    // ============================================
    // LIGHTBOX MODAL PARA PORTFÓLIO
    // ============================================
    // Elementos do Lightbox
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    // Array de imagens do portfólio
    let galleryImages = [];
    let currentImageIndex = 0;

    // Coleta todas as imagens do portfólio
    const portfolioThumbs = document.querySelectorAll('.portfolio-thumb');
    
    portfolioThumbs.forEach((thumb, index) => {
        const imgSrc = thumb.getAttribute('data-img');
        const imgTitle = thumb.getAttribute('data-title');
        
        if (imgSrc) {
            galleryImages.push({
                src: imgSrc,
                title: imgTitle || `Projeto ${index + 1}`
            });
        }
        
        // Adiciona evento de clique
        thumb.addEventListener('click', () => {
            currentImageIndex = index;
            openLightbox(currentImageIndex);
        });
    });

    // Abre o lightbox com a imagem selecionada
    function openLightbox(index) {
        if (!lightboxModal) return;
        
        currentImageIndex = index;
        updateLightboxContent();
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Adiciona evento de teclado
        document.addEventListener('keydown', handleKeyDown);
    }

    // Fecha o lightbox
    function closeLightbox() {
        if (!lightboxModal) return;
        
        lightboxModal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Remove evento de teclado
        document.removeEventListener('keydown', handleKeyDown);
    }

    // Atualiza o conteúdo do lightbox
    function updateLightboxContent() {
        if (!galleryImages[currentImageIndex]) return;
        
        const currentImage = galleryImages[currentImageIndex];
        
        if (lightboxImage) {
            lightboxImage.src = currentImage.src;
            lightboxImage.alt = currentImage.title;
        }
        
        if (lightboxCaption) {
            lightboxCaption.textContent = currentImage.title;
        }
        
        if (lightboxCounter) {
            lightboxCounter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;
        }
        
        // Atualiza estado dos botões de navegação
        if (lightboxPrev) {
            lightboxPrev.style.opacity = currentImageIndex === 0 ? '0.3' : '1';
            lightboxPrev.style.cursor = currentImageIndex === 0 ? 'not-allowed' : 'pointer';
        }
        
        if (lightboxNext) {
            lightboxNext.style.opacity = currentImageIndex === galleryImages.length - 1 ? '0.3' : '1';
            lightboxNext.style.cursor = currentImageIndex === galleryImages.length - 1 ? 'not-allowed' : 'pointer';
        }
    }

    // Navega para a imagem anterior
    function prevImage() {
        if (currentImageIndex > 0) {
            currentImageIndex--;
            updateLightboxContent();
        }
    }

    // Navega para a próxima imagem
    function nextImage() {
        if (currentImageIndex < galleryImages.length - 1) {
            currentImageIndex++;
            updateLightboxContent();
        }
    }

    // Manipula eventos de teclado
    function handleKeyDown(e) {
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                prevImage();
                break;
            case 'ArrowRight':
                nextImage();
                break;
        }
    }

    // Adiciona eventos aos botões do lightbox
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', prevImage);
    }
    
    if (lightboxNext) {
        lightboxNext.addEventListener('click', nextImage);
    }
    
    // Fecha o lightbox ao clicar no overlay
    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });
    }

    // ============================================
    // PARALLAX EFFECT ON HERO (OPCIONAL)
    // ============================================
    const hero = document.querySelector('.hero');
    
    window.addEventListener('scroll', () => {
        if (hero && window.innerWidth > 768) {
            const scrolled = window.pageYOffset;
            hero.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    });

    // ============================================
    // CONSOLE LOG DE INICIALIZAÇÃO
    // ============================================
    console.log('✅ Leonardo Serra Shop - Ultimate Premium Engine Loaded');
    console.log('✅ Lightbox Modal - Funcional com navegação');
    console.log('✅ Dark/Light Mode - Persistente');
    console.log('✅ Mobile Menu - Totalmente responsivo');

})();
