/**
 * SLIDER.JS - GESTÃO DE SLIDERS PREMIUM
 * Metalurgia Futurística Leonardo Serra
 * 
 * Gerenciamento avançado de carrosséis (Swiper.js) com suporte a 
 * transições cinematográficas e controle inteligente de vídeo.
 */

const sliderManager = {
    /**
     * Inicializa o Hero Slider da página inicial.
     * Configurado com transição Fade Premium e proteção contra interrupção de mídia.
     */
    initHero() {
        const heroElement = document.querySelector('#heroSlider');
        if (!heroElement) return;

        const swiper = new Swiper('#heroSlider', {
            // Configurações de Transição Premium
            effect: 'fade',
            fadeEffect: { 
                crossFade: true 
            },
            speed: 1200, // Transição mais suave e elegante
            loop: true,
            
            // Autoplay prolongado para melhor leitura visual
            autoplay: {
                delay: 7000, 
                disableOnInteraction: false,
            },

            // Navegação e Paginação
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                renderBullet: function (index, className) {
                    // Mantém a estrutura para estilização customizada via CSS
                    return `<span class="${className}"></span>`;
                },
            },

            // CONTROLE INTELIGENTE DE VÍDEO (MOTOR INDUSTRIAL)
            on: {
                init: function () {
                    // Garante que todos os vídeos comecem pausados no carregamento inicial
                    this.slides.forEach(slide => {
                        const video = slide.querySelector('video');
                        if (video) {
                            video.pause();
                            video.muted = true; // Essencial para permitir autoplay no Chrome/Safari
                        }
                    });
                    // Dispara a lógica de play para o primeiro slide após pequeno delay de renderização
                    setTimeout(() => this.emit('slideChange'), 150);
                },
                slideChange: function () {
                    const slides = this.slides;
                    const activeIndex = this.activeIndex;
                    
                    slides.forEach((slide, index) => {
                        const video = slide.querySelector('video');
                        if (!video) return;

                        if (index === activeIndex) {
                            // Tenta reproduzir o vídeo do slide que entrou em foco
                            const playPromise = video.play();
                            if (playPromise !== undefined) {
                                playPromise.catch(error => {
                                    // Silencia erros de interrupção (ex: trocar de slide antes do play carregar)
                                    console.log("[Slider] Autoplay aguardando interação ou vídeo trocado rapidamente.");
                                });
                            }
                        } else {
                            // Pausa e reseta vídeos de slides inativos para economizar processamento e memória
                            video.pause();
                            video.currentTime = 0;
                        }
                    });
                }
            }
        });

        console.log("[Slider] Hero Slider Premium inicializado com sucesso.");
        return swiper;
    },

    /**
     * Inicializa o slider de depoimentos ou portfólio secundário.
     * Totalmente responsivo: 1 slide (Mobile), 2 slides (Tablet), 3 slides (Desktop).
     */
    initTestimonials() {
        const testimonialElement = document.querySelector('.testimonials-slider');
        if (!testimonialElement) return;

        const swiper = new Swiper('.testimonials-slider', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: { 
                delay: 5000,
                disableOnInteraction: false
            },
            // Pontos de interrupção para design responsivo
            breakpoints: {
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                }
            },
            pagination: { 
                el: '.swiper-pagination', 
                clickable: true 
            }
        });

        console.log("[Slider] Slider de Depoimentos inicializado.");
        return swiper;
    }
};

export default sliderManager;