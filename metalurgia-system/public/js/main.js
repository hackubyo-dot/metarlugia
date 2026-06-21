/**
 * MAIN.JS - ORQUESTRADOR PRINCIPAL DO SISTEMA
 * Metalurgia Futurística Leonardo Serra
 * 
 * Versão: 1.0.4 (Estável - Full Stack)
 * Ponto de entrada que inicializa todos os módulos e funções globais.
 */

// --- IMPORTAÇÃO DOS MÓDULOS ES6 ---
import themeManager from './modules/theme.js';
import sliderManager from './modules/slider.js';
import galleryManager from './modules/gallery.js';
import videoManager from './modules/video.js';
import contactManager from './modules/contact.js';
import dashboardManager from './modules/dashboard.js';
import faqManager from './modules/faq.js';

/**
 * PREVENIR FLASH DE TEMA INCORRETO (Anti-Flicker)
 * Aplica o tema salvo no localStorage antes mesmo do DOM carregar para evitar tela branca.
 */
(function() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
})();

/**
 * INICIALIZAÇÃO SEGURA AO CARREGAR O DOM
 */
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Gerenciador de Temas (Dark/Light)
    themeManager.init();

    // 2. Sliders (Hero Cinematográfico e Depoimentos)
    sliderManager.initHero();
    sliderManager.initTestimonials();

    // 3. Portfólio (Galeria, Filtros e Lightbox)
    galleryManager.init();

    // 4. Motor de Vídeos (Modais Industriais e Controles)
    videoManager.init();

    // 5. Comunicação (Formulários e Newsletters)
    contactManager.init();

    // 6. Área Administrativa (Dashboard)
    dashboardManager.init();

    // 7. Suporte (FAQ Accordions)
    faqManager.init();

    // 8. Inicializa AOS (Animate On Scroll) se a biblioteca estiver carregada
    if (typeof AOS !== 'undefined') {
        AOS.init({ 
            duration: 800, 
            easing: 'ease-out-cubic',
            once: true, 
            offset: 50 
        });
    }

    // 9. Efeito de Scroll no Header (Adiciona fundo ao rolar a página)
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    console.log("🚀 Sistema Metalurgia Futurística inicializado com sucesso.");
});

/**
 * FUNÇÃO GLOBAL: ABERTURA DO MODAL DE SERVIÇOS
 * Habilita a visualização técnica detalhada. 
 * Resolve o erro de segurança do CSP e garante que o onclick funcione.
 * 
 * @param {number|string} idx - Índice do serviço vindo do banco.
 */
window.openServiceModal = function(idx) {
    const modal = document.getElementById('serviceModal');
    const index = parseInt(idx); // Converte para número por segurança

    // 1. Verificação Crítica: Modal existe?
    if (!modal) {
        console.error("[ServiceModal] Erro: Elemento #serviceModal não encontrado no DOM.");
        return;
    }

    // 2. Verificação Crítica: Dados foram injetados pelo EJS?
    if (!window.SERVICES_DATA) {
        console.error("[ServiceModal] Erro: window.SERVICES_DATA não foi injetada pelo servidor.");
        alert("Erro técnico: Os dados não foram carregados corretamente. Por favor, recarregue a página.");
        return;
    }

    // 3. Verificação Crítica: O índice é válido?
    const service = window.SERVICES_DATA[index];
    if (!service) {
        console.error("[ServiceModal] Erro: Serviço não encontrado para o índice " + index);
        return;
    }

    // 4. Preenchimento Dinâmico (Try/Catch para evitar quebra do script)
    try {
        const titleEl = document.getElementById('serviceModalTitle');
        const descEl = document.getElementById('serviceModalDescription');
        const iconEl = document.getElementById('serviceModalIcon');
        const priceEl = document.getElementById('serviceModalPrice');

        if (titleEl) titleEl.innerText = service.name;
        if (descEl) descEl.innerText = service.full_content || service.description;
        
        // Injeção de Ícone Dinâmico
        if (iconEl) {
            iconEl.innerHTML = `<i class="fas ${service.icon_class || 'fa-tools'}"></i>`;
        }

        // Formatação de Preço Profissional (Angola - Kwanza KZ)
        if (priceEl && service.price_start) {
            const priceValue = parseFloat(service.price_start) || 0;
            const formattedPrice = new Intl.NumberFormat('pt-AO', { 
                style: 'currency', 
                currency: 'AOA' 
            }).format(priceValue).replace('AOA', 'KZ');
            
            priceEl.innerHTML = `A partir de <span>${formattedPrice}</span>`;
        }
        
        // 5. Exibição da Interface e Trava de Scroll
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        console.log("[ServiceModal] Exibindo detalhes de: " + service.name);

    } catch (err) {
        console.error("[ServiceModal] Erro crítico ao preencher campos:", err);
    }
};

/**
 * FUNÇÃO GLOBAL: FECHAMENTO DO MODAL DE SERVIÇOS
 */
window.closeServiceModal = function() {
    const modal = document.getElementById('serviceModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Libera o scroll do site
    }
};

/**
 * TRATAMENTO DE ERROS GLOBAIS DE CARREGAMENTO
 * Captura falhas em scripts externos ou módulos para facilitar o debug em produção.
 */
window.addEventListener('error', (e) => {
    if (e.target && e.target.tagName === 'SCRIPT') {
        console.error(`[Main] Falha ao carregar script crítico: ${e.target.src}`);
    }
}, true);

// Exportação do módulo
export default {};