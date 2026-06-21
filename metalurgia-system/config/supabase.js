/**
 * CONFIG/SUPABASE.JS
 * Configuração e inicialização do cliente Supabase.
 * Corrigido para suportar WebSockets no Node.js < 22.
 */

const { createClient } = require('@supabase/supabase-js');
const ws = require('ws'); // Biblioteca necessária para Realtime no Node.js v20

// Carregamento das variáveis de ambiente
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Verificação de integridade das credenciais
if (!supabaseUrl || !supabaseKey) {
    console.error('====================================================');
    console.error('❌ ERRO CRÍTICO: SUPABASE_URL ou SUPABASE_KEY faltando.');
    console.error('Verifique o seu arquivo .env');
    console.error('====================================================');
    process.exit(1);
}

/**
 * Opções de configuração do cliente
 * Inclui o transportador de WebSocket (ws) para evitar o erro de detecção de versão.
 */
const options = {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    },
    global: {
        headers: { 'x-application-name': 'metalurgia-futuristica' },
    },
    realtime: {
        params: {
            eventsPerSecond: 10,
        },
        transport: ws // Define o pacote 'ws' como transportador oficial
    }
};

// Instanciação do cliente oficial
const supabase = createClient(supabaseUrl, supabaseKey, options);

/**
 * Função de teste de conexão
 * Executada na inicialização para garantir que o banco está acessível.
 */
const testConnection = async () => {
    try {
        // Tenta buscar um registro simples para validar a chave
        const { data, error } = await supabase.from('_test_connection').select('*').limit(1);
        
        if (error && error.code !== '42P01') {
            console.error('⚠️ ALERTA: Supabase conectado, mas com erro de permissão:', error.message);
        } else {
            console.log('✅ CONEXÃO SUPABASE: WebSocket e Banco de Dados configurados.');
        }
    } catch (err) {
        console.error('❌ ERRO AO CONECTAR NO SUPABASE:', err.message);
    }
};

// Executa o teste
testConnection();

// Exporta a instância única para todo o projeto
module.exports = supabase;