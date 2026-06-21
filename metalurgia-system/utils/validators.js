/**
 * UTILS/VALIDATORS.JS
 * Funções de validação de dados para formulários e APIs.
 * Utiliza a biblioteca 'validator' para verificações robustas.
 */

const validator = require('validator');

const validators = {

    /**
     * VALIDAR FORMULÁRIO DE CONTATO
     * Verifica os campos enviados pela Landing Page.
     */
    validateContactForm: (data) => {
        const errors = [];

        if (!data.name || validator.isEmpty(data.name)) {
            errors.push('O nome é obrigatório.');
        }

        if (!data.email || !validator.isEmail(data.email)) {
            errors.push('Insira um e-mail válido.');
        }

        if (!data.message || validator.isEmpty(data.message)) {
            errors.push('A mensagem não pode estar vazia.');
        }

        // Validação opcional de telefone (Padrão Angola ou Geral)
        if (data.phone && !validator.isMobilePhone(data.phone, 'any')) {
            errors.push('O número de telefone informado é inválido.');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    },

    /**
     * VALIDAR LOGIN
     */
    validateLogin: (email, password) => {
        const errors = [];

        if (!email || !validator.isEmail(email)) {
            errors.push('E-mail inválido.');
        }

        if (!password || validator.isEmpty(password)) {
            errors.push('A senha é obrigatória.');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    },

    /**
     * VALIDAR DADOS DE SERVIÇO
     */
    validateService: (data) => {
        const errors = [];

        if (!data.name || validator.isEmpty(data.name)) {
            errors.push('O nome do serviço é obrigatório.');
        }

        if (data.price_start && !validator.isNumeric(data.price_start.toString())) {
            errors.push('O preço deve ser um valor numérico.');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    },

    /**
     * VALIDAR POST DO BLOG
     */
    validateBlogPost: (data) => {
        const errors = [];

        if (!data.title || validator.isEmpty(data.title)) {
            errors.push('O título do artigo é obrigatório.');
        }

        if (!data.content || validator.isEmpty(data.content)) {
            errors.push('O conteúdo do artigo não pode estar vazio.');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    },

    /**
     * VALIDAR FORMATO DE TELEFONE ANGOLA (+244)
     * Regra: Inicia com 9, 2 ou 244 e tem 9 dígitos (sem contar o DDI)
     */
    isAngolanPhone: (phone) => {
        if (!phone) return false;
        // Remove tudo que não for número
        const clean = phone.replace(/\D/g, '');
        // Verifica se tem o tamanho correto (9 dígitos ou 12 com DDI)
        return (clean.length === 9 && (clean.startsWith('9') || clean.startsWith('2'))) || 
               (clean.length === 12 && clean.startsWith('244'));
    },

    /**
     * VALIDAR UUID (Para IDs do Supabase)
     */
    isValidUUID: (id) => {
        return id && validator.isUUID(id);
    },

    /**
     * HIGIENIZAR HTML (Básico)
     * Remove tags perigosas se o sanitizeInput falhar por algum motivo.
     */
    cleanHTML: (str) => {
        return validator.escape(str);
    }
};

module.exports = validators;