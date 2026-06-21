/**
 * SERVICES/AUTHSERVICE.JS
 * Camada responsável pela segurança e autenticação do sistema.
 * Utiliza o Supabase Auth para validar credenciais e gerenciar sessões.
 */

const supabase = require('../config/supabase');

const authService = {

    /**
     * LOGIN DE ADMINISTRADOR
     * @param {string} email - Email cadastrado no Supabase Auth
     * @param {string} password - Senha do administrador
     * @returns {object} - Objeto com os dados do usuário e perfil
     */
    async login(email, password) {
        try {
            // 1. Tenta autenticar via Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (authError) {
                // Erros comuns: 'Invalid login credentials', 'Email not confirmed'
                throw new Error(authError.message);
            }

            if (!authData.user) {
                throw new Error('Usuário não encontrado.');
            }

            // 2. Busca informações complementares na tabela 'profiles'
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('email', email)
                .single();

            if (profileError) {
                console.warn('⚠️ Alerta: Usuário autenticado mas perfil na tabela "profiles" não foi encontrado.');
            }

            // 3. Retorna objeto consolidado para ser salvo na Sessão (Express-Session)
            return {
                id: authData.user.id,
                email: authData.user.email,
                full_name: profile ? profile.full_name : 'Administrador',
                avatar_url: profile ? profile.avatar_url : null,
                role: profile ? profile.role : 'admin',
                last_login: authData.user.last_sign_in_at,
                token: authData.session.access_token
            };

        } catch (error) {
            console.error('Erro no processo de login:', error.message);
            throw error;
        }
    },

    /**
     * LOGOUT
     * Encerra a sessão no Supabase Auth.
     */
    async logout() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Erro ao realizar logout:', error.message);
            return false;
        }
    },

    /**
     * VERIFICAR SESSÃO ATIVA
     * Verifica se o token ainda é válido junto ao Supabase.
     */
    async checkSession() {
        try {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error || !session) return null;
            return session;
        } catch (error) {
            return null;
        }
    },

    /**
     * RECUPERAÇÃO DE SENHA
     * Envia e-mail para reset de senha.
     * @param {string} email 
     */
    async resetPasswordRequest(email) {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${process.env.APP_URL}/auth/reset-password`,
            });
            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Erro ao solicitar reset de senha:', error.message);
            throw error;
        }
    },

    /**
     * ATUALIZAR DADOS DO PERFIL
     * @param {string} userId - UUID do usuário
     * @param {object} updates - Campos a serem atualizados (ex: full_name)
     */
    async updateProfile(userId, updates) {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', userId)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error.message);
            throw error;
        }
    }
};

module.exports = authService;