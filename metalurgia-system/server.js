/**
 * SERVER.JS - ENTRY POINT OFICIAL
 * Metalurgia Futurística Leonardo Serra
 * 
 * Este arquivo é o responsável por colocar o motor do sistema em movimento.
 */

// 1. Carregar variáveis de ambiente imediatamente
require('dotenv').config();

// 2. Importar validador de ambiente
const validateEnv = require('./config/env');

/**
 * VALIDAÇÃO DE INTEGRIDADE
 * Verifica se todas as chaves do Supabase e configurações de porta 
 * estão presentes antes de tentar carregar a aplicação.
 */
validateEnv();

// 3. Importar a configuração do App (Express)
// Note: O App já vem configurado com Middlewares, EJS e Rotas.
const app = require('./app');

/**
 * CONFIGURAÇÃO DA PORTA
 * process.env.PORT é injetado automaticamente por plataformas como Render e Heroku.
 */
const PORT = process.env.PORT || 3000;

/**
 * INICIALIZAÇÃO DO SERVIDOR HTTP
 * O servidor escuta em '0.0.0.0' para garantir acessibilidade externa em deploy.
 */
const server = app.listen(PORT, '0.0.0.0', () => {
    const mode = process.env.NODE_ENV || 'development';
    const serverUrl = mode === 'production' 
        ? 'https://metarlugia.onrender.com' 
        : `http://localhost:${PORT}`;

    console.log('====================================================');
    console.log(`🏭 METALURGIA FUTURÍSTICA - SISTEMA FULL STACK`);
    console.log(`✅ STATUS: SERVIDOR ONLINE`);
    console.log(`🌐 MODO: ${mode.toUpperCase()}`);
    console.log(`📡 ESCUTANDO NA PORTA: ${PORT}`);
    console.log(`🔗 URL DE ACESSO: ${serverUrl}`);
    console.log('====================================================');
});

/**
 * GESTÃO DE ESTABILIDADE E ERROS CRÍTICOS
 * Protege o sistema contra quedas inesperadas e vazamentos de memória.
 */

// Captura exceções síncronas que não foram tratadas (ex: erro de sintaxe dinâmica)
process.on('uncaughtException', (err) => {
    console.error('❌ ERRO CRÍTICO (Uncaught Exception):', err.name, err.message);
    console.error(err.stack);
    
    // Em erro crítico, encerramos para que o monitor do Render possa reiniciar o app limpo
    process.exit(1);
});

// Captura promessas (Promises) rejeitadas que não possuem .catch()
process.on('unhandledRejection', (reason, promise) => {
    console.error('⚠️ REJEIÇÃO NÃO TRATADA (Unhandled Rejection) em:', promise);
    console.error('Motivo:', reason);
    
    // Não encerramos o processo aqui, apenas logamos para depuração técnica
});

/**
 * ENCERRAMENTO GRACIOSO (GRACEFUL SHUTDOWN)
 * Garante que o servidor termine de processar as requisições atuais 
 * antes de fechar ao receber sinal de desligamento do Render ou Terminal.
 */
const gracefulShutdown = (signal) => {
    console.log(`\n🔌 Sinal ${signal} recebido. Iniciando encerramento suave...`);
    
    server.close(() => {
        console.log('✅ Servidor HTTP finalizado.');
        console.log('📦 Conexões encerradas de forma segura.');
        process.exit(0);
    });

    // Se o fechamento demorar mais de 10 segundos, força o encerramento
    setTimeout(() => {
        console.error('❗ Forçando encerramento imediato por timeout.');
        process.exit(1);
    }, 10000);
};

// Escuta sinais de interrupção do sistema operacional
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

module.exports = server;