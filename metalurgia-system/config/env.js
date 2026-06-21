/**
 * CONFIG/ENV.JS
 * Validação de integridade do ambiente.
 * Verifica se todas as variáveis necessárias do .env estão presentes e corretas.
 */

const requiredEnvVars = [
    'PORT',
    'NODE_ENV',
    'SUPABASE_URL',
    'SUPABASE_KEY',
    'SESSION_SECRET',
    'ADMIN_EMAIL',
    'ADMIN_PASSWORD'
];

const validateEnv = () => {
    const missingVars = [];

    requiredEnvVars.forEach(envVar => {
        if (!process.env[envVar]) {
            missingVars.push(envVar);
        }
    });

    if (missingVars.length > 0) {
        console.error('====================================================');
        console.error('❌ ERRO DE CONFIGURAÇÃO: Variáveis de ambiente faltando!');
        console.error('As seguintes chaves não foram encontradas no seu .env:');
        missingVars.forEach(v => console.error(`  - ${v}`));
        console.error('====================================================');
        
        // Em produção, encerra o processo para evitar falhas críticas
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
    } else {
        console.log('✅ AMBIENTE: Variáveis validadas com sucesso.');
    }
};

module.exports = validateEnv;