/**
 * CONTROLLERS/BLOGCONTROLLER.JS
 * Gestão do Blog Industrial.
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

const blogController = {

    /**
     * LISTAGEM DE POSTS (Admin)
     */
    index: async (req, res) => {
        try {
            const posts = await supabaseService.getBlogPosts();
            res.render('admin/blog/index', {
                title: 'Gerenciar Blog',
                posts,
                layout: 'layouts/admin'
            });
        } catch (error) {
            console.error('Erro ao listar posts:', error.message);
            req.flash('error_msg', 'Erro ao carregar os artigos do blog.');
            res.redirect('/admin/dashboard');
        }
    },

    /**
     * FORMULÁRIO DE CRIAÇÃO
     */
    create: (req, res) => {
        res.render('admin/blog/create', {
            title: 'Novo Artigo',
            layout: 'layouts/admin'
        });
    },

    /**
     * PROCESSAR CRIAÇÃO
     */
    store: async (req, res) => {
        try {
            const { title, excerpt, content, category, tags, published_at } = req.body;
            
            let thumbUrl = null;

            // 1. Upload da imagem de destaque
            if (req.file) {
                thumbUrl = await storageService.uploadFile('blog', req.file);
            }

            // 2. Processamento de Tags (String para Array)
            const tagsArray = tags ? tags.split(',').map(tag => tag.trim()) : [];

            // 3. Salvar no Banco (Associa o ID do Admin logado na sessão)
            await supabaseService.create('blog_posts', {
                title,
                slug: generateSlug(title),
                excerpt,
                content,
                category: category || 'Geral',
                tags: tagsArray,
                thumb_url: thumbUrl,
                author_id: req.session.user.id,
                published_at: published_at || new Date().toISOString()
            });

            req.flash('success_msg', 'Artigo publicado com sucesso!');
            res.redirect('/admin/blog');

        } catch (error) {
            console.error('Erro ao criar post:', error.message);
            req.flash('error_msg', 'Erro ao publicar artigo. Verifique se o título já existe.');
            res.redirect('/admin/blog/create');
        }
    },

    /**
     * FORMULÁRIO DE EDIÇÃO
     */
    edit: async (req, res) => {
        try {
            const { id } = req.params;
            const post = await supabaseService.getById('blog_posts', id);

            if (!post) {
                req.flash('error_msg', 'Artigo não encontrado.');
                return res.redirect('/admin/blog');
            }

            res.render('admin/blog/edit', {
                title: 'Editar Artigo',
                post,
                layout: 'layouts/admin'
            });
        } catch (error) {
            req.flash('error_msg', 'Erro ao carregar dados do post.');
            res.redirect('/admin/blog');
        }
    },

    /**
     * PROCESSAR ATUALIZAÇÃO
     */
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { title, excerpt, content, category, tags, published_at } = req.body;
            
            const currentPost = await supabaseService.getById('blog_posts', id);
            let thumbUrl = currentPost.thumb_url;

            // 1. Atualizar imagem se houver novo upload
            if (req.file) {
                const newThumbUrl = await storageService.uploadFile('blog', req.file);
                if (newThumbUrl) {
                    if (currentPost.thumb_url) {
                        await storageService.deleteFile('blog', currentPost.thumb_url);
                    }
                    thumbUrl = newThumbUrl;
                }
            }

            const tagsArray = tags ? tags.split(',').map(tag => tag.trim()) : [];

            // 2. Atualizar no Banco
            await supabaseService.update('blog_posts', id, {
                title,
                slug: title !== currentPost.title ? generateSlug(title) : currentPost.slug,
                excerpt,
                content,
                category,
                tags: tagsArray,
                thumb_url: thumbUrl,
                published_at: published_at || currentPost.published_at,
                updated_at: new Date().toISOString()
            });

            req.flash('success_msg', 'Artigo atualizado com sucesso!');
            res.redirect('/admin/blog');

        } catch (error) {
            console.error('Erro ao atualizar post:', error.message);
            req.flash('error_msg', 'Erro ao atualizar artigo.');
            res.redirect(`/admin/blog/edit/${req.params.id}`);
        }
    },

    /**
     * EXCLUIR POST
     */
    destroy: async (req, res) => {
        try {
            const { id } = req.params;
            const post = await supabaseService.getById('blog_posts', id);

            if (post) {
                if (post.thumb_url) {
                    await storageService.deleteFile('blog', post.thumb_url);
                }
                await supabaseService.delete('blog_posts', id);
                req.flash('success_msg', 'Artigo removido permanentemente.');
            }

            res.redirect('/admin/blog');
        } catch (error) {
            console.error('Erro ao excluir post:', error.message);
            req.flash('error_msg', 'Erro ao excluir artigo.');
            res.redirect('/admin/blog');
        }
    }
};

module.exports = blogController;