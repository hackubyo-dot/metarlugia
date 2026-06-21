/**
 * CONTROLLERS/HEROCONTROLLER.JS
 * Gestão do Slider Principal (Hero Section).
 */

const supabaseService = require('../services/supabaseService');
const storageService = require('../services/storageService');

const heroController = {

    /**
     * LISTAGEM DE SLIDES (GET)
     */
    index: async (req, res) => {
        try {
            const slides = await supabaseService.getAll('hero_slides', 'display_order', true);
            res.render('admin/hero/index', {
                title: 'Gerenciar Hero Slider',
                slides,
                layout: 'layouts/admin'
            });
        } catch (error) {
            console.error('Erro ao listar slides:', error.message);
            req.flash('error_msg', 'Erro ao carregar os slides.');
            res.redirect('/admin/dashboard');
        }
    },

    /**
     * FORMULÁRIO DE CRIAÇÃO (GET)
     */
    create: (req, res) => {
        res.render('admin/hero/create', {
            title: 'Novo Slide',
            layout: 'layouts/admin'
        });
    },

    /**
     * PROCESSAR CRIAÇÃO (POST)
     */
    store: async (req, res) => {
        try {
            const { title, subtitle, description, button_text, button_link, display_order, media_type } = req.body;
            
            // Validação de arquivo obrigatório na criação
            if (!req.file) {
                req.flash('error_msg', 'Você precisa enviar uma imagem ou vídeo para o slide.');
                return res.redirect('/admin/hero/create');
            }

            // 1. Upload da mídia para o bucket 'hero-media'
            const mediaUrl = await storageService.uploadFile('hero-media', req.file);

            if (!mediaUrl) {
                throw new Error('Falha no upload da mídia para o Supabase Storage.');
            }

            // 2. Salva os dados no Banco de Dados
            await supabaseService.create('hero_slides', {
                title,
                subtitle,
                description,
                button_text,
                button_link,
                display_order: parseInt(display_order) || 0,
                media_url: mediaUrl,
                media_type: media_type || 'image',
                is_active: true
            });

            req.flash('success_msg', 'Slide criado com sucesso!');
            res.redirect('/admin/hero');

        } catch (error) {
            console.error('Erro ao salvar slide:', error.message);
            req.flash('error_msg', 'Erro ao criar slide: ' + error.message);
            res.redirect('/admin/hero/create');
        }
    },

    /**
     * FORMULÁRIO DE EDIÇÃO (GET)
     */
    edit: async (req, res) => {
        try {
            const { id } = req.params;
            const slide = await supabaseService.getById('hero_slides', id);

            if (!slide) {
                req.flash('error_msg', 'Slide não encontrado.');
                return res.redirect('/admin/hero');
            }

            res.render('admin/hero/edit', {
                title: 'Editar Slide',
                slide,
                layout: 'layouts/admin'
            });
        } catch (error) {
            req.flash('error_msg', 'Erro ao carregar dados do slide.');
            res.redirect('/admin/hero');
        }
    },

    /**
     * PROCESSAR ATUALIZAÇÃO (POST)
     */
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { title, subtitle, description, button_text, button_link, display_order, media_type, is_active } = req.body;
            
            // Busca o slide atual para verificar mídia antiga
            const currentSlide = await supabaseService.getById('hero_slides', id);
            let mediaUrl = currentSlide.media_url;

            // 1. Se um novo arquivo foi enviado, substitui o antigo
            if (req.file) {
                // Upload do novo
                const newMediaUrl = await storageService.uploadFile('hero-media', req.file);
                if (newMediaUrl) {
                    // Exclui o antigo do Storage para economizar espaço
                    await storageService.deleteFile('hero-media', currentSlide.media_url);
                    mediaUrl = newMediaUrl;
                }
            }

            // 2. Atualiza o registro no Banco de Dados
            await supabaseService.update('hero_slides', id, {
                title,
                subtitle,
                description,
                button_text,
                button_link,
                display_order: parseInt(display_order) || 0,
                media_url: mediaUrl,
                media_type: media_type,
                is_active: is_active === 'true' || is_active === true
            });

            req.flash('success_msg', 'Slide atualizado com sucesso!');
            res.redirect('/admin/hero');

        } catch (error) {
            console.error('Erro ao atualizar slide:', error.message);
            req.flash('error_msg', 'Erro ao atualizar slide.');
            res.redirect(`/admin/hero/edit/${req.params.id}`);
        }
    },

    /**
     * EXCLUIR SLIDE (POST/DELETE)
     */
    destroy: async (req, res) => {
        try {
            const { id } = req.params;
            const slide = await supabaseService.getById('hero_slides', id);

            if (slide) {
                // 1. Remove o arquivo físico do Storage
                await storageService.deleteFile('hero-media', slide.media_url);
                
                // 2. Remove o registro do Banco de Dados
                await supabaseService.delete('hero_slides', id);
                
                req.flash('success_msg', 'Slide excluído permanentemente.');
            }

            res.redirect('/admin/hero');
        } catch (error) {
            console.error('Erro ao excluir slide:', error.message);
            req.flash('error_msg', 'Erro ao excluir slide.');
            res.redirect('/admin/hero');
        }
    },

    /**
     * ALTERAR STATUS (Ativar/Desativar rapidamente)
     */
    toggleStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const slide = await supabaseService.getById('hero_slides', id);
            
            await supabaseService.update('hero_slides', id, {
                is_active: !slide.is_active
            });

            res.json({ success: true, newState: !slide.is_active });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
};

module.exports = heroController;