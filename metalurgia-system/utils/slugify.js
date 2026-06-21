/**
 * UTILS/SLUGIFY.JS
 * Utilitário para geração de URLs amigáveis e sanitização de nomes de arquivos.
 */

/**
 * Gera um slug a partir de uma string de texto.
 * Exemplo: "Estruturas de Aço em Luanda!" -> "estruturas-de-aco-em-luanda"
 * 
 * @param {string} text - O texto original a ser convertido.
 * @returns {string} - O texto formatado para URL.
 */
const slugify = (text) => {
    if (!text) return '';

    return text
        .toString()
        .toLowerCase()
        .trim()
        // 1. Remove acentos e diacríticos (Ex: 'ã' -> 'a')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        // 2. Substitui espaços por hifens
        .replace(/\s+/g, '-')
        // 3. Remove caracteres que não são letras, números ou hifens
        .replace(/[^\w-]+/g, '')
        // 4. Remove hifens múltiplos ou duplicados (Ex: '--' -> '-')
        .replace(/--+/g, '-')
        // 5. Remove hifens do início e do fim
        .replace(/^-+/, '')
        .replace(/-+$/, '');
};

/**
 * Gera um nome de arquivo sanitizado mantendo a extensão.
 * Exemplo: "Foto do Projeto 01.JPG" -> "foto-do-projeto-01.jpg"
 * 
 * @param {string} filename - Nome original do arquivo.
 * @returns {string} - Nome formatado.
 */
const sanitizeFilename = (filename) => {
    if (!filename) return '';

    const parts = filename.split('.');
    const extension = parts.pop().toLowerCase();
    const nameWithoutExt = parts.join('.');

    return `${slugify(nameWithoutExt)}.${extension}`;
};

module.exports = {
    slugify,
    sanitizeFilename
};