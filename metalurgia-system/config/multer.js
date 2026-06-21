/**
 * CONFIG/MULTER.JS
 * Configuração do middleware Multer para processamento de uploads.
 * Suporta filtragem por tipo de arquivo e limite de tamanho.
 */

const multer = require('multer');
const path = require('path');

/**
 * Armazenamento em Memória
 * Escolhido para integração direta com o Supabase Storage.
 * O arquivo fica no Buffer do Node.js até ser enviado para a nuvem.
 */
const storage = multer.memoryStorage();

/**
 * Filtro de Arquivos (Segurança)
 * Define quais extensões e tipos MIME são permitidos no sistema.
 */
const fileFilter = (req, file, cb) => {
    // Lista de tipos permitidos
    const allowedMimeTypes = [
        // Imagens
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
        // Vídeos
        'video/mp4',
        'video/mpeg',
        'video/quicktime',
        // Documentos
        'application/pdf'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de arquivo inválido. Apenas imagens (JPG, PNG, WEBP, SVG), vídeos (MP4) e PDFs são aceitos.'), false);
    }
};

/**
 * Limites de Tamanho
 * Puxa o valor do arquivo .env ou define um padrão de 50MB.
 */
const limits = {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 50 * 1024 * 1024, // Padrão 50MB
    files: 10 // Limite de até 10 arquivos por vez (útil para galerias do portfólio)
};

/**
 * Instância do Multer
 * Exporta o middleware pronto para uso nas rotas.
 */
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: limits
});

/**
 * Helpers para campos específicos
 * Atalhos para facilitar a leitura nos Controllers.
 */
const uploadMiddleware = {
    // Único arquivo (ex: Foto de Perfil, Capa de Blog)
    single: (fieldName) => upload.single(fieldName),
    
    // Múltiplos arquivos (ex: Galeria de Portfólio)
    array: (fieldName, maxCount) => upload.array(fieldName, maxCount),
    
    // Campos mistos (ex: Imagem e Vídeo no Hero)
    fields: (fieldsArray) => upload.fields(fieldsArray),
    
    // Função auxiliar para validar erros do Multer (usada em middlewares de rota)
    handleMulterError: (err, req, res, next) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                req.flash('error_msg', 'O arquivo é muito grande. O limite máximo é de 50MB.');
            } else {
                req.flash('error_msg', 'Erro no upload: ' + err.message);
            }
            return res.redirect('back');
        } else if (err) {
            req.flash('error_msg', err.message);
            return res.redirect('back');
        }
        next();
    }
};

module.exports = uploadMiddleware;