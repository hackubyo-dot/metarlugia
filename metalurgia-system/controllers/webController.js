/**
 * CONTROLLERS/WEBCONTROLLER.JS
 * Metalurgia Futurística Leonardo Serra
 * 
 * Este controlador gerencia todas as rotas acessíveis ao público.
 * Versão: 1.0.5 (Estável - Full Integration)
 */

const supabaseService = require('../services/supabaseService');
const seoConfig = require('../config/seo.config');

const webController = {

    /**
     * PÁGINA INICIAL (HOME)
     * Renderiza a Landing Page principal com todos os módulos dinâmicos.
     */
    index: async (req, res) => {
        try {
            // Busca todos os dados necessários em paralelo para máxima performance
            const [
                heroSlides,
                aboutData,
                services, // Buscado dinamicamente do banco
                specialties,
                portfolio,
                catalogs,
                faqs,
                testimonials
            ] = await Promise.all([
                supabaseService.getActiveHeroSlides(),
                supabaseService.getAll('about_section', 'created_at', true),
                supabaseService.getAll('services', 'name', true),
                supabaseService.getAll('specialties', 'display_order', true),
                supabaseService.getAll('portfolio', 'created_at', false),
                supabaseService.getAll('catalogs', 'created_at', false),
                supabaseService.getAll('faqs', 'display_order', true),
                supabaseService.getAll('testimonials', 'created_at', false)
            ]);

            // Configuração de SEO para a Home
            const seo = seoConfig.getMetadata();

            // Renderiza a view 'pages/home'
            res.render('pages/home', {
                layout: 'layouts/main',
                title: 'Início',
                seo: seo,
                heroSlides: heroSlides || [],
                about: aboutData[0] || { title: 'Da paixão pelo aço', content: '', years_experience: 5 },
                services: services || [], // GARANTIA: Envia array vazio se o banco falhar
                specialties: specialties || [],
                portfolio: portfolio || [],
                catalogs: catalogs[0] || {},
                faqs: faqs || [],
                testimonials: testimonials || [],
                currentPath: req.path
            });

        } catch (error) {
            console.error('Erro crítico ao carregar a Home Page:', error.message);
            
            // Fallback em caso de erro de conexão com o banco
            res.status(500).render('pages/error', {
                layout: 'layouts/main',
                title: 'Erro no Sistema',
                errorCode: 500,
                errorMessage: 'Ocorreu um problema ao carregar os dados. Nossa equipe técnica já foi notificada.',
                seo: seoConfig.getMetadata({ title: 'Erro de Conexão' }),
                currentPath: req.path
            });
        }
    },

    /**
     * PÁGINA DE LISTAGEM DO BLOG
     */
    blog: async (req, res) => {
        try {
            const posts = await supabaseService.getBlogPosts();
            
            const seo = seoConfig.getMetadata({ 
                title: 'Blog Industrial', 
                slug: 'blog',
                description: 'Notícias, dicas e inovações em metalurgia e engenharia.'
            });
            
            res.render('pages/blog', { 
                layout: 'layouts/main',
                title: 'Blog Industrial', 
                seo: seo, 
                posts: posts || [],
                currentPath: req.path 
            });
        } catch (error) {
            console.error('Erro ao carregar lista do Blog:', error.message);
            res.redirect('/');
        }
    },

    /**
     * PÁGINA DE LEITURA DE ARTIGO (SINGLE)
     */
    blogSingle: async (req, res) => {
        try {
            const { slug } = req.params;
            const post = await supabaseService.getBySlug('blog_posts', slug);
            
            if (!post) {
                return res.status(404).render('pages/error', { 
                    layout: 'layouts/main',
                    title: 'Artigo não encontrado', 
                    errorCode: 404,
                    seo: seoConfig.getMetadata({ title: 'Não Encontrado' }),
                    currentPath: req.path
                });
            }
            
            const seo = seoConfig.getMetadata({ 
                title: post.title, 
                image: post.thumb_url, 
                slug: `blog/${post.slug}`, 
                type: 'article' 
            });
            
            res.render('pages/blog-single', { 
                layout: 'layouts/main',
                title: post.title, 
                seo: seo, 
                post,
                currentPath: req.path 
            });
        } catch (error) {
            console.error('Erro ao carregar artigo:', error.message);
            res.redirect('/blog');
        }
    },

    /**
     * PROCESSAR FORMULÁRIO DE CONTATO (POST)
     */
    postContact: async (req, res) => {
        try {
            const { name, email, phone, message } = req.body;
            
            // Validação simples
            if (!name || !email || !message) {
                req.flash('error_msg', 'Por favor, preencha todos os campos obrigatórios.');
                return res.redirect('/#contacto');
            }

            await supabaseService.create('contacts', { 
                name, 
                email, 
                phone, 
                message, 
                subject: 'Contato via Website', 
                status: 'new' 
            });
            
            req.flash('success_msg', 'Sua mensagem foi enviada com sucesso! Nossa equipe entrará em contato em breve.');
            res.redirect('/#contacto');
        } catch (error) {
            console.error('Erro ao processar formulário de contato:', error.message);
            req.flash('error_msg', 'Ocorreu um erro técnico ao enviar sua mensagem. Tente novamente ou use o WhatsApp.');
            res.redirect('/#contacto');
        }
    },

    /**
     * INSCRIÇÃO NA NEWSLETTER (AJAX)
     */
    postNewsletter: async (req, res) => {
        try {
            const { email } = req.body;
            
            if (!email) {
                return res.status(400).json({ success: false, message: 'E-mail é obrigatório.' });
            }

            await supabaseService.create('newsletter', { email });
            res.json({ success: true, message: 'Inscrição realizada com sucesso! Você receberá nossas atualizações.' });
        } catch (error) {
            // Tratamento de e-mail duplicado (Constraint do Postgres)
            if (error.code === '23505') {
                return res.json({ success: true, message: 'Este e-mail já faz parte da nossa lista elite!' });
            }
            console.error('Erro Newsletter:', error.message);
            res.status(500).json({ success: false, message: 'Erro ao processar inscrição.' });
        }
    }
};

module.exports = webController;