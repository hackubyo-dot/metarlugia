/**
 * MIDDLEWARES/SECURITYMIDDLEWARE.JS
 * Camada de defesa contra abusos e ataques cibernéticos comuns.
 * Implementa Rate Limiting e Sanitização de dados.
 */

const rateLimit = require('express-rate-limit');
const validator = require('validator');

const securityMiddleware = {

    /**
     * GENERAL RATE LIMITER
     * Limita o número de requisições globais por IP para evitar ataques de negação de serviço (DoS).
     * Configuração: Máximo de 100 requisições a cada 15 minutos por IP.
     */
    generalLimiter: rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutos
        max: 100, // Limite de 100 requisições por janela
        standardHeaders: true,
        legacyHeaders: false,
        message: {
            status: 429,
            error: 'Muitas requisições vindas deste IP. Por favor, tente novamente após 15 minutos.'
        }
    }),

    /**
     * AUTH RATE LIMITER (Proteção contra Brute Force)
     * Restringe tentativas de login.
     * Configuração: Máximo de 5 tentativas a cada 30 minutos.
     */
    authLimiter: rateLimit({
        windowMs: 30 * 60 * 1000, // 30 minutos
        max: 5, 
        message: 'Muitas tentativas de login. Por questões de segurança, seu acesso foi temporariamente bloqueado. Tente novamente em 30 minutos.',
        handler: (req, res, next, options) => {
            req.flash('error_msg', options.message);
            res.redirect('/auth/login');
        }
    }),

    /**
     * CONTACT FORM LIMITER
     * Evita que robôs enviem milhares de e-mails/mensagens de contato.
     * Configuração: Máximo de 3 mensagens por hora por IP.
     */
    contactLimiter: rateLimit({
        windowMs: 60 * 60 * 1000, // 1 hora
        max: 3,
        message: 'Você atingiu o limite de mensagens de contato por hora. Por favor, aguarde ou use o WhatsApp.',
        handler: (req, res, next, options) => {
            req.flash('error_msg', options.message);
            res.redirect('/#contacto');
        }
    }),

    /**
     * XSS & DATA SANITIZATION
     * Limpa recursivamente todos os campos do req.body para remover tags HTML maliciosas.
     * Garante que dados inseridos via formulário não executem scripts no navegador de outros usuários.
     */
    sanitizeInput: (req, res, next) => {
        if (req.body) {
            for (let key in req.body) {
                if (typeof req.body[key] === 'string') {
                    // Remove tags HTML e escapa caracteres perigosos
                    req.body[key] = validator.escape(req.body[key].trim());
                } else if (Array.isArray(req.body[key])) {
                    // Sanitiza arrays (comum em tags ou galerias)
                    req.body[key] = req.body[key].map(item => 
                        typeof item === 'string' ? validator.escape(item.trim()) : item
                    );
                }
            }
        }
        next();
    },

    /**
     * VALIDATE EMAIL
     * Middleware helper para validar formato de e-mail em rotas específicas.
     */
    validateEmail: (req, res, next) => {
        const { email } = req.body;
        if (email && !validator.isEmail(email)) {
            req.flash('error_msg', 'O formato do e-mail inserido é inválido.');
            return res.redirect('back');
        }
        next();
    }
};

module.exports = securityMiddleware;