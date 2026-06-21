/**
 * HELPERS/EJSHELPERS.JS
 * Funções auxiliares para facilitar a manipulação de dados dentro dos templates EJS.
 * Este objeto é injetado globalmente nas rotas do App.
 */

const formatters = require('../utils/formatters');
const validators = require('../utils/validators');

const ejsHelpers = {
    
    /**
     * FORMATAÇÃO DE PREÇOS (Kwanzas)
     * Uso: <%= helpers.formatCurrency(250000) %> -> KZ 250.000,00
     */
    formatCurrency: (value) => {
        return formatters.formatCurrency(value);
    },

    /**
     * FORMATAÇÃO DE DATA LONGA
     * Uso: <%= helpers.formatDate('2025-01-20') %> -> 20 de Janeiro de 2025
     */
    formatDate: (date) => {
        return formatters.formatDate(date);
    },

    /**
     * FORMATAÇÃO DE DATA CURTA
     * Uso: <%= helpers.formatDateShort(post.created_at) %> -> 20/01/2025
     */
    formatDateShort: (date) => {
        return formatters.formatDateShort(date);
    },

    /**
     * LIMITAR TEXTO (EXCERPT)
     * Útil para resumos de blog ou descrições de cards.
     * Uso: <%= helpers.truncate(post.content, 150) %>
     */
    truncate: (text, limit) => {
        return formatters.truncateText(text, limit);
    },

    /**
     * DEFINIR CLASSE ATIVA NO MENU
     * Compara a URL atual com o link para destacar o item do menu.
     * Uso: <a class="<%= helpers.isActive(currentPath, '/servicos') %>">Serviços</a>
     */
    isActive: (currentPath, targetPath) => {
        if (currentPath === targetPath) return 'active';
        // Caso para subpáginas (ex: /blog/post-01 deve manter /blog ativo)
        if (targetPath !== '/' && currentPath.startsWith(targetPath)) return 'active';
        return '';
    },

    /**
     * GERAR LINK DE WHATSAPP
     * Cria o link direto para o número do Leonardo com mensagem pré-definida.
     * Uso: <a href="<%= helpers.whatsappLink('Olá, gostaria de um orçamento.') %>">...</a>
     */
    whatsappLink: (message = '') => {
        const phone = '244939717295';
        const encodedMessage = encodeURIComponent(message);
        return `https://wa.me/${phone}?text=${encodedMessage}`;
    },

    /**
     * VERIFICAR SE É VÍDEO OU IMAGEM
     * Útil para renderizar a tag correta (<video> ou <img>) no portfólio/hero.
     */
    isMediaVideo: (url) => {
        if (!url) return false;
        const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
        return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
    },

    /**
     * FORMATAR NOME DO AUTOR
     * Garante que sempre haja um nome para exibir no blog.
     */
    authorName: (author) => {
        if (author && author.full_name) return author.full_name;
        return 'Equipe Metalurgia Futurística';
    },

    /**
     * MAPEAR ÍCONES PADRÃO
     * Retorna o ícone do FontAwesome caso o banco esteja vazio.
     */
    getIcon: (iconClass) => {
        return iconClass || 'fa-cog';
    }
};

module.exports = ejsHelpers;