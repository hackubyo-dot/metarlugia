/**
 * API.JS
 * Módulo de comunicação assíncrona com o servidor.
 */

const api = {
    /**
     * Realiza uma requisição POST enviando JSON.
     * @param {string} url - Endpoint da API
     * @param {object} data - Objeto contendo os dados
     * @returns {Promise<object>}
     */
    post: async (url, data) => {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Erro na requisição');
            }

            return result;
        } catch (error) {
            console.error(`[API POST ERROR] ${url}:`, error.message);
            throw error;
        }
    },

    /**
     * Realiza uma requisição GET.
     * @param {string} url 
     * @returns {Promise<object>}
     */
    get: async (url) => {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Erro ao buscar dados');
            }

            return result;
        } catch (error) {
            console.error(`[API GET ERROR] ${url}:`, error.message);
            throw error;
        }
    },

    /**
     * Realiza uma requisição DELETE (usado no admin/galeria).
     */
    delete: async (url) => {
        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json'
                }
            });

            const result = await response.json();
            return result;
        } catch (error) {
            console.error(`[API DELETE ERROR] ${url}:`, error.message);
            throw error;
        }
    }
};

export default api;