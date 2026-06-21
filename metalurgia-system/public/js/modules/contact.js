/**
 * CONTACT.JS
 * Gerenciamento de formulários e integração com APIs de comunicação.
 */

import api from './api.js';

const contactManager = {
    // Seletores
    contactForm: document.getElementById('contactForm'),
    newsletterForm: document.querySelector('.subscribe-form'),
    whatsappNumber: '244939717295',

    /**
     * Inicializa os ouvintes de formulário.
     */
    init() {
        if (this.contactForm) {
            this.contactForm.addEventListener('submit', (e) => this.handleContactSubmit(e));
        }

        if (this.newsletterForm) {
            this.newsletterForm.addEventListener('submit', (e) => this.handleNewsletterSubmit(e));
        }

        console.log("[ContactManager] Módulos de interação inicializados.");
    },

    /**
     * PROCESSAR FORMULÁRIO DE CONTATO (WhatsApp Bridge)
     * Além de enviar para o banco de dados (via submit padrão ou API),
     * este método prepara e redireciona para o WhatsApp do Leonardo.
     */
    async handleContactSubmit(e) {
        // Se quisermos salvar no banco ANTES de ir para o WhatsApp
        // e: Evento do formulário
        
        const formData = new FormData(this.contactForm);
        const data = {
            name: formData.get('name') || this.contactForm.querySelector('input[placeholder="Name"]')?.value,
            phone: formData.get('phone') || this.contactForm.querySelector('input[placeholder="Phone Number"]')?.value,
            email: formData.get('email') || this.contactForm.querySelector('input[placeholder="Email"]')?.value,
            message: formData.get('message') || this.contactForm.querySelector('textarea')?.value
        };

        // Validação Simples
        if (!data.name || !data.email || !data.message) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        // 1. Criar Mensagem formatada para o WhatsApp
        const waMessage = window.encodeURIComponent(
            `*🔧 NOVA SOLICITAÇÃO - METALURGIA FUTURÍSTICA*%0A%0A` +
            `*Nome:* ${data.name}%0A` +
            `*Telefone:* ${data.phone}%0A` +
            `*Email:* ${data.email}%0A` +
            `*Mensagem:* ${data.message}%0A%0A` +
            `_Enviado via Website Oficial_`
        );

        const waUrl = `https://wa.me/${this.whatsappNumber}?text=${waMessage}`;

        // 2. Feedback Visual no Botão
        const btn = this.contactForm.querySelector('button[type="submit"]');
        const originalContent = btn.innerHTML;
        btn.innerHTML = 'PROCESSANDO... <i class="fas fa-spinner fa-spin"></i>';
        btn.disabled = true;

        // Opcional: Enviar para o banco via API interna primeiro
        try {
            // Se houver uma rota de API configurada para salvar contatos
            // await api.post('/api/contact', data);
        } catch (err) {
            console.warn("[Contact] Erro ao salvar cópia no banco, mas prosseguindo para WhatsApp.");
        }

        // 3. Redirecionamento após pequeno delay
        setTimeout(() => {
            window.open(waUrl, '_blank');
            btn.innerHTML = 'SOLICITAÇÃO ENVIADA! <i class="fas fa-check"></i>';
            
            setTimeout(() => {
                btn.innerHTML = originalContent;
                btn.disabled = false;
                this.contactForm.reset();
            }, 3000);
        }, 800);
    },

    /**
     * PROCESSAR NEWSLETTER (AJAX)
     */
    async handleNewsletterSubmit(e) {
        e.preventDefault();

        const input = this.newsletterForm.querySelector('input[type="email"]');
        const btn = this.newsletterForm.querySelector('button');
        const email = input.value;

        if (!email) return;

        // Feedback visual
        btn.disabled = true;
        const originalIcon = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>';

        try {
            // Envia para a API configurada no express
            const result = await api.post('/newsletter', { email });

            if (result.success) {
                input.value = '';
                input.placeholder = 'Inscrição realizada!';
                btn.style.background = '#22c55e';
                btn.innerHTML = '<i class="fas fa-check"></i>';
            }
        } catch (error) {
            console.error("[Newsletter] Erro:", error);
            input.placeholder = 'Erro ao cadastrar.';
            btn.style.background = '#ef4444';
            btn.innerHTML = '<i class="fas fa-times"></i>';
        }

        // Reseta o botão após 3 segundos
        setTimeout(() => {
            btn.disabled = false;
            btn.style.background = '';
            btn.innerHTML = originalIcon;
            input.placeholder = 'Seu melhor e-mail';
        }, 3000);
    }
};

export default contactManager;