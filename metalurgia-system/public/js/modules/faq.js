/**
 * FAQ.JS
 * Lógica do Acordeão Industrial
 */

const faqManager = {
    init() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            if (question) {
                question.addEventListener('click', () => {
                    const isActive = item.classList.contains('active');
                    
                    // Fecha todos os outros
                    faqItems.forEach(otherItem => otherItem.classList.remove('active'));
                    
                    // Abre o clicado se não estava aberto
                    if (!isActive) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }
};

export default faqManager;