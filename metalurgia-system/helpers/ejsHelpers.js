/**
 * HELPERS/EJSHELPERS.JS
 * Funções utilitárias para os templates EJS.
 */

const formatters = require('../utils/formatters');

const ejsHelpers = {
    // Formata Moeda
    formatCurrency: (value) => formatters.formatCurrency(value),
    
    // Formata Data
    formatDate: (date) => formatters.formatDate(date),
    formatDateShort: (date) => formatters.formatDateShort(date),
    
    // Limita Texto
    truncate: (text, limit) => formatters.truncateText(text, limit),
    
    // Link WhatsApp
    whatsappLink: (message = '') => {
        const phone = '244939717295';
        return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    },

    // VERIFICAÇÃO DE VÍDEO (A função que causou o erro)
    isMediaVideo: (url) => {
        if (!url || typeof url !== 'string') return false;
        const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
        return videoExtensions.some(ext => url.toLowerCase().includes(ext));
    },

    // Classe Ativa no Menu
    isActive: (currentPath, targetPath) => {
        if (currentPath === targetPath) return 'active';
        if (targetPath !== '/' && currentPath && currentPath.startsWith(targetPath)) return 'active';
        return '';
    },

    // Fallback de Ícone
    getIcon: (iconClass) => iconClass || 'fa-cog',

    // Nome do Autor
    authorName: (author) => (author && author.full_name) ? author.full_name : 'Leonardo Serra'
};

module.exports = ejsHelpers;