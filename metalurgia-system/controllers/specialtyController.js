/**
 * CONTROLLERS/SPECIALTYCONTROLLER.JS
 * Gestão da Elite 8 Matrix (Especialidades com Vídeo).
 */

const supabaseService = require('../services/supabaseService');
const storageService = require('../services/storageService');

const specialtyController = {

    /**
     * LISTAGEM DE ESPECIALIDADES (Admin)
     */
    index: async (req, res) => {
        try {
            const specialties = await supabaseService.getAll('specialties', 'display_order', true);
            res.render('admin/specialties/index', {
                title: 'Elite 8 Matrix',
                specialties,
                layout: 'layouts/admin'
            });
        } catch (error) {
            console.error('Erro ao listar especialidades:', error.message);
            req.flash('error_msg', 'Erro ao carregar a matriz de especialidades.');
            res.redirect('/admin/dashboard');
        }
    },

    /**
     * FORMULÁRIO DE CRIAÇÃO
     */
    create: async (req, res) => {
        try {
            const currentSpecs = await supabaseService.getAll('specialties');
            if (currentSpecs.length >= 8) {
                req.flash('error_msg', 'O limite de 8 especialidades para a Matrix já foi atingido.');
                return res.redirect('/admin/specialties');
            }
            res.render('admin/specialties/create', {
                title: 'Nova Especialidade Elite',
                layout: 'layouts/admin'
            });
        } catch (error) {
            res.redirect('/admin/specialties');
        }
    },

    /**
     * PROCESSAR CRIAÇÃO (POST)
     */
    store: async (req, res) => {
        try {
            const { name, description, icon_class, display_order } = req.body;
            
            if (!req.files || !req.files['video_file'] || !req.files['thumbnail_file']) {
                req.flash('error_msg', 'O vídeo do processo e a imagem de capa são obrigatórios.');
                return res.redirect('/admin/specialties/create');
            }

            // 1. Upload do Vídeo Industrial
            const videoUrl = await storageService.uploadFile('hero-videos', req.files['video_file'][0]);
            
            // 2. Upload da Thumbnail
            const thumbUrl = await storageService.uploadFile('services', req.files['thumbnail_file'][0]);

            // 3. Salvar no Banco
            await supabaseService.create('specialties', {
                name,
                description,
                icon_class: icon_class || 'fa-bolt',
                media_url: videoUrl,
                thumbnail_url: thumbUrl,
                display_order: parseInt(display_order) || 1
            });

            req.flash('success_msg', 'Especialidade adicionada à Matrix com sucesso!');
            res.redirect('/admin/specialties');

        } catch (error) {
            console.error('Erro ao salvar especialidade:', error.message);
            req.flash('error_msg', 'Erro ao criar especialidade. Verifique os arquivos.');
            res.redirect('/admin/specialties/create');
        }
    },

    /**
     * FORMULÁRIO DE EDIÇÃO
     */
    edit: async (req, res) => {
        try {
            const { id } = req.params;
            const specialty = await supabaseService.getById('specialties', id);

            if (!specialty) {
                req.flash('error_msg', 'Especialidade não encontrada.');
                return res.redirect('/admin/specialties');
            }

            res.render('admin/specialties/edit', {
                title: 'Editar Especialidade',
                specialty,
                layout: 'layouts/admin'
            });
        } catch (error) {
            req.flash('error_msg', 'Erro ao carregar dados.');
            res.redirect('/admin/specialties');
        }
    },

    /**
     * PROCESSAR ATUALIZAÇÃO (POST)
     */
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, description, icon_class, display_order } = req.body;
            
            const currentSpec = await supabaseService.getById('specialties', id);
            let videoUrl = currentSpec.media_url;
            let thumbUrl = currentSpec.thumbnail_url;

            // Atualizar Vídeo se enviado
            if (req.files && req.files['video_file']) {
                const newVideoUrl = await storageService.uploadFile('hero-videos', req.files['video_file'][0]);
                if (newVideoUrl) {
                    await storageService.deleteFile('hero-videos', currentSpec.media_url);
                    videoUrl = newVideoUrl;
                }
            }

            // Atualizar Thumb se enviada
            if (req.files && req.files['thumbnail_file']) {
                const newThumbUrl = await storageService.uploadFile('services', req.files['thumbnail_file'][0]);
                if (newThumbUrl) {
                    await storageService.deleteFile('services', currentSpec.thumbnail_url);
                    thumbUrl = newThumbUrl;
                }
            }

            // Salvar Alterações
            await supabaseService.update('specialties', id, {
                name,
                description,
                icon_class,
                media_url: videoUrl,
                thumbnail_url: thumbUrl,
                display_order: parseInt(display_order) || 1
            });

            req.flash('success_msg', 'Especialidade atualizada com sucesso!');
            res.redirect('/admin/specialties');

        } catch (error) {
            console.error('Erro ao atualizar especialidade:', error.message);
            req.flash('error_msg', 'Erro ao processar atualização.');
            res.redirect(`/admin/specialties/edit/${req.params.id}`);
        }
    },

    /**
     * EXCLUIR ESPECIALIDADE
     */
    destroy: async (req, res) => {
        try {
            const { id } = req.params;
            const spec = await supabaseService.getById('specialties', id);

            if (spec) {
                // Remove mídias
                await storageService.deleteFile('hero-videos', spec.media_url);
                await storageService.deleteFile('services', spec.thumbnail_url);
                // Remove DB
                await supabaseService.delete('specialties', id);
                req.flash('success_msg', 'Especialidade removida da Matrix.');
            }

            res.redirect('/admin/specialties');
        } catch (error) {
            console.error('Erro ao excluir:', error.message);
            req.flash('error_msg', 'Erro ao excluir especialidade.');
            res.redirect('/admin/specialties');
        }
    }
};

module.exports = specialtyController;