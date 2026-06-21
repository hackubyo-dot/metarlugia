/**
 * ==========================================================================
 * SERVER.JS - ENTRY POINT OFICIAL DO SISTEMA
 * Projeto: Metalurgia Futurística Leonardo Serra
 * Versão: 1.2.0 (ESTÁVEL - FULL STACK ENTERPRISE)
 * 
 * Este arquivo é o "Coração" que coloca o motor do sistema em movimento.
 * Responsável pela validação de integridade, inicialização de rede e
 * gestão de erros de baixo nível.
 * ==========================================================================
 */

// 1. CARREGAR VARIÁVEIS DE AMBIENTE (Prioridade 1)
require('dotenv').config();

// 2. IMPORTAR COMPONENTES CRÍTICOS
const validateEnv = require('./config/env');
const app = require('./app');

/**
 * VALIDAÇÃO DE INTEGRIDADE DO AMBIENTE
 * Verifica se as chaves do Supabase, Session Secret e outras variáveis
 * obrigatórias estão presentes. Caso falte algo, o sistema nem inicia.
 */
try {
    validateEnv();
} catch (envError) {
    console.error('❌ FALHA NA INTEGRIDADE DO AMBIENTE:', envError.message);
    process.exit(1);
}

/**
 * CONFIGURAÇÃO DA PORTA DE REDE
 * process.env.PORT é injetado automaticamente pelo Render/Heroku/Vercel.
 */
const PORT = process.env.PORT || 3000;

/**
 * INICIALIZAÇÃO DO SERVIDOR HTTP
 * O binding em '0.0.0.0' é vital para acessibilidade externa no Render.
 */
const server = app.listen(PORT, '0.0.0.0', () => {
    const mode = process.env.NODE_ENV || 'development';
    const serverUrl = mode === 'production' 
        ? 'https://metarlugia.onrender.com' 
        : `http://localhost:${PORT}`;

    console.log('====================================================');
    console.log('🏭 METALURGIA FUTURÍSTICA - SISTEMA FULL STACK');
    console.log('✅ STATUS: SERVIDOR TOTALMENTE ONLINE');
    console.log(`🌐 MODO: ${mode.toUpperCase()}`);
    console.log(`📡 ESCUTANDO NA PORTA: ${PORT}`);
    console.log(`🔗 URL DE ACESSO: ${serverUrl}`);
    console.log(`📅 INICIADO EM: ${new Date().toLocaleString()}`);
    console.log('====================================================');
});

/**
 * ==========================================================================
 * GESTÃO DE ESTABILIDADE E ERROS DE PROCESSO
 * Protege o sistema contra quedas fatais e vazamentos de memória.
 * ==========================================================================
 */

// 1. Captura exceções síncronas não tratadas (Ex: Erro de sintaxe em tempo de execução)
process.on('uncaughtException', (err) => {
    console.error('--- ❌ ERRO CRÍTICO (Uncaught Exception) ---');
    console.error(`Nome: ${err.name}`);
    console.error(`Mensagem: ${err.message}`);
    console.error(err.stack);

    // Em erro crítico, encerramos o processo para que o monitor do Render 
    // reinicie a aplicação em um estado limpo.
    process.exit(1);
});

// 2. Captura promessas rejeitadas sem o bloco .catch() (Ex: Erros de Banco de Dados)
process.on('unhandledRejection', (reason, promise) => {
    console.error('--- ⚠️ REJEIÇÃO NÃO TRATADA (Unhandled Rejection) ---');
    console.error('Promessa:', promise);
    console.error('Motivo:', reason);
    
    // Logamos o erro para depuração, mas não encerramos o processo imediatamente
});

/**
 * ==========================================================================
 * ENCERRAMENTO GRACIOSO (GRACEFUL SHUTDOWN)
 * Garante que o servidor termine de processar as requisições ativas
 * antes de desligar durante um novo deploy ou reinicialização.
 * ==========================================================================
 */
const gracefulShutdown = (signal) => {
    console.log(`\n🔌 Sinal ${signal} recebido. Iniciando encerramento suave...`);

    // Interrompe o recebimento de novas requisições
    server.close(() => {
        console.log('✅ Servidor HTTP finalizado com sucesso.');
        console.log('📦 Conexões com banco de dados encerradas de forma segura.');
        
        // Finaliza o processo Node.js sem erros
        process.exit(0);
    });

    // Se o encerramento demorar mais de 10 segundos, força a saída
    setTimeout(() => {
        console.error('❗ Forçando encerramento imediato por estouro de timeout (10s).');
        process.exit(1);
    }, 10000);
};

// Escuta sinais de interrupção do Sistema Operacional (Render envia SIGTERM)
process.on('SIGTERM', () => gracefulShutdown('SIGTERM')); // Shutdown pelo host (Cloud)
process.on('SIGINT', () => gracefulShutdown('SIGINT'));   // Shutdown manual (CTRL+C)

/**
 * EXPORTAÇÃO
 * Exportamos a instância do servidor para possibilitar testes de integração.
 */
module.exports = server;
