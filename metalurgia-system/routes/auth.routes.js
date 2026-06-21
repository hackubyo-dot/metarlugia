/**
 * ROUTES/AUTH.ROUTES.JS
 * Rotas de Autenticação e Gestão de Acesso ao Painel.
 */

const express = require('express');
const router = express.Router();

// Importação do Controlador de Autenticação
const authController = require('../controllers/authController');

// Importação de Middlewares
const { guestOnly } = require('../middlewares/authMiddleware');
const { authLimiter, sanitizeInput } = require('../middlewares/securityMiddleware');

/**
 * --- ROTAS DE ACESSO (LOGIN) ---
 */

/**
 * Exibir formulário de Login
 * - guestOnly: Impede que quem já está logado acesse esta página.
 */
router.get('/login', guestOnly, authController.showLogin);

/**
 * Processar tentativa de Login
 * - authLimiter: Bloqueia IPs após 5 tentativas falhas em 30 minutos.
 * - sanitizeInput: Limpa os campos de texto.
 */
router.post('/login', 
    authLimiter, 
    sanitizeInput, 
    authController.login
);

/**
 * Encerrar Sessão (Logout)
 */
router.get('/logout', authController.logout);

/**
 * --- ROTAS DE RECUPERAÇÃO DE SENHA ---
 */

/**
 * Exibir formulário de esqueci minha senha
 */
router.get('/forgot-password', guestOnly, authController.showForgotPassword);

/**
 * Processar solicitação de reset
 */
router.post('/forgot-password', 
    authLimiter, 
    sanitizeInput, 
    authController.postForgotPassword
);

/**
 * Rota de Callback para Reset de Senha (Link enviado por e-mail)
 * O Supabase redirecionará para cá após o clique no e-mail.
 */
router.get('/reset-password', (req, res) => {
    // Renderiza a view de nova senha se o token estiver presente
    res.render('admin/reset-password', {
        layout: false,
        title: 'Definir Nova Senha'
    });
});

module.exports = router;