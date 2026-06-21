/**
 * SERVICES.JS - MOTOR DO MODAL ENTERPRISE
 * Metalurgia Futurística Leonardo Serra
 * 
 * Este módulo gere a extração de dados do 'Data Store' e a 
 * orquestração visual do modal de detalhes em ecrã total.
 */

const serviceModalManager = {
    // 1. Referências de Elementos do DOM
    elements: {
        modal: document.getElementById('serviceModal'),
        dataStore: document.getElementById('services-data-store'),
        title: document.getElementById('serviceModalTitle'),
        description: document.getElementById('serviceModalDescription'),
        category: document.getElementById('serviceModalCategory'),
        icon: document.getElementById('serviceModalIcon'),
        imageDesktop: document.getElementById('serviceModalImage'),
        imageMobile: document.getElementById('serviceModalImageMobile'),
        price: document.getElementById('serviceModalPrice'),
        scrollContainer: document.querySelector('.service-modal-info-scroll')
    },

    /**
     * ABRE O MODAL E POPULA COM DADOS DO BANCO
     * @param {number} index - Índice do array de serviços
     */
    open(index) {
        const { elements } = this;

        // Validação de Segurança
        if (!elements.modal || !elements.dataStore) {
            console.error("[ServiceModal] Erro Crítico: Estrutura HTML não encontrada.");
            return;
        }

        try {
            // Recupera e processa o JSON armazenado no atributo data-services
            const servicesData = JSON.parse(elements.dataStore.getAttribute('data-services'));
            const service = servicesData[index];

            if (!service) {
                console.error(`[ServiceModal] Serviço com índice ${index} não localizado.`);
                return;
            }

            // --- POPULAÇÃO DOS CAMPOS ---

            // A. Textos e Identificação
            if (elements.title) elements.title.innerText = service.name;
            if (elements.category) elements.category.innerText = (service.category || 'INDUSTRIAL').toUpperCase();
            if (elements.description) elements.description.innerText = service.full_content || service.description;

            // B. Ícone Técnico
            if (elements.icon) {
                elements.icon.innerHTML = `<i class="fas ${service.icon_class || 'fa-tools'}"></i>`;
            }

            // C. Mídias (Desktop e Mobile)
            const imageUrl = service.image_url || '/images/serv-2.jpeg';
            if (elements.imageDesktop) elements.imageDesktop.src = imageUrl;
            if (elements.imageMobile) elements.imageMobile.src = imageUrl;

            // D. Precificação (Formatação em Kwanzas - AOA)
            if (elements.price) {
                const formattedPrice = new Intl.NumberFormat('pt-AO', {
                    style: 'currency',
                    currency: 'AOA',
                    minimumFractionDigits: 2
                }).format(service.price_start || 0).replace('AOA', 'KZ');

                elements.price.innerHTML = `A partir de <span>${formattedPrice}</span>`;
            }

            // --- EXECUÇÃO VISUAL ---

            // Reseta o scroll para o topo para novos serviços
            if (elements.scrollContainer) elements.scrollContainer.scrollTop = 0;

            // Ativa o Modal
            elements.modal.style.display = 'flex';
            
            // Pequeno delay para permitir que o display:flex seja processado antes da animação
            setTimeout(() => {
                elements.modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Bloqueia scroll do site
            }, 10);

            console.log(`[ServiceModal] Carregado: ${service.name}`);

        } catch (error) {
            console.error("[ServiceModal] Erro ao processar dados JSON:", error);
            alert("Erro ao carregar detalhes. Por favor, tente novamente.");
        }
    },

    /**
     * FECHA O MODAL E LIMPA ESTADOS
     */
    close() {
        const { modal } = this.elements;
        if (!modal) return;

        modal.classList.remove('active');
        document.body.style.overflow = ''; // Libera scroll do site

        // Aguarda a transição de saída (0.5s) antes de remover o display
        setTimeout(() => {
            modal.style.display = 'none';
        }, 500);
    }
};

/**
 * EXPOSIÇÃO GLOBAL
 * Garante que o atributo 'onclick' do HTML (EJS) consiga acessar as funções.
 */
window.openServiceModal = (index) => serviceModalManager.open(index);
window.closeServiceModal = () => serviceModalManager.close();

export default serviceModalManager;
