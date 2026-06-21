/**
 * UTILS/FORMATTERS.JS
 * Utilitários para padronização visual de dados no frontend e backend.
 */

const formatters = {

    /**
     * FORMATAÇÃO DE MOEDA (Kwanza - AOA)
     * Exemplo: 1500000 -> KZ 1.500.000,00
     * @param {number} value - O valor numérico
     */
    formatCurrency: (value) => {
        if (value === null || value === undefined) return 'Sob consulta';
        
        return new Intl.NumberFormat('pt-AO', {
            style: 'currency',
            currency: 'AOA',
            minimumFractionDigits: 2
        }).format(value).replace('AOA', 'KZ');
    },

    /**
     * FORMATAÇÃO DE DATA (Curta/Longa)
     * Exemplo: 2025-01-20 -> 20 de Janeiro de 2025
     * @param {string|Date} date - A data para formatar
     * @param {boolean} includeTime - Se deve incluir a hora
     */
    formatDate: (date, includeTime = false) => {
        if (!date) return '';
        const d = new Date(date);
        
        const options = {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        };

        if (includeTime) {
            options.hour = '2-digit';
            options.minute = '2-digit';
        }

        return d.toLocaleDateString('pt-BR', options);
    },

    /**
     * FORMATAÇÃO DE DATA PARA TABELAS (Compacta)
     * Exemplo: 20/01/2025
     */
    formatDateShort: (date) => {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleDateString('pt-BR');
    },

    /**
     * FORMATAÇÃO DE TAMANHO DE ARQUIVO
     * Converte Bytes em KB, MB ou GB
     * @param {number} bytes 
     */
    formatBytes: (bytes, decimals = 2) => {
        if (!+bytes) return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    },

    /**
     * TRUNCAR TEXTO (Resumo)
     * Limita uma string a um número X de caracteres e adiciona reticências.
     */
    truncateText: (text, limit = 100) => {
        if (!text) return '';
        if (text.length <= limit) return text;
        
        return text.substring(0, limit).trim() + '...';
    },

    /**
     * LIMPAR TELEFONE
     * Remove parênteses, espaços e traços para links tel: ou WhatsApp
     */
    cleanPhone: (phone) => {
        if (!phone) return '';
        return phone.replace(/\D/g, '');
    },

    /**
     * FORMATAÇÃO DE NÚMERO DE VISUALIZAÇÕES
     * Exemplo: 1200 -> 1.2k
     */
    formatViews: (num) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
        }
        return num;
    }
};

module.exports = formatters;