/**
 * GALLERY.JS
 * Gerenciamento do Portfólio e Sistema de Lightbox.
 */

const galleryManager = {
    // Elementos do DOM
    modal: document.getElementById('lightboxModal'),
    img: document.getElementById('lightboxImage'),
    caption: document.getElementById('lightboxCaption'),
    counter: document.getElementById('lightboxCounter'),
    closeBtn: document.getElementById('lightboxClose'),
    prevBtn: document.getElementById('lightboxPrev'),
    nextBtn: document.getElementById('lightboxNext'),
    
    // Estado da Galeria
    items: [],
    currentIndex: 0,

    /**
     * Inicializa o sistema de galeria.
     */
    init() {
        const thumbnails = document.querySelectorAll('.portfolio-thumb');
        if (thumbnails.length === 0 || !this.modal) return;

        // 1. Mapeia todos os itens disponíveis na página para navegação sequencial
        this.items = Array.from(thumbnails).map((thumb, index) => {
            return {
                src: thumb.getAttribute('data-img'),
                title: thumb.getAttribute('data-title') || 'Projeto Metalúrgico',
                client: thumb.getAttribute('data-client') || 'Metalurgia Futurística',
                index: index
            };
        });

        // 2. Adiciona evento de clique nas thumbnails
        thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', () => {
                this.open(index);
            });
        });

        // 3. Adiciona eventos de controle do Lightbox
        if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.close());
        if (this.prevBtn) this.prevBtn.addEventListener('click', (e) => { e.stopPropagation(); this.prev(); });
        if (this.nextBtn) this.nextBtn.addEventListener('click', (e) => { e.stopPropagation(); this.next(); });

        // Fechar ao clicar no fundo (overlay)
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal || e.target.classList.contains('lightbox-container')) {
                this.close();
            }
        });

        // 4. Atalhos de Teclado
        document.addEventListener('keydown', (e) => {
            if (!this.modal.classList.contains('active')) return;
            
            if (e.key === 'Escape') this.close();
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });

        console.log(`[Gallery] Sistema de Lightbox pronto com ${this.items.length} itens.`);
    },

    /**
     * Abre o visualizador em um índice específico.
     * @param {number} index 
     */
    open(index) {
        this.currentIndex = index;
        this.updateContent();
        
        this.modal.style.display = 'flex';
        // Pequeno delay para permitir a transição CSS (opacity)
        setTimeout(() => {
            this.modal.classList.add('active');
            document.body.classList.add('no-scroll');
        }, 10);
    },

    /**
     * Fecha o visualizador.
     */
    close() {
        this.modal.classList.remove('active');
        document.body.classList.remove('no-scroll');
        
        // Aguarda a transição terminar para esconder o elemento
        setTimeout(() => {
            this.modal.style.display = 'none';
            if (this.img) this.img.src = ''; // Limpa a imagem para liberar memória
        }, 400);
    },

    /**
     * Navega para a imagem anterior.
     */
    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateContent();
        } else {
            // Loop para o final
            this.currentIndex = this.items.length - 1;
            this.updateContent();
        }
    },

    /**
     * Navega para a próxima imagem.
     */
    next() {
        if (this.currentIndex < this.items.length - 1) {
            this.currentIndex++;
            this.updateContent();
        } else {
            // Loop para o início
            this.currentIndex = 0;
            this.updateContent();
        }
    },

    /**
     * Atualiza o conteúdo do modal com base no índice atual.
     */
    updateContent() {
        const item = this.items[this.currentIndex];
        if (!item) return;

        // Efeito de transição suave na troca de imagem
        if (this.img) {
            this.img.style.opacity = '0';
            
            // Criamos um objeto Image para pré-carregar antes de exibir
            const tempImg = new Image();
            tempImg.src = item.src;
            tempImg.onload = () => {
                this.img.src = item.src;
                this.img.style.opacity = '1';
            };
        }

        if (this.caption) {
            this.caption.innerHTML = `
                <h4>${item.title}</h4>
                <p>${item.client}</p>
            `;
        }

        if (this.counter) {
            this.counter.textContent = `${this.currentIndex + 1} / ${this.items.length}`;
        }
    }
};

export default galleryManager;