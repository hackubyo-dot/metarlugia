/**
 * THEME.JS
 * Gerenciador de Tema (Escuro/Claro).
 * Controla a persistência da preferência do usuário e a manipulação do DOM.
 */

const themeManager = {
    // Seletores dos elementos de alternância
    toggles: document.querySelectorAll('#themeToggle, #themeToggleFloat'),
    html: document.documentElement,
    storageKey: 'ls_theme',

    /**
     * INICIALIZAÇÃO
     * Define o tema inicial baseado no localStorage ou na preferência do sistema.
     */
    init() {
        // 1. Tenta obter o tema salvo, se não houver, verifica a preferência do SO (padrão dark)
        const savedTheme = localStorage.getItem(this.storageKey);
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

        // 2. Aplica o tema inicial
        this.applyTheme(initialTheme);

        // 3. Adiciona os ouvintes de evento para todos os botões de toggle
        this.toggles.forEach(btn => {
            btn.addEventListener('click', () => this.toggle());
        });

        // 4. Ouvinte para mudanças de preferência do sistema em tempo real
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem(this.storageKey)) {
                this.applyTheme(e.matches ? 'dark' : 'light');
            }
        });

        console.log(`[ThemeEngine] Iniciado no modo: ${initialTheme}`);
    },

    /**
     * ALTERNAR TEMA
     * Troca entre Dark e Light.
     */
    toggle() {
        const currentTheme = this.html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        this.applyTheme(newTheme);
        localStorage.setItem(this.storageKey, newTheme);
    },

    /**
     * APLICAR TEMA AO DOM
     * Altera o atributo no HTML e dispara eventos se necessário.
     * @param {string} theme - 'dark' ou 'light'
     */
    applyTheme(theme) {
        // Aplica o atributo ao elemento raiz para os seletores CSS funcionarem
        this.html.setAttribute('data-theme', theme);

        // Atualiza a acessibilidade e ícones se necessário
        this.toggles.forEach(btn => {
            btn.setAttribute('aria-label', `Mudar para modo ${theme === 'dark' ? 'claro' : 'escuro'}`);
        });

        // Evento customizado para outros módulos reagirem à troca de tema (ex: charts)
        const themeChangeEvent = new CustomEvent('themeChanged', { detail: { theme } });
        window.dispatchEvent(themeChangeEvent);
    },

    /**
     * OBTER TEMA ATUAL
     */
    getCurrentTheme() {
        return this.html.getAttribute('data-theme');
    }
};

export default themeManager;