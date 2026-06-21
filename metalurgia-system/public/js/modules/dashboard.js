/**
 * DASHBOARD.JS
 * Inteligência do Painel Administrativo.
 * Lida com interações do painel, gráficos, exclusões e status.
 */

import api from './api.js';

const dashboardManager = {
    /**
     * INICIALIZAÇÃO
     */
    init() {
        // Apenas executa se estivermos em uma página administrativa
        if (!document.querySelector('.admin-layout')) return;

        this.initSidebar();
        this.initDeleteConfirmations();
        this.initLeadManagement();
        this.initGalleryManagement();
        this.initStatusToggles();

        console.log("[Dashboard] Sistema administrativo carregado.");
    },

    /**
     * CONTROLE DA SIDEBAR (MOBILE/DESKTOP)
     */
    initSidebar() {
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.querySelector('.sidebar');
        
        if (sidebarToggle && sidebar) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('active');
            });
        }

        // Marcar link ativo baseado na URL
        const currentPath = window.location.pathname;
        document.querySelectorAll('.sidebar-nav a').forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            }
        });
    },

    /**
     * CONFIRMAÇÃO DE EXCLUSÃO
     * Intercepta cliques em botões de deletar para evitar acidentes.
     */
    initDeleteConfirmations() {
        const deleteButtons = document.querySelectorAll('.btn-delete-confirm');

        deleteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const message = btn.getAttribute('data-confirm-message') || 'Tem certeza que deseja excluir este registro permanentemente?';
                if (!confirm(message)) {
                    e.preventDefault();
                }
            });
        });
    },

    /**
     * GESTÃO DE LEADS (MENSAGENS)
     * Permite marcar como lido via AJAX na listagem.
     */
    initLeadManagement() {
        const leadRows = document.querySelectorAll('.lead-row');

        leadRows.forEach(row => {
            const markReadBtn = row.querySelector('.btn-mark-read');
            if (markReadBtn) {
                markReadBtn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    const leadId = markReadBtn.getAttribute('data-id');

                    try {
                        const response = await fetch(`/admin/leads/read/${leadId}`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' }
                        });

                        if (response.ok) {
                            row.classList.remove('unread');
                            row.classList.add('read');
                            markReadBtn.remove(); // Remove o botão após marcar como lido
                        }
                    } catch (error) {
                        console.error("[Dashboard] Erro ao marcar lead como lido:", error);
                    }
                });
            }
        });
    },

    /**
     * GESTÃO DE GALERIA NO PORTFÓLIO
     * Exclui imagens individuais da galeria durante a edição de um projeto.
     */
    initGalleryManagement() {
        const galleryItems = document.querySelectorAll('.gallery-edit-item');

        galleryItems.forEach(item => {
            const deleteBtn = item.querySelector('.btn-remove-gallery-img');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    const imageId = deleteBtn.getAttribute('data-image-id');

                    if (!confirm('Deseja remover esta imagem da galeria?')) return;

                    try {
                        const result = await api.delete(`/admin/portfolio/gallery/${imageId}`);
                        
                        if (result.success) {
                            item.style.opacity = '0';
                            setTimeout(() => item.remove(), 300);
                        } else {
                            alert('Erro ao excluir imagem: ' + (result.error || 'Erro desconhecido'));
                        }
                    } catch (error) {
                        console.error("[Dashboard] Erro na requisição de exclusão:", error);
                        alert('Falha na comunicação com o servidor.');
                    }
                });
            }
        });
    },

    /**
     * ALTERNADOR DE STATUS (TOGGLES)
     * Ativa/Desativa itens (Slides, Serviços) sem refresh.
     */
    initStatusToggles() {
        const toggles = document.querySelectorAll('.status-toggle');

        toggles.forEach(toggle => {
            toggle.addEventListener('change', async () => {
                const id = toggle.getAttribute('data-id');
                const type = toggle.getAttribute('data-type'); // 'hero' ou 'service'

                try {
                    const response = await fetch(`/admin/${type}/toggle/${id}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' }
                    });
                    
                    const result = await response.json();
                    if (!result.success) {
                        toggle.checked = !toggle.checked; // Reverte se falhar
                        alert('Não foi possível alterar o status.');
                    }
                } catch (error) {
                    toggle.checked = !toggle.checked;
                    console.error("[Dashboard] Erro no toggle:", error);
                }
            });
        });
    }
};

export default dashboardManager;