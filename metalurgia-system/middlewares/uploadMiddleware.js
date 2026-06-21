/**
 * MIDDLEWARES/UPLOADMIDDLEWARE.JS
 * Interceptador de uploads para tratamento de erros e validação.
 */

const multer = require('multer');
const uploadConfig = require('../config/multer');

const uploadMiddleware = {

    /**
     * PROCESS SINGLE UPLOAD
     * Trata o upload de um único arquivo e gerencia erros do Multer.
     * @param {string} fieldName - Nome do campo no formulário HTML
     */
    handleSingle: (fieldName) => {
        return (req, res, next) => {
            const upload = uploadConfig.single(fieldName);

            upload(req, res, (err) => {
                if (err instanceof multer.MulterError) {
                    // Erros específicos do Multer (ex: arquivo muito grande)
                    let message = 'Erro no upload do arquivo.';
                    if (err.code === 'LIMIT_FILE_SIZE') message = 'O arquivo excede o limite de 50MB.';
                    
                    req.flash('error_msg', message);
                    return res.redirect('back');
                } else if (err) {
                    // Erros de filtro (ex: tipo de arquivo inválido)
                    req.flash('error_msg', err.message);
                    return res.redirect('back');
                }
                
                // Sucesso: Prossegue para o próximo middleware/controller
                next();
            });
        };
    },

    /**
     * PROCESS MULTIPLE UPLOAD (ARRAY)
     * @param {string} fieldName 
     * @param {number} maxCount 
     */
    handleArray: (fieldName, maxCount = 10) => {
        return (req, res, next) => {
            const upload = uploadConfig.array(fieldName, maxCount);

            upload(req, res, (err) => {
                if (err) {
                    req.flash('error_msg', err.message);
                    return res.redirect('back');
                }
                next();
            });
        };
    },

    /**
     * PROCESS FIELDS (MIXED)
     * Útil para o Hero onde podemos ter uma Imagem E um Vídeo simultaneamente.
     */
    handleFields: (fieldsConfig) => {
        return (req, res, next) => {
            const upload = uploadConfig.fields(fieldsConfig);

            upload(req, res, (err) => {
                if (err) {
                    req.flash('error_msg', err.message);
                    return res.redirect('back');
                }
                next();
            });
        };
    }
};

module.exports = uploadMiddleware;