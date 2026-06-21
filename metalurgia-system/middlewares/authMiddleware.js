/**
 * MIDDLEWARES/AUTHMIDDLEWARE.JS
 * Protetor de rotas privadas e administrativas.
 * Verifica a validade da sessão no Express-Session e permissões de nível.
 */

const authMiddleware = {

    /**
     * IS AUTHENTICATED
     * Verifica se existe um objeto de usuário na sessão atual.
     * Caso não exista, redireciona para o login com mensagem de erro.
     */
    isAuthenticated: (req, res, next) => {
        // Verifica se a sessão existe e se contém os dados do usuário
        if (req.session && req.session.user) {
            // Torna os dados do usuário disponíveis globalmente nas views EJS
            res.locals.user = req.session.user;
            return next();
        }

        // Se não autenticado, limpa qualquer resquício de sessão e redireciona
        req.flash('error_msg', 'Acesso negado. Por favor, faça login para acessar esta área.');
        return res.redirect('/auth/login');
    },

    /**
     * IS ADMIN
     * Verifica se o usuário autenticado possui o cargo de administrador.
     * Garante que usuários comuns (se houver no futuro) não acessem o dashboard.
     */
    isAdmin: (req, res, next) => {
        if (req.session.user && req.session.user.role === 'admin') {
            return next();
        }

        req.flash('error_msg', 'Você não tem permissão de administrador para acessar este recurso.');
        return res.redirect('/');
    },

    /**
     * GUEST ONLY (REDIRECT IF LOGGED IN)
     * Impede que um usuário já logado acesse a página de login novamente.
     * Redireciona automaticamente para o Dashboard se ele tentar entrar no /login.
     */
    guestOnly: (req, res, next) => {
        if (req.session && req.session.user) {
            return res.redirect('/admin/dashboard');
        }
        next();
    },

    /**
     * ATTACH USER TO LOCALS
     * Middleware global para garantir que res.locals.user esteja sempre sincronizado
     * com a sessão em todas as requisições, facilitando a lógica no Header/Navbar.
     */
    attachUserToLocals: (req, res, next) => {
        res.locals.user = req.session.user || null;
        next();
    }
};

module.exports = authMiddleware;