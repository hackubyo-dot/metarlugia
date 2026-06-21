/**
 * ROUTES/ADMIN.ROUTES.JS
 * O coração operacional do sistema.
 * Gerencia o CRUD de todos os módulos da Metalurgia Futurística.
 */

const express = require('express');
const router = express.Router();

// --- IMPORTAÇÃO DE CONTROLADORES ---
const adminController = require('../controllers/adminController');
const heroController = require('../controllers/heroController');
const serviceController = require('../controllers/serviceController');
const portfolioController = require('../controllers/portfolioController');
const blogController = require('../controllers/blogController');
const uploadController = require('../controllers/uploadController');

// --- IMPORTAÇÃO DE MIDDLEWARES ---
const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware');
const { handleSingle, handleArray, handleFields } = require('../middlewares/uploadMiddleware');

/**
 * PROTEÇÃO GLOBAL
 * Todas as rotas definidas neste arquivo exigem que o usuário esteja 
 * autenticado e possua nível de Administrador.
 */
router.use(isAuthenticated);
router.use(isAdmin);

/**
 * ================================================================
 * 1. DASHBOARD PRINCIPAL & LEADS
 * ================================================================
 */
router.get('/dashboard', adminController.index);

// Gestão de Mensagens de Contato
router.get('/leads', adminController.leads);
router.post('/leads/delete/:id', adminController.deleteLead);
router.post('/leads/read/:id', adminController.markLeadRead);

// Gestão de Assinantes Newsletter
router.get('/newsletter', adminController.newsletter);
router.post('/newsletter/delete/:id', adminController.deleteNewsletter);


/**
 * ================================================================
 * 2. HERO SLIDER (Imagens e Vídeos do Topo)
 * ================================================================
 */
router.get('/hero', heroController.index);
router.get('/hero/create', heroController.create);
router.post('/hero/store', handleSingle('media_file'), heroController.store);
router.get('/hero/edit/:id', heroController.edit);
router.post('/hero/update/:id', handleSingle('media_file'), heroController.update);
router.post('/hero/delete/:id', heroController.destroy);
router.post('/hero/toggle/:id', heroController.toggleStatus);


/**
 * ================================================================
 * 3. SERVIÇOS (As 8 Especialidades)
 * ================================================================
 */
router.get('/services', serviceController.index);
router.get('/services/create', serviceController.create);
router.post('/services/store', handleSingle('image_file'), serviceController.store);
router.get('/services/edit/:id', serviceController.edit);
router.post('/services/update/:id', handleSingle('image_file'), serviceController.update);
router.post('/services/delete/:id', serviceController.destroy);


/**
 * ================================================================
 * 4. PORTFÓLIO (Projetos e Galerias)
 * ================================================================
 */
router.get('/portfolio', portfolioController.index);
router.get('/portfolio/create', portfolioController.create);

// Upload Misto: Imagem Principal + Array de imagens para Galeria
router.post('/portfolio/store', handleFields([
    { name: 'main_image', maxCount: 1 },
    { name: 'gallery_images', maxCount: 10 }
]), portfolioController.store);

router.get('/portfolio/edit/:id', portfolioController.edit);
router.post('/portfolio/update/:id', handleFields([
    { name: 'main_image', maxCount: 1 },
    { name: 'gallery_images', maxCount: 10 }
]), portfolioController.update);

router.post('/portfolio/delete/:id', portfolioController.destroy);
router.post('/portfolio/gallery/delete/:imageId', portfolioController.deleteGalleryImage);


/**
 * ================================================================
 * 5. BLOG (Conteúdo e Notícias)
 * ================================================================
 */
router.get('/blog', blogController.index);
router.get('/blog/create', blogController.create);
router.post('/blog/store', handleSingle('thumb_file'), blogController.store);
router.get('/blog/edit/:id', blogController.edit);
router.post('/blog/update/:id', handleSingle('thumb_file'), blogController.update);
router.post('/blog/delete/:id', blogController.destroy);


/**
 * ================================================================
 * 6. CATÁLOGOS TÉCNICOS (Downloads PDF)
 * ================================================================
 */
router.get('/catalogs', uploadController.index);
router.post('/catalogs/store', handleFields([
    { name: 'pdf_file', maxCount: 1 },
    { name: 'cover_image', maxCount: 1 }
]), uploadController.storeCatalog);
router.post('/catalogs/delete/:id', uploadController.destroyCatalog);


/**
 * ================================================================
 * 7. PERFIL DO ADMINISTRADOR
 * ================================================================
 */
router.get('/profile', (req, res) => {
    res.render('admin/profile', {
        title: 'Meu Perfil',
        layout: 'layouts/admin'
    });
});

module.exports = router;