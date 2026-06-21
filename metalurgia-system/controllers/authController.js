/**
 * CONTROLLERS/AUTHCONTROLLER.JS
 * Gerenciamento de Autenticação e Sessão.
 */

const authService = require('../services/authService');

const authController = {

    /**
     * EXIBIR PÁGINA DE LOGIN (GET)
     */
    showLogin: (req, res) => {
        // Se o usuário já estiver logado, redireciona direto para o Dashboard
        if (req.session.user) {
            return res.redirect('/admin/dashboard');
        }

        res.render('admin/login', {
            layout: false, // Não utiliza o layout padrão do admin para a tela de login
            title: 'Login Administrativo'
        });
    },

    /**
     * PROCESSAR LOGIN (POST)
     */
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // 1. Validação básica de campos
            if (!email || !password) {
                req.flash('error_msg', 'Por favor, preencha todos os campos.');
                return res.redirect('/auth/login');
            }

            // 2. Chama o serviço de autenticação (integração com Supabase Auth)
            const user = await authService.login(email, password);

            // 3. Se sucesso, salva os dados na sessão do Express
            req.session.user = {
                id: user.id,
                email: user.email,
                name: user.full_name,
                avatar: user.avatar_url,
                role: user.role,
                token: user.token
            };

            // Salva a sessão e redireciona
            req.session.save((err) => {
                if (err) {
                    console.error('Erro ao salvar sessão:', err);
                    return res.redirect('/auth/login');
                }
                req.flash('success_msg', `Bem-vindo de volta, ${user.full_name}!`);
                res.redirect('/admin/dashboard');
            });

        } catch (error) {
            console.error('Erro no login:', error.message);
            
            // Tratamento de erros amigáveis baseados nas mensagens do Supabase
            let errorMessage = 'Falha na autenticação. Verifique suas credenciais.';
            if (error.message.includes('Invalid login credentials')) {
                errorMessage = 'E-mail ou senha incorretos.';
            } else if (error.message.includes('Email not confirmed')) {
                errorMessage = 'Por favor, confirme seu e-mail antes de acessar.';
            }

            req.flash('error_msg', errorMessage);
            res.redirect('/auth/login');
        }
    },

    /**
     * REALIZAR LOGOUT
     */
    logout: async (req, res) => {
        try {
            // Encerra a sessão no Supabase
            await authService.logout();

            // Destrói a sessão no Express
            req.session.destroy((err) => {
                if (err) {
                    console.error('Erro ao destruir sessão:', err);
                }
                res.redirect('/auth/login');
            });
        } catch (error) {
            console.error('Erro no logout:', error.message);
            res.redirect('/admin/dashboard');
        }
    },

    /**
     * RECUPERAÇÃO DE SENHA (GET)
     */
    showForgotPassword: (req, res) => {
        res.render('admin/forgot-password', {
            layout: false,
            title: 'Recuperar Senha'
        });
    },

    /**
     * PROCESSAR RECUPERAÇÃO DE SENHA (POST)
     */
    postForgotPassword: async (req, res) => {
        try {
            const { email } = req.body;
            await authService.resetPasswordRequest(email);

            req.flash('success_msg', 'Se o e-mail existir em nossa base, você receberá um link de recuperação em instantes.');
            res.redirect('/auth/login');
        } catch (error) {
            req.flash('error_msg', 'Erro ao processar solicitação de recuperação.');
            res.redirect('/auth/forgot-password');
        }
    }
};

module.exports = authController;