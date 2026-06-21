/**
 * APP.JS - CONFIGURAÇÃO CENTRAL DO SISTEMA
 * Metalurgia Futurística Leonardo Serra
 * 
 * Versão: 1.0.1 (Estável - Full Stack)
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

const app = express();

// --- CONFIGURAÇÕES DE SEGURANÇA (CORRIGIDO PARA PERMITIR CLIQUES, MAPAS E SUPABASE) ---
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "img-src": ["'self'", "data:", "blob:", "https://atmqauctdfclvmaoijwl.supabase.co", "https://*.supabase.co"],
            "media-src": ["'self'", "blob:", "https://atmqauctdfclvmaoijwl.supabase.co", "https://*.supabase.co", "data:"],
            "font-src": ["'self'", "data:", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net"],
            "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.jsdelivr.net", "https://unpkg.com", "https://cdnjs.cloudflare.com", "https://cdn.ckeditor.com"],
            "script-src-attr": ["'unsafe-inline'"], // ESSENCIAL: Permite que o 'onclick' do HTML funcione
            "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com", "https://unpkg.com"],
            "connect-src": ["'self'", "https://atmqauctdfclvmaoijwl.supabase.co", "https://*.supabase.co", "https://cdn.jsdelivr.net", "https://unpkg.com"],
            "frame-src": ["'self'", "https://www.google.com", "https://*.google.com"], // ESSENCIAL: Permite o Google Maps
        },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Ativar CORS para requisições cross-origin
app.use(cors());

// --- PERFORMANCE ---
// Comprime as respostas HTTP para acelerar o carregamento em redes móveis
app.use(compression());

// --- LOGGING ---
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// --- PARSERS ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- SESSÃO E MENSAGENS FLASH ---
app.use(session({
    secret: process.env.SESSION_SECRET || 'metalurgia_secret_2025_serra',
    resave: false,
    saveUninitialized: false,
    cookie: {
        // 'secure: false' permite funcionamento em localhost sem HTTPS. 
        // Em produção real com SSL, altere para process.env.NODE_ENV === 'production'
        secure: false, 
        maxAge: 1000 * 60 * 60 * 24 // 24 horas
    }
}));
app.use(flash());

// --- MOTOR DE VISUALIZAÇÃO (EJS) E SISTEMA DE LAYOUTS ---
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/main'); 
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);

// --- ARQUIVOS ESTÁTICOS ---
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// --- MIDDLEWARES GLOBAIS ---
// Injeta variáveis em todas as views .ejs
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.session.user || null;
    res.locals.currentPath = req.path;
    res.locals.site_name = process.env.SITE_NAME || 'Metalurgia Futurística';
    res.locals.year = new Date().getFullYear();
    res.locals.helpers = ejsHelpers; 
    next();
});

// --- IMPORTAÇÃO E MAPEAMENTO DAS ROTAS ---
const webRoutes = require('./routes/web.routes');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const apiRoutes = require('./routes/api.routes');

app.use('/', webRoutes);       // Site público
app.use('/auth', authRoutes);   // Login e Recuperação
app.use('/admin', adminRoutes); // Painel de Controle
app.use('/api', apiRoutes);     // Endpoints AJAX

// --- TRATAMENTO DE ERRO 404 (NÃO ENCONTRADO) ---
app.use((req, res, next) => {
    res.status(404).render('pages/error', {
        title: 'Página Não Encontrada',
        errorCode: 404,
        errorMessage: 'A página que você procura não existe ou foi movida.',
        seo: { title: '404 - Não Encontrado', description: '' }
    });
});

// --- TRATAMENTO DE ERRO 500 (ERRO INTERNO) ---
app.use((err, req, res, next) => {
    console.error('--- SERVER ERROR ---');
    console.error(err.stack);
    res.status(500).render('pages/error', {
        title: 'Erro Interno',
        errorCode: 500,
        errorMessage: 'Ocorreu um erro inesperado em nosso servidor. Nossa equipe técnica já foi notificada.',
        seo: { title: '500 - Erro Interno', description: '' }
    });
});

/**
 * INICIALIZAÇÃO DO SERVIDOR
 * O binding em '0.0.0.0' permite acesso pela rede local/Wi-Fi
 */
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Servidor pronto em: http://localhost:${PORT}`);
    });
}

module.exports = app;