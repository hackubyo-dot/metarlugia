/**
 * CONTROLLERS/ABOUTCONTROLLER.JS
 * Gestão da seção "Nossa História" e dados institucionais.
 */

const supabaseService = require('../services/supabaseService');
const storageService = require('../services/storageService');

const aboutController = {

    /**
     * EXIBIR FORMULÁRIO DE EDIÇÃO (GET)
     */
    edit: async (req, res) => {
        try {
            // Busca o registro único da história
            const aboutData = await supabaseService.getAll('about_section', 'created_at', true);
            
            res.render('admin/about/edit', {
                title: 'Editar Nossa História',
                about: aboutData[0] || { title: '', content: '', years_experience: 5 },
                layout: 'layouts/admin'
            });
        } catch (error) {
            console.error('Erro ao carregar About:', error.message);
            req.flash('error_msg', 'Erro ao carregar dados institucionais.');
            res.redirect('/admin/dashboard');
        }
    },

    /**
     * PROCESSAR ATUALIZAÇÃO (POST)
     */
    update: async (req, res) => {
        try {
            const { title, content, years_experience } = req.body;
            
            // Busca o registro atual para gerenciar a imagem
            const aboutData = await supabaseService.getAll('about_section', 'created_at', true);
            const currentAbout = aboutData[0];
            
            let imageUrl = currentAbout ? currentAbout.image_url : null;

            // 1. Processar Nova Imagem se enviada
            if (req.file) {
                const newImageUrl = await storageService.uploadFile('hero-media', req.file);
                if (newImageUrl) {
                    // Remove imagem antiga se existir
                    if (currentAbout && currentAbout.image_url) {
                        await storageService.deleteFile('hero-media', currentAbout.image_url);
                    }
                    imageUrl = newImageUrl;
                }
            }

            // 2. Atualizar ou Criar o registro único
            if (currentAbout) {
                await supabaseService.update('about_section', currentAbout.id, {
                    title,
                    content,
                    years_experience: parseInt(years_experience) || 5,
                    image_url: imageUrl,
                    updated_at: new Date().toISOString()
                });
            } else {
                // Caso o banco esteja vazio (primeiro setup)
                await supabaseService.create('about_section', {
                    title,
                    content,
                    years_experience: parseInt(years_experience) || 5,
                    image_url: imageUrl
                });
            }

            req.flash('success_msg', 'História institucional atualizada com sucesso!');
            res.redirect('/admin/about/edit');

        } catch (error) {
            console.error('Erro ao atualizar história:', error.message);
            req.flash('error_msg', 'Falha ao salvar alterações da história.');
            res.redirect('/admin/about/edit');
        }
    }
};

module.exports = aboutController;