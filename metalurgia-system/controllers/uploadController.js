/**
 * CONTROLLERS/UPLOADCONTROLLER.JS
 * Controlador utilitário para gestão de Catálogos (PDF) e Documentos.
 */

const supabaseService = require('../services/supabaseService');
const storageService = require('../services/storageService');

const uploadController = {

    /**
     * LISTAGEM DE CATÁLOGOS (GET)
     */
    index: async (req, res) => {
        try {
            const catalogs = await supabaseService.getAll('catalogs', 'created_at', false);
            res.render('admin/catalogs/index', {
                title: 'Gerenciar Catálogos',
                catalogs,
                layout: 'layouts/admin'
            });
        } catch (error) {
            req.flash('error_msg', 'Erro ao carregar catálogos.');
            res.redirect('/admin/dashboard');
        }
    },

    /**
     * PROCESSAR UPLOAD DE CATÁLOGO (POST)
     * Lida com dois campos: 'pdf_file' e 'cover_image'
     */
    storeCatalog: async (req, res) => {
        try {
            const { name, description, version } = req.body;
            
            if (!req.files || !req.files['pdf_file']) {
                req.flash('error_msg', 'O arquivo PDF é obrigatório.');
                return res.redirect('/admin/catalogs');
            }

            // 1. Upload do PDF para o bucket 'catalogs'
            const pdfUrl = await storageService.uploadFile('catalogs', req.files['pdf_file'][0]);
            
            // 2. Upload da Capa (opcional)
            let coverUrl = null;
            if (req.files['cover_image']) {
                coverUrl = await storageService.uploadFile('catalogs', req.files['cover_image'][0]);
            }

            // 3. Salva no Banco
            await supabaseService.create('catalogs', {
                name,
                description,
                version: version || '2025',
                pdf_url: pdfUrl,
                cover_url: coverUrl,
                file_size: `${(req.files['pdf_file'][0].size / (1024 * 1024)).toFixed(2)} MB`
            });

            req.flash('success_msg', 'Catálogo enviado com sucesso!');
            res.redirect('/admin/catalogs');

        } catch (error) {
            console.error('Erro no upload de catálogo:', error.message);
            req.flash('error_msg', 'Falha ao processar upload.');
            res.redirect('/admin/catalogs');
        }
    },

    /**
     * EXCLUIR CATÁLOGO
     */
    destroyCatalog: async (req, res) => {
        try {
            const { id } = req.params;
            const catalog = await supabaseService.getById('catalogs', id);

            if (catalog) {
                // Remove PDF e Capa do Storage
                await storageService.deleteFile('catalogs', catalog.pdf_url);
                if (catalog.cover_url) {
                    await storageService.deleteFile('catalogs', catalog.cover_url);
                }
                // Remove do DB
                await supabaseService.delete('catalogs', id);
            }

            req.flash('success_msg', 'Catálogo excluído.');
            res.redirect('/admin/catalogs');
        } catch (error) {
            req.flash('error_msg', 'Erro ao excluir catálogo.');
            res.redirect('/admin/catalogs');
        }
    }
};

module.exports = uploadController;