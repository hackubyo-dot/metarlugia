/**
 * MAIN.JS - SISTEMA DE INTELIGÊNCIA FRONTEND (V3.0)
 * Metalurgia Futurística Leonardo Serra
 * 
 * Este arquivo orquestra o comportamento de todos os módulos e 
 * gerencia a lógica complexa do Modal de Serviços Full-Screen.
 */

// --- 1. IMPORTAÇÃO DOS MÓDULOS ES6 ---
import themeManager from './modules/theme.js';
import sliderManager from './modules/slider.js';
import galleryManager from './modules/gallery.js';
import videoManager from './modules/video.js';
import contactManager from './modules/contact.js';
import dashboardManager from './modules/dashboard.js';
import faqManager from './modules/faq.js';

/**
 * INICIALIZAÇÃO GLOBAL DO SISTEMA
 */
document.addEventListener('DOMContentLoaded', () => {
    
    console.log("🛠️ Motores Metalurgia Futurística: Ativando v3.0...");

    // A. Inicializa Gerenciadores de Comportamento
    themeManager.init();
    sliderManager.initHero();
    sliderManager.initTestimonials();
    galleryManager.init();
    videoManager.init();
    contactManager.init();
    faqManager.init();

    // B. Ativa Dashboard se houver permissão
    if (document.querySelector('.admin-layout')) {
        dashboardManager.init();
    }

    // C. Inicializa Biblioteca de Animações (AOS)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1200,
            easing: 'ease-out-quint',
            once: true,
            offset: 80
        });
    }

    // D. Motor de Scroll do Header
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 80) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    // E. Inicializa o Rastreador de Scroll do Modal
    initModalScrollTracker();

    console.log("🚀 Sistema Full Stack v3.0 pronto e operante.");
});

/**
 * ==========================================================================
 * 2. LÓGICA DO MODAL DE SERVIÇOS (VERSÃO 3.0 MASTER)
 * ==========================================================================
 */

/**
 * RASTREADOR DE PROGRESSO DE LEITURA
 * Monitora o scroll da coluna Beta e atualiza a barra superior.
 */
function initModalScrollTracker() {
    const scrollColumn = document.getElementById('modalDataScroll');
    const progressBar = document.getElementById('serviceScrollProgress');

    if (!scrollColumn || !progressBar) return;

    scrollColumn.addEventListener('scroll', () => {
        const scrollTop = scrollColumn.scrollTop;
        const scrollHeight = scrollColumn.scrollHeight - scrollColumn.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        
        progressBar.style.width = `${progress}%`;
    }, { passive: true });
}

/**
 * ABERTURA DO MODAL (ESTRATÉGIA DATA-STORE)
 * @param {number|string} idx - Índice do serviço
 */
window.openServiceModal = function(idx) {
    const modal = document.getElementById('serviceModal');
    const dataStore = document.getElementById('services-data-store');
    const scrollColumn = document.getElementById('modalDataScroll');
    const index = parseInt(idx);

    if (!modal || !dataStore) {
        console.error("[System] Erro: Estrutura do modal ausente.");
        return;
    }

    try {
        // Recupera dados seguros do servidor
        const services = JSON.parse(dataStore.getAttribute('data-services'));
        const service = services[index];

        if (!service) throw new Error("Serviço não localizado no índice: " + index);

        // --- INJEÇÃO DE CONTEÚDO ---
        
        // 1. Títulos e Tags
        document.getElementById('serviceModalTitle').innerText = service.name;
        document.getElementById('serviceModalDescription').innerText = service.full_content || service.description;
        document.getElementById('serviceModalCategory').innerText = (service.category || 'INDUSTRIAL').toUpperCase();
        
        // 2. Imagens Dinâmicas (Desktop + Mobile)
        const assetUrl = service.image_url || '/images/serv-2.jpeg';
        const imgDesk = document.getElementById('serviceModalImage');
        const imgMob = document.getElementById('serviceModalImageMobile');
        
        if (imgDesk) imgDesk.src = assetUrl;
        if (imgMob) imgMob.src = assetUrl;

        // 3. Ícone
        const iconBox = document.getElementById('serviceModalIcon');
        if (iconBox) {
            iconBox.innerHTML = `<i class="fas ${service.icon_class || 'fa-tools'}"></i>`;
        }

        // 4. Preço em Kwanzas (AOA -> KZ)
        const priceBox = document.getElementById('serviceModalPrice');
        if (priceBox) {
            const val = parseFloat(service.price_start) || 0;
            const formatted = new Intl.NumberFormat('pt-AO', {
                style: 'currency',
                currency: 'AOA'
            }).format(val).replace('AOA', 'KZ');

            priceBox.innerHTML = `A partir de <span>${formatted}</span>`;
        }

        // --- CONTROLE DE INTERFACE ---

        // Reseta posição de scroll e barra de progresso
        if (scrollColumn) scrollColumn.scrollTop = 0;
        const progressBar = document.getElementById('serviceScrollProgress');
        if (progressBar) progressBar.style.width = "0%";

        // Exibe o modal
        modal.style.display = 'flex';
        
        // Ativa animações de entrada
        setTimeout(() => {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Trava scroll do site
        }, 30);

        console.log(`[System] Modal Enterprise carregado: ${service.name}`);

    } catch (err) {
        console.error("[System] Falha ao abrir modal:", err);
        alert("Ocorreu um problema ao carregar os dados. Por favor, tente atualizar a página.");
    }
};

/**
 * FECHAMENTO DO MODAL
 */
window.closeServiceModal = function() {
    const modal = document.getElementById('serviceModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Libera scroll do site
        
        // Tempo da animação no CSS (0.6s)
        setTimeout(() => {
            modal.style.display = 'none';
        }, 600);
    }
};

/**
 * GESTÃO GLOBAL DE ERROS DE MÍDIA
 */
window.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
        console.warn(`[System] Erro ao carregar imagem: ${e.target.src}`);
        e.target.src = '/images/serv-2.jpeg'; // Fallback industrial
    }
}, true);

// Exportação compatível com ES6
export default {};
