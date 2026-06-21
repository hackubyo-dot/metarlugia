/**
 * CONTROLLERS/ADMINCONTROLLER.JS
 * Responsável pela gestão do Painel Administrativo Geral.
 */

const supabaseService = require('../services/supabaseService');

const adminController = {

    /**
     * DASHBOARD HOME (Visão Geral)
     * Renderiza a página principal do admin com contadores e atividades recentes.
     */
    index: async (req, res) => {
        try {
            // Busca contagens para os cards de estatísticas em paralelo
            const [
                countServices,
                countPortfolio,
                countBlog,
                countLeads,
                recentLeads
            ] = await Promise.all([
                supabaseService.countTable('services'),
                supabaseService.countTable('portfolio'),
                supabaseService.countTable('blog_posts'),
                supabaseService.countTable('contacts'),
                supabaseService.getAll('contacts', 'created_at', false) // Busca contatos recentes
            ]);

            res.render('admin/dashboard', {
                title: 'Painel de Controle',
                stats: {
                    services: countServices,
                    projects: countPortfolio,
                    posts: countBlog,
                    leads: countLeads
                },
                recentLeads: recentLeads.slice(0, 5), // Exibe apenas os 5 últimos contatos
                layout: 'layouts/admin' // Define o uso do layout administrativo
            });
        } catch (error) {
            console.error('Erro ao carregar Dashboard:', error.message);
            req.flash('error_msg', 'Erro ao carregar estatísticas do sistema.');
            res.render('admin/dashboard', {
                title: 'Painel de Controle',
                stats: { services: 0, projects: 0, posts: 0, leads: 0 },
                recentLeads: [],
                layout: 'layouts/admin'
            });
        }
    },

    /**
     * GESTÃO DE LEADS (Contatos Recebidos)
     */
    leads: async (req, res) => {
        try {
            const leads = await supabaseService.getAll('contacts', 'created_at', false);
            
            res.render('admin/leads/index', {
                title: 'Contatos Recebidos',
                leads,
                layout: 'layouts/admin'
            });
        } catch (error) {
            console.error('Erro ao buscar leads:', error.message);
            req.flash('error_msg', 'Erro ao carregar lista de contatos.');
            res.redirect('/admin/dashboard');
        }
    },

    /**
     * EXCLUIR UM LEAD
     */
    deleteLead: async (req, res) => {
        try {
            const { id } = req.params;
            await supabaseService.delete('contacts', id);
            
            req.flash('success_msg', 'Contato removido com sucesso.');
            res.redirect('/admin/leads');
        } catch (error) {
            console.error('Erro ao excluir lead:', error.message);
            req.flash('error_msg', 'Não foi possível excluir o contato.');
            res.redirect('/admin/leads');
        }
    },

    /**
     * GESTÃO DE NEWSLETTER
     */
    newsletter: async (req, res) => {
        try {
            const subscribers = await supabaseService.getAll('newsletter', 'created_at', false);
            
            res.render('admin/newsletter/index', {
                title: 'Assinantes da Newsletter',
                subscribers,
                layout: 'layouts/admin'
            });
        } catch (error) {
            console.error('Erro ao buscar assinantes:', error.message);
            req.flash('error_msg', 'Erro ao carregar lista de newsletter.');
            res.redirect('/admin/dashboard');
        }
    },

    /**
     * EXCLUIR ASSINANTE DA NEWSLETTER
     */
    deleteNewsletter: async (req, res) => {
        try {
            const { id } = req.params;
            await supabaseService.delete('newsletter', id);
            
            req.flash('success_msg', 'E-mail removido da lista.');
            res.redirect('/admin/newsletter');
        } catch (error) {
            console.error('Erro ao excluir e-mail:', error.message);
            req.flash('error_msg', 'Erro ao remover assinatura.');
            res.redirect('/admin/newsletter');
        }
    },

    /**
     * MARCAR CONTATO COMO LIDO
     */
    markLeadRead: async (req, res) => {
        try {
            const { id } = req.params;
            await supabaseService.update('contacts', id, { is_read: true, status: 'read' });
            
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
};

module.exports = adminController;