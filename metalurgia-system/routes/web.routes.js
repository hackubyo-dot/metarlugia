/**
 * ROUTES/WEB.ROUTES.JS
 * Definição das rotas públicas do ecossistema Metalurgia Futurística.
 */

const express = require('express');
const router = express.Router();

// Importação dos Controladores
const webController = require('../controllers/webController');

// Importação de Middlewares de Segurança
const { 
    contactLimiter, 
    sanitizeInput, 
    validateEmail 
} = require('../middlewares/securityMiddleware');

/**
 * --- ROTAS DE NAVEGAÇÃO ---
 */

// Rota Principal: Home Page (Landing Page Dinâmica)
router.get('/', webController.index);

// Rota de Listagem: Blog Industrial
router.get('/blog', webController.blog);

// Rota de Detalhe: Postagem Individual do Blog
router.get('/blog/:slug', webController.blogSingle);

/**
 * --- ROTAS DE INTERAÇÃO (FORMULÁRIOS) ---
 */

/**
 * Processamento do Formulário de Contato
 * - contactLimiter: Evita spam de mensagens (limite por IP)
 * - sanitizeInput: Limpa os dados contra injeção de scripts (XSS)
 * - validateEmail: Garante formato de e-mail válido
 */
router.post('/contato', 
    contactLimiter, 
    sanitizeInput, 
    validateEmail, 
    webController.postContact
);

/**
 * Inscrição na Newsletter
 * - sanitizeInput: Limpa a entrada
 * - validateEmail: Verifica o e-mail
 */
router.post('/newsletter', 
    sanitizeInput, 
    validateEmail, 
    webController.postNewsletter
);

/**
 * Rota de Sitemap (Otimização SEO)
 * Útil para informar ao Google a estrutura do site.
 */
router.get('/sitemap.xml', (req, res) => {
    // Lógica básica para redirecionar ou servir um XML estático/dinâmico no futuro
    res.type('application/xml');
    res.send('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://metarlugia.onrender.com/</loc></url></urlset>');
});

/**
 * Rota Robots.txt
 */
router.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send("User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /auth/");
});

module.exports = router;