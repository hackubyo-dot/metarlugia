/**
 * ROUTES/API.ROUTES.JS
 * Endpoints para comunicações assíncronas (AJAX / Fetch API).
 */

const express = require('express');
const router = express.Router();

// Importação de Controladores
const webController = require('../controllers/webController');
const adminController = require('../controllers/adminController');
const portfolioController = require('../controllers/portfolioController');

// Importação de Middlewares
const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware');
const { contactLimiter, sanitizeInput } = require('../middlewares/securityMiddleware');

/**
 * ================================================================
 * 1. ROTAS PÚBLICAS DA API
 * ================================================================
 */

/**
 * Inscrição na Newsletter via AJAX
 * Retorna JSON para processamento no frontend.
 */
router.post('/newsletter', sanitizeInput, webController.postNewsletter);

/**
 * Envio de Contato via AJAX (Opcional)
 * Caso prefira usar fetch() no lugar do submit padrão do formulário.
 */
router.post('/contact', contactLimiter, sanitizeInput, webController.postContact);


/**
 * ================================================================
 * 2. ROTAS ADMINISTRATIVAS DA API (Protegidas)
 * Estas rotas exigem que o usuário esteja logado como Admin.
 * ================================================================
 */

/**
 * Marcar Lead como Lido
 * Usado na lista de contatos do Dashboard para atualização instantânea.
 */
router.patch('/leads/:id/read', isAuthenticated, isAdmin, adminController.markLeadRead);

/**
 * Excluir Imagem da Galeria do Portfólio
 * Permite remover fotos individuais de um projeto durante a edição.
 */
router.delete('/portfolio/gallery/:imageId', isAuthenticated, isAdmin, portfolioController.deleteGalleryImage);

/**
 * Rota de Verificação de Saúde (Health Check)
 * Útil para monitoramento do servidor e do banco de dados.
 */
router.get('/health', async (req, res) => {
    try {
        const supabase = require('../config/supabase');
        const { data, error } = await supabase.from('_test_connection').select('*').limit(1);
        
        if (error && error.code !== '42P01') throw error;

        res.status(200).json({
            status: 'online',
            environment: process.env.NODE_ENV,
            timestamp: new Date().toISOString(),
            database: 'connected'
        });
    } catch (err) {
        res.status(500).json({
            status: 'degraded',
            database: 'disconnected',
            error: err.message
        });
    }
});

module.exports = router;