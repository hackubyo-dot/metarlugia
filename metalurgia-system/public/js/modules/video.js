/**
 * VIDEO.JS - MOTOR INDUSTRIAL v7.0
 * Metalurgia Futurística Leonardo Serra
 * 
 * Gerencia o player de vídeo customizado, modais técnicos e 
 * controles de interface avançados.
 */

const videoManager = {
    // Referências do DOM
    modal: document.getElementById('videoModal'),
    player: document.getElementById('industrialPlayer'),
    playBtn: document.getElementById('playBtn'),
    progressBar: document.getElementById('videoProgress'),
    mTitle: document.getElementById('modalVideoTitle'),
    mDesc: document.getElementById('modalVideoDesc'),

    /**
     * Inicializa os ouvintes de evento do player e controles globais.
     */
    init() {
        if (!this.modal || !this.player) return;

        // Atualização da barra de progresso conforme o vídeo avança
        this.player.addEventListener('timeupdate', () => this.handleProgress());

        // Fecha o modal ao clicar no fundo (backdrop)
        this.modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-backdrop-blur') || e.target === this.modal) {
                this.close();
            }
        });

        // Atalhos de Teclado: Espaço (Play/Pause) e Escape (Fechar)
        document.addEventListener('keydown', (e) => {
            if (this.modal.classList.contains('active')) {
                if (e.code === 'Space') {
                    e.preventDefault(); // Evita o scroll da página ao apertar espaço
                    this.togglePlay();
                }
                if (e.key === 'Escape') {
                    this.close();
                }
            }
        });

        console.log("[VideoEngine] Motor Industrial v7.0 pronto e operante.");
    },

    /**
     * Abre o modal, injeta o vídeo e inicia a reprodução.
     * @param {string} url - URL do vídeo (Supabase ou Local)
     * @param {string} title - Título técnico do processo
     * @param {string} desc - Descrição detalhada
     */
    open(url, title, desc) {
        if (!this.player) return;

        // Injeta os dados dinâmicos
        this.player.src = url;
        if (this.mTitle) this.mTitle.innerText = title;
        if (this.mDesc) this.mDesc.innerText = desc;

        // Ativa o modal e trava o scroll do site
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden'; 

        // Tenta iniciar a reprodução tratando o bloqueio de autoplay dos browsers
        const playPromise = this.player.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                this.updatePlayIcon(false); // Estado: Reproduzindo
            }).catch(error => {
                console.warn("[VideoEngine] Autoplay bloqueado ou interrompido:", error);
                this.updatePlayIcon(true); // Estado: Pausado
            });
        }
    },

    /**
     * Fecha o modal, limpa o player e libera memória.
     */
    close() {
        if (!this.player) return;

        this.player.pause();
        this.player.src = ""; // Limpa o src para cancelar o download do vídeo (buffer)
        this.modal.classList.remove('active');
        document.body.style.overflow = ''; // Libera o scroll
        
        // Reseta a barra de progresso
        if (this.progressBar) this.progressBar.style.width = '0%';
    },

    /**
     * Alterna entre Play e Pause e atualiza o ícone visual.
     */
    togglePlay() {
        if (!this.player) return;

        if (this.player.paused) {
            this.player.play();
            this.updatePlayIcon(false);
        } else {
            this.player.pause();
            this.updatePlayIcon(true);
        }
    },

    /**
     * Salta o tempo do vídeo para frente ou para trás.
     * @param {number} seconds - Segundos (ex: 10 ou -10)
     */
    skip(seconds) {
        if (this.player) {
            this.player.currentTime += seconds;
        }
    },

    /**
     * Atualiza visualmente o ícone do botão de controle central.
     * @param {boolean} isPaused 
     */
    updatePlayIcon(isPaused) {
        if (!this.playBtn) return;
        const icon = this.playBtn.querySelector('i');
        if (icon) {
            icon.className = isPaused ? 'fas fa-play' : 'fas fa-pause';
        }
    },

    /**
     * Gerencia a barra de progresso visual com verificação de segurança.
     */
    handleProgress() {
        if (!this.player || !this.progressBar) return;
        
        // Verifica se o vídeo já carregou metadados de duração para evitar divisão por zero
        if (this.player.duration) {
            const percent = (this.player.currentTime / this.player.duration) * 100;
            this.progressBar.style.width = `${percent}%`;
        }

        // Se o vídeo chegar ao fim, reseta o estado do ícone
        if (this.player.ended) {
            this.updatePlayIcon(true);
        }
    }
};

/**
 * EXPOSIÇÃO GLOBAL (VINCULAÇÃO COMPLETA)
 * Garante que os botões com 'onclick' no HTML funcionem em qualquer cenário,
 * respeitando as novas configurações de CSP do app.js.
 */
window.openVideoModal = (url, title, desc) => videoManager.open(url, title, desc);
window.closeVideoModal = () => videoManager.close();
window.togglePlay = () => videoManager.togglePlay();
window.skipVideo = (sec) => videoManager.skip(sec);

export default videoManager;