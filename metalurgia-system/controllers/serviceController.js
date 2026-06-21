/**
 * CONTROLLERS/SERVICECONTROLLER.JS
 * Gestão do catálogo de serviços e especialidades.
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
        .normalize('NFD') // Decompõe caracteres acentuados
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .replace(/\s+/g, '-') // Substitui espaços por -
        .replace(/[^\w-]+/g, '') // Remove caracteres não alfanuméricos
        .replace(/--+/g, '-'); // Remove hifens duplos
};

const serviceController = {

    /**
     * LISTAGEM DE SERVIÇOS (GET)
     */
    index: async (req, res) => {
        try {
            const services = await supabaseService.getAll('services', 'name', true);
            res.render('admin/services/index', {
                title: 'Gerenciar Serviços',
                services,
                layout: 'layouts/admin'
            });
        } catch (error) {
            console.error('Erro ao listar serviços:', error.message);
            req.flash('error_msg', 'Erro ao carregar serviços.');
            res.redirect('/admin/dashboard');
        }
    },

    /**
     * FORMULÁRIO DE CRIAÇÃO (GET)
     */
    create: (req, res) => {
        res.render('admin/services/create', {
            title: 'Novo Serviço',
            layout: 'layouts/admin'
        });
    },

    /**
     * PROCESSAR CRIAÇÃO (POST)
     */
    store: async (req, res) => {
        try {
            const { name, description, full_content, price_start, icon_class, category } = req.body;
            
            let imageUrl = null;

            // 1. Upload da imagem se fornecida
            if (req.file) {
                imageUrl = await storageService.uploadFile('services', req.file);
            }

            // 2. Gerar Slug automático
            const slug = generateSlug(name);

            // 3. Salvar no Banco
            await supabaseService.create('services', {
                name,
                slug,
                description,
                full_content,
                price_start: parseFloat(price_start) || 0,
                icon_class: icon_class || 'fa-tools',
                category: category || 'Geral',
                image_url: imageUrl,
                is_active: true
            });

            req.flash('success_msg', 'Serviço cadastrado com sucesso!');
            res.redirect('/admin/services');

        } catch (error) {
            console.error('Erro ao salvar serviço:', error.message);
            req.flash('error_msg', 'Erro ao criar serviço: ' + error.message);
            res.redirect('/admin/services/create');
        }
    },

    /**
     * FORMULÁRIO DE EDIÇÃO (GET)
     */
    edit: async (req, res) => {
        try {
            const { id } = req.params;
            const service = await supabaseService.getById('services', id);

            if (!service) {
                req.flash('error_msg', 'Serviço não encontrado.');
                return res.redirect('/admin/services');
            }

            res.render('admin/services/edit', {
                title: 'Editar Serviço',
                service,
                layout: 'layouts/admin'
            });
        } catch (error) {
            req.flash('error_msg', 'Erro ao carregar dados do serviço.');
            res.redirect('/admin/services');
        }
    },

    /**
     * PROCESSAR ATUALIZAÇÃO (POST)
     */
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, description, full_content, price_start, icon_class, category, is_active } = req.body;
            
            const currentService = await supabaseService.getById('services', id);
            let imageUrl = currentService.image_url;

            // 1. Atualizar imagem se houver novo upload
            if (req.file) {
                const newImageUrl = await storageService.uploadFile('services', req.file);
                if (newImageUrl) {
                    if (currentService.image_url) {
                        await storageService.deleteFile('services', currentService.image_url);
                    }
                    imageUrl = newImageUrl;
                }
            }

            // 2. Gerar novo slug se o nome mudar
            const slug = name !== currentService.name ? generateSlug(name) : currentService.slug;

            // 3. Atualizar no Banco
            await supabaseService.update('services', id, {
                name,
                slug,
                description,
                full_content,
                price_start: parseFloat(price_start) || 0,
                icon_class: icon_class,
                category: category,
                image_url: imageUrl,
                is_active: is_active === 'true' || is_active === true
            });

            req.flash('success_msg', 'Serviço atualizado com sucesso!');
            res.redirect('/admin/services');

        } catch (error) {
            console.error('Erro ao atualizar serviço:', error.message);
            req.flash('error_msg', 'Erro ao atualizar serviço.');
            res.redirect(`/admin/services/edit/${req.params.id}`);
        }
    },

    /**
     * EXCLUIR SERVIÇO
     */
    destroy: async (req, res) => {
        try {
            const { id } = req.params;
            const service = await supabaseService.getById('services', id);

            if (service) {
                // Remove imagem física
                if (service.image_url) {
                    await storageService.deleteFile('services', service.image_url);
                }
                // Remove registro
                await supabaseService.delete('services', id);
                req.flash('success_msg', 'Serviço removido com sucesso.');
            }

            res.redirect('/admin/services');
        } catch (error) {
            console.error('Erro ao excluir serviço:', error.message);
            req.flash('error_msg', 'Erro ao excluir serviço.');
            res.redirect('/admin/services');
        }
    }
};

module.exports = serviceController;