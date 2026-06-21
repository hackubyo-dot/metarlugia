/**
 * MIDDLEWARES/ERRORMIDDLEWARE.JS
 * Gerenciamento centralizado de erros da aplicação.
 */

const errorMiddleware = {

    /**
     * NOT FOUND HANDLER (404)
     * Captura qualquer rota que não foi definida nos arquivos de rotas.
     */
    notFound: (req, res, next) => {
        const err = new Error('Página não encontrada');
        err.status = 404;
        next(err);
    },

    /**
     * GLOBAL ERROR HANDLER (500)
     * Middleware final que processa todos os erros passados via next(err).
     */
    errorHandler: (err, req, res, next) => {
        const statusCode = err.status || 500;
        
        // Log detalhado no console para o desenvolvedor
        console.error('================ ERROR LOG ================');
        console.error(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
        console.error(`Status: ${statusCode}`);
        console.error(`Mensagem: ${err.message}`);
        if (process.env.NODE_ENV === 'development') {
            console.error('Stack Trace:', err.stack);
        }
        console.error('===========================================');

        // Resposta para o cliente
        res.status(statusCode);

        // Se for uma requisição API (inicia com /api), retorna JSON
        if (req.path.startsWith('/api')) {
            return res.json({
                success: false,
                status: statusCode,
                message: err.message,
                stack: process.env.NODE_ENV === 'development' ? err.stack : {}
            });
        }

        // Se for uma requisição web, renderiza a página de erro EJS
        res.render('pages/error', {
            title: statusCode === 404 ? 'Página Não Encontrada' : 'Erro Interno',
            errorCode: statusCode,
            errorMessage: statusCode === 404 
                ? 'A página que você está procurando não existe ou foi movida.' 
                : 'Ocorreu um problema inesperado em nossos servidores. Nossa equipe técnica já foi notificada.',
            seo: {
                title: `Erro ${statusCode}`,
                description: 'Ocorreu um erro no sistema.'
            }
        });
    }
};

module.exports = errorMiddleware;