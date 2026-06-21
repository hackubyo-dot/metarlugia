/**
 * ==========================================================================
 * APP.JS - NÚCLEO DE CONFIGURAÇÃO E ORQUESTRAÇÃO DO SISTEMA
 * Projeto: Metalurgia Futurística Leonardo Serra
 * Versão: 1.1.5 (FULL STACK ENTERPRISE - ESTÁVEL)
 * 
 * Responsabilidades:
 * - Segurança de Cabeçalhos (Helmet & CSP)
 * - Compressão e Performance de Dados
 * - Gestão de Sessão e Persistência de Admin
 * - Orquestração de View Engine (EJS & Layouts)
 * - Middleware Global de Variáveis (Injeção de Helpers e Flash)
 * - Roteamento Estruturado (Web, Auth, Admin, API)
 * - Tratamento de Erros e Fallbacks do Servidor
 * ==========================================================================
 */

require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
const cors = require('cors');
const expressLayouts = require('express-ejs-layouts');

// Importação dos Helpers do EJS (Funções utilitárias para as views)
const ejsHelpers = require('./helpers/ejsHelpers');

// Inicialização da Aplicação Express
const app = express();

/**
 * 1. CONFIGURAÇÕES DE SEGURANÇA AVANÇADA (HELMET & CSP)
 * Configurado rigorosamente para permitir Supabase, Google Maps, Grainy Gradients e scripts industriais.
 */
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "img-src": [
                "'self'", 
                "data:", 
                "blob:", 
                "https://atmqauctdfclvmaoijwl.supabase.co", 
                "https://*.supabase.co",
                "https://grainy-gradients.vercel.app",
                "https://images.unsplash.com"
            ],
            "media-src": [
                "'self'", 
                "blob:", 
                "https://atmqauctdfclvmaoijwl.supabase.co", 
                "https://*.supabase.co", 
                "data:"
            ],
            "font-src": [
                "'self'", 
                "data:", 
                "https://fonts.gstatic.com", 
                "https://cdnjs.cloudflare.com", 
                "https://cdn.jsdelivr.net"
            ],
            "script-src": [
                "'self'", 
                "'unsafe-inline'", 
                "'unsafe-eval'", 
                "https://cdn.jsdelivr.net", 
                "https://unpkg.com", 
                "https://cdnjs.cloudflare.com", 
                "https://cdn.ckeditor.com"
            ],
            "script-src-attr": ["'unsafe-inline'"], // Habilita eventos 'onclick' dinâmicos do banco
            "style-src": [
                "'self'", 
                "'unsafe-inline'", 
                "https://fonts.googleapis.com", 
                "https://cdn.jsdelivr.net", 
                "https://cdnjs.cloudflare.com", 
                "https://unpkg.com"
            ],
            "connect-src": [
                "'self'", 
                "https://atmqauctdfclvmaoijwl.supabase.co", 
                "https://*.supabase.co", 
                "https://cdn.jsdelivr.net", 
                "https://unpkg.com"
            ],
            "frame-src": [
                "'self'", 
                "https://www.google.com", 
                "https://*.google.com"
            ],
        },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

/**
 * 2. PERFORMANCE E ACESSIBILIDADE
 */
app.use(cors());
app.use(compression()); // Comprime respostas HTTP para redes móveis lentas

// Logger de Requisições (Apenas em Desenvolvimento)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

/**
 * 3. PROCESSAMENTO DE DADOS (PARSERS)
 */
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

/**
 * 4. GESTÃO DE SESSÃO E FEEDBACK AO USUÁRIO
 */
app.use(session({
    secret: process.env.SESSION_SECRET || 'metalurgia_secret_premium_2025_serra',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Em desenvolvimento ou Render/HTTP manter false
        maxAge: 1000 * 60 * 60 * 24 // Duração de 24 horas
    }
}));
app.use(flash());

/**
 * 5. MOTOR DE RENDERIZAÇÃO (EJS & LAYOUTS)
 * Configuração de caminhos absolutos usando path.join(__dirname)
 */
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/main'); // Layout padrão para o site público

// Extração automática de scripts e estilos dos arquivos EJS para o layout
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);

/**
 * 6. RECURSOS ESTÁTICOS E UPLOADS
 */
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

/**
 * 7. MIDDLEWARE GLOBAL DE INJEÇÃO DE DADOS
 * Disponibiliza variáveis em todas as views (.ejs) automaticamente
 */
app.use((req, res, next) => {
    // Mensagens de alerta (Feedback do sistema)
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    
    // Dados de Autenticação e Sessão
    res.locals.user = req.session.user || null;
    
    // Utilitários de Backend para Frontend
    res.locals.helpers = ejsHelpers;
    res.locals.currentPath = req.path;
    res.locals.site_name = process.env.SITE_NAME || 'Metalurgia Futurística';
    res.locals.year = new Date().getFullYear();
    
    next();
});

/**
 * 8. MAPEAMENTO DAS ROTAS DO SISTEMA
 */
const webRoutes = require('./routes/web.routes');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const apiRoutes = require('./routes/api.routes');

app.use('/', webRoutes);         // Frontend Público (Home, Blog, Portfólio)
app.use('/auth', authRoutes);     // Sistema de Login e Recuperação
app.use('/admin', adminRoutes);   // Painel de Gestão (Dashboard)
app.use('/api', apiRoutes);       // Endpoints de dados e integrações AJAX

/**
 * 9. TRATAMENTO DE ERROS - 404 (PÁGINA NÃO ENCONTRADA)
 */
app.use((req, res, next) => {
    res.status(404).render('pages/error', {
        title: 'Página Não Localizada',
        errorCode: 404,
        errorMessage: 'A página solicitada não existe ou foi movida permanentemente no servidor metalurgia.',
        seo: { title: '404 - Não Encontrado', description: '' }
    });
});

/**
 * 10. TRATAMENTO DE ERROS - 500 (FALHA INTERNA DO SERVIDOR)
 */
app.use((err, req, res, next) => {
    // Log detalhado no console do servidor para debug técnico
    console.error('--- ERRO CRÍTICO DETECTADO ---');
    console.error(err.stack);
    
    res.status(500).render('pages/error', {
        title: 'Falha no Sistema',
        errorCode: 500,
        errorMessage: 'Ocorreu um erro interno inesperado. Nossa equipe de engenharia já foi notificada.',
        seo: { title: '500 - Erro Interno', description: '' }
    });
});

/**
 * 11. INICIALIZAÇÃO DO SERVIDOR INDUSTRIAL
 * O binding em '0.0.0.0' é necessário para funcionamento em redes Wi-Fi e Cloud (Render).
 */
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, '0.0.0.0', () => {
        console.log('========================================================');
        console.log(`🚀 SERVIDOR METALURGIA PRONTO EM: http://localhost:${PORT}`);
        console.log(`📂 AMBIENTE: ${process.env.NODE_ENV || 'production'}`);
        console.log(`📅 DATA: ${new Date().toLocaleString()}`);
        console.log('========================================================');
    });
}

// Exportação para uso em testes ou instâncias externas
module.exports = app;
