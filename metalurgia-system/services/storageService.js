/**
 * SERVICES/STORAGESERVICE.JS
 * Responsável pelo gerenciamento de arquivos físicos no Supabase Storage.
 * Lida com uploads, deleções e geração de links públicos.
 */

const supabase = require('../config/supabase');
const path = require('path');

const storageService = {

    /**
     * UPLOAD DE ARQUIVO
     * Envia um arquivo (buffer do multer) para um bucket específico.
     * @param {string} bucket - Nome do bucket no Supabase (ex: 'services', 'portfolio')
     * @param {object} file - Objeto do arquivo vindo do req.file (multer)
     * @returns {string|null} - Retorna a URL pública do arquivo ou null em caso de erro.
     */
    async uploadFile(bucket, file) {
        try {
            // 1. Sanitização do nome do arquivo (remove espaços e caracteres especiais)
            const fileExt = path.extname(file.originalname);
            const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExt}`;
            const filePath = `${fileName}`;

            // 2. Upload para o Supabase Storage
            const { data, error } = await supabase.storage
                .from(bucket)
                .upload(filePath, file.buffer, {
                    contentType: file.mimetype,
                    upsert: false
                });

            if (error) throw error;

            // 3. Obter URL Pública do arquivo
            const { data: publicUrlData } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath);

            return publicUrlData.publicUrl;
        } catch (error) {
            console.error(`Erro no upload para o bucket ${bucket}:`, error.message);
            return null;
        }
    },

    /**
     * EXCLUIR ARQUIVO
     * Remove um arquivo do storage baseado na sua URL pública.
     * @param {string} bucket - Nome do bucket
     * @param {string} fileUrl - URL completa do arquivo (como salva no DB)
     */
    async deleteFile(bucket, fileUrl) {
        try {
            if (!fileUrl) return true;

            // Extrair o nome do arquivo da URL (Assume padrão Supabase Public URL)
            // Ex: https://.../storage/v1/object/public/bucket/nome-do-arquivo.jpg
            const urlParts = fileUrl.split('/');
            const fileName = urlParts[urlParts.length - 1];

            const { error } = await supabase.storage
                .from(bucket)
                .remove([fileName]);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error(`Erro ao excluir arquivo no bucket ${bucket}:`, error.message);
            return false;
        }
    },

    /**
     * UPLOAD MÚLTIPLO
     * Processa um array de arquivos e retorna um array de URLs.
     * @param {string} bucket - Nome do bucket
     * @param {Array} files - Array de arquivos do multer
     */
    async uploadMultipleFiles(bucket, files) {
        if (!files || files.length === 0) return [];

        try {
            const uploadPromises = files.map(file => this.uploadFile(bucket, file));
            const results = await Promise.all(uploadPromises);
            
            // Filtra apenas as URLs que não são null (uploads bem-sucedidos)
            return results.filter(url => url !== null);
        } catch (error) {
            console.error(`Erro no upload múltiplo para o bucket ${bucket}:`, error.message);
            return [];
        }
    },

    /**
     * HELPER: EXTRAIR CAMINHO RELATIVO
     * Útil para operações internas do Supabase que não aceitam a URL cheia.
     */
    getRelativePathFromUrl(fileUrl) {
        if (!fileUrl) return null;
        const parts = fileUrl.split('/');
        return parts[parts.length - 1];
    }
};

module.exports = storageService;