/**
 * SERVICES/SUPABASESERVICE.JS
 * Camada de abstração para operações no Banco de Dados Supabase.
 * Fornece métodos reutilizáveis para CRUD e consultas complexas.
 */

const supabase = require('../config/supabase');

const supabaseService = {

    /**
     * BUSCAR TODOS (GENÉRICO)
     * @param {string} table - Nome da tabela
     * @param {string} orderBy - Campo para ordenação (padrão: created_at)
     * @param {boolean} ascending - Ordem ascendente ou descendente
     */
    async getAll(table, orderBy = 'created_at', ascending = false) {
        try {
            const { data, error } = await supabase
                .from(table)
                .select('*')
                .order(orderBy, { ascending });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error(`Erro ao buscar dados na tabela ${table}:`, error.message);
            throw error;
        }
    },

    /**
     * BUSCAR POR ID (GENÉRICO)
     * @param {string} table - Nome da tabela
     * @param {string} id - UUID do registro
     */
    async getById(table, id) {
        try {
            const { data, error } = await supabase
                .from(table)
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error(`Erro ao buscar registro ${id} na tabela ${table}:`, error.message);
            throw error;
        }
    },

    /**
     * BUSCAR POR SLUG (USADO EM BLOG E SERVIÇOS)
     * @param {string} table - Nome da tabela
     * @param {string} slug - Slug amigável
     */
    async getBySlug(table, slug) {
        try {
            const { data, error } = await supabase
                .from(table)
                .select('*')
                .eq('slug', slug)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error(`Erro ao buscar slug ${slug} na tabela ${table}:`, error.message);
            return null;
        }
    },

    /**
     * CRIAR REGISTRO (GENÉRICO)
     * @param {string} table - Nome da tabela
     * @param {object} data - Objeto com os dados para inserção
     */
    async create(table, data) {
        try {
            const { data: createdRecord, error } = await supabase
                .from(table)
                .insert([data])
                .select();

            if (error) throw error;
            return createdRecord[0];
        } catch (error) {
            console.error(`Erro ao criar registro na tabela ${table}:`, error.message);
            throw error;
        }
    },

    /**
     * ATUALIZAR REGISTRO (GENÉRICO)
     * @param {string} table - Nome da tabela
     * @param {string} id - UUID do registro
     * @param {object} data - Objeto com os campos a serem atualizados
     */
    async update(table, id, data) {
        try {
            const { data: updatedRecord, error } = await supabase
                .from(table)
                .update(data)
                .eq('id', id)
                .select();

            if (error) throw error;
            return updatedRecord[0];
        } catch (error) {
            console.error(`Erro ao atualizar registro ${id} na tabela ${table}:`, error.message);
            throw error;
        }
    },

    /**
     * EXCLUIR REGISTRO (GENÉRICO)
     * @param {string} table - Nome da tabela
     * @param {string} id - UUID do registro
     */
    async delete(table, id) {
        try {
            const { error } = await supabase
                .from(table)
                .delete()
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error(`Erro ao excluir registro ${id} na tabela ${table}:`, error.message);
            throw error;
        }
    },

    /**
     * CONSULTA CUSTOMIZADA: PORTFÓLIO COM IMAGENS DA GALERIA
     */
    async getPortfolioWithImages() {
        try {
            const { data, error } = await supabase
                .from('portfolio')
                .select(`
                    *,
                    portfolio_images (
                        id,
                        image_url,
                        display_order
                    )
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error(`Erro ao buscar portfólio completo:`, error.message);
            throw error;
        }
    },

    /**
     * CONSULTA CUSTOMIZADA: BUSCAR PROJETO ÚNICO COM GALERIA
     */
    async getProjectBySlug(slug) {
        try {
            const { data, error } = await supabase
                .from('portfolio')
                .select(`
                    *,
                    portfolio_images (
                        id,
                        image_url,
                        display_order
                    )
                `)
                .eq('slug', slug)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error(`Erro ao buscar projeto ${slug}:`, error.message);
            return null;
        }
    },

    /**
     * CONSULTA CUSTOMIZADA: BLOG POST COM DADOS DO AUTOR
     */
    async getBlogPosts() {
        try {
            const { data, error } = await supabase
                .from('blog_posts')
                .select(`
                    *,
                    author:profiles (
                        full_name,
                        avatar_url
                    )
                `)
                .order('published_at', { ascending: false });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error(`Erro ao buscar blog posts:`, error.message);
            throw error;
        }
    },

    /**
     * CONSULTA: BUSCAR SLIDES ATIVOS DO HERO
     */
    async getActiveHeroSlides() {
        try {
            const { data, error } = await supabase
                .from('hero_slides')
                .select('*')
                .eq('is_active', true)
                .order('display_order', { ascending: true });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error(`Erro ao buscar slides do Hero:`, error.message);
            return [];
        }
    },

    /**
     * CONSULTA: BUSCAR TODOS OS LEADS (CONTATOS)
     */
    async getLeads() {
        return await this.getAll('contacts', 'created_at', false);
    },

    /**
     * CONTAR REGISTROS (Para o resumo do Dashboard)
     */
    async countTable(table) {
        try {
            const { count, error } = await supabase
                .from(table)
                .select('*', { count: 'exact', head: true });
            
            if (error) throw error;
            return count || 0;
        } catch (error) {
            console.error(`Erro ao contar registros da tabela ${table}:`, error.message);
            return 0;
        }
    }
};

module.exports = supabaseService;