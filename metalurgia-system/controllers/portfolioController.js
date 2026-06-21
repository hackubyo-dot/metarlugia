/**
 * CONTROLLERS/PORTFOLIOCONTROLLER.JS
 * Gestão de Projetos e Galeria de Imagens.
 */

const supabaseService = require('../services/supabaseService');
const storageService = require('../services/storageService');

/**
 * Helper: Gerar Slug amigável
 */
const generateSlug = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
};

const portfolioController = {

    /**
     * LISTAGEM DE PROJETOS (Admin)
     */
    index: async (req, res) => {
        try {
            const projects = await supabaseService.getAll('portfolio', 'created_at', false);
            res.render('admin/portfolio/index', {
                title: 'Gerenciar Portfólio',
                projects,
                layout: 'layouts/admin'
            });
        } catch (error) {
            console.error('Erro ao listar projetos:', error.message);
            req.flash('error_msg', 'Erro ao carregar o portfólio.');
            res.redirect('/admin/dashboard');
        }
    },

    /**
     * FORMULÁRIO DE CRIAÇÃO
     */
    create: (req, res) => {
        res.render('admin/portfolio/create', {
            title: 'Novo Projeto',
            layout: 'layouts/admin'
        });
    },

    /**
     * PROCESSAR CRIAÇÃO (POST)
     * Lida com: 'main_image' (single) e 'gallery_images' (array)
     */
    store: async (req, res) => {
        try {
            const { title, client, category, description } = req.body;
            
            // 1. Validação da imagem principal
            if (!req.files || !req.files['main_image']) {
                req.flash('error_msg', 'A imagem principal do projeto é obrigatória.');
                return res.redirect('/admin/portfolio/create');
            }

            // 2. Upload da imagem principal
            const mainImageUrl = await storageService.uploadFile('portfolio', req.files['main_image'][0]);

            // 3. Criar registro do Projeto no DB
            const newProject = await supabaseService.create('portfolio', {
                title,
                slug: generateSlug(title),
                client,
                category,
                description,
                main_image_url: mainImageUrl
            });

            // 4. Se houver imagens de galeria, processar upload em lote
            if (req.files['gallery_images'] && req.files['gallery_images'].length > 0) {
                const galleryUrls = await storageService.uploadMultipleFiles('portfolio', req.files['gallery_images']);
                
                // Salva cada imagem na tabela portfolio_images associada ao projeto
                const galleryPromises = galleryUrls.map((url, index) => {
                    return supabaseService.create('portfolio_images', {
                        portfolio_id: newProject.id,
                        image_url: url,
                        display_order: index
                    });
                });
                await Promise.all(galleryPromises);
            }

            req.flash('success_msg', 'Projeto adicionado com sucesso ao portfólio!');
            res.redirect('/admin/portfolio');

        } catch (error) {
            console.error('Erro ao criar projeto:', error.message);
            req.flash('error_msg', 'Erro ao salvar projeto. Verifique os dados e tente novamente.');
            res.redirect('/admin/portfolio/create');
        }
    },

    /**
     * FORMULÁRIO DE EDIÇÃO
     */
    edit: async (req, res) => {
        try {
            const { id } = req.params;
            // Busca o projeto incluindo as imagens da galeria (relacionamento definido no supabaseService)
            const project = await supabaseService.getProjectBySlug(id); // O ID aqui pode ser o ID ou Slug dependendo da rota

            // Busca por ID se não encontrar por slug
            const projectData = project || await supabaseService.getById('portfolio', id);

            if (!projectData) {
                req.flash('error_msg', 'Projeto não encontrado.');
                return res.redirect('/admin/portfolio');
            }

            // Buscar imagens da galeria separadamente se necessário
            const { data: gallery } = await require('../config/supabase')
                .from('portfolio_images')
                .select('*')
                .eq('portfolio_id', projectData.id)
                .order('display_order', { ascending: true });

            res.render('admin/portfolio/edit', {
                title: 'Editar Projeto',
                project: projectData,
                gallery: gallery || [],
                layout: 'layouts/admin'
            });
        } catch (error) {
            console.error('Erro ao carregar edição:', error.message);
            req.flash('error_msg', 'Erro ao carregar dados do projeto.');
            res.redirect('/admin/portfolio');
        }
    },

    /**
     * PROCESSAR ATUALIZAÇÃO
     */
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { title, client, category, description } = req.body;
            
            const currentProject = await supabaseService.getById('portfolio', id);
            let mainImageUrl = currentProject.main_image_url;

            // 1. Atualizar imagem principal se houver novo upload
            if (req.files && req.files['main_image']) {
                const newMainImageUrl = await storageService.uploadFile('portfolio', req.files['main_image'][0]);
                if (newMainImageUrl) {
                    await storageService.deleteFile('portfolio', currentProject.main_image_url);
                    mainImageUrl = newMainImageUrl;
                }
            }

            // 2. Atualizar Dados no Banco
            await supabaseService.update('portfolio', id, {
                title,
                slug: title !== currentProject.title ? generateSlug(title) : currentProject.slug,
                client,
                category,
                description,
                main_image_url: mainImageUrl,
                updated_at: new Date().toISOString()
            });

            // 3. Adicionar novas imagens à galeria se enviadas
            if (req.files && req.files['gallery_images']) {
                const newGalleryUrls = await storageService.uploadMultipleFiles('portfolio', req.files['gallery_images']);
                const galleryPromises = newGalleryUrls.map(url => {
                    return supabaseService.create('portfolio_images', {
                        portfolio_id: id,
                        image_url: url
                    });
                });
                await Promise.all(galleryPromises);
            }

            req.flash('success_msg', 'Projeto atualizado com sucesso!');
            res.redirect('/admin/portfolio');

        } catch (error) {
            console.error('Erro ao atualizar projeto:', error.message);
            req.flash('error_msg', 'Erro ao atualizar projeto.');
            res.redirect(`/admin/portfolio/edit/${req.params.id}`);
        }
    },

    /**
     * EXCLUIR IMAGEM INDIVIDUAL DA GALERIA (AJAX/API)
     */
    deleteGalleryImage: async (req, res) => {
        try {
            const { imageId } = req.params;
            const { data: image } = await require('../config/supabase')
                .from('portfolio_images')
                .select('*')
                .eq('id', imageId)
                .single();

            if (image) {
                // Remove do Storage
                await storageService.deleteFile('portfolio', image.image_url);
                // Remove do DB
                await require('../config/supabase')
                    .from('portfolio_images')
                    .delete()
                    .eq('id', imageId);
                
                return res.json({ success: true });
            }
            res.status(404).json({ success: false, message: 'Imagem não encontrada' });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    /**
     * EXCLUIR PROJETO COMPLETO
     */
    destroy: async (req, res) => {
        try {
            const { id } = req.params;
            const project = await supabaseService.getById('portfolio', id);

            if (project) {
                // 1. Buscar todas as imagens da galeria para excluir do Storage
                const { data: gallery } = await require('../config/supabase')
                    .from('portfolio_images')
                    .select('image_url')
                    .eq('portfolio_id', id);

                if (gallery) {
                    for (const item of gallery) {
                        await storageService.deleteFile('portfolio', item.image_url);
                    }
                }

                // 2. Excluir imagem principal
                await storageService.deleteFile('portfolio', project.main_image_url);

                // 3. Excluir registro do projeto (Cascade delete no DB removerá portfolio_images)
                await supabaseService.delete('portfolio', id);
                
                req.flash('success_msg', 'Projeto e todas as suas mídias foram excluídos.');
            }

            res.redirect('/admin/portfolio');
        } catch (error) {
            console.error('Erro ao excluir projeto:', error.message);
            req.flash('error_msg', 'Erro ao excluir projeto do portfólio.');
            res.redirect('/admin/portfolio');
        }
    }
};

module.exports = portfolioController;