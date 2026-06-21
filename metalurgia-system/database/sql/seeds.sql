-- ========================================================
-- SEEDS SQL - DADOS INICIAIS DA METALURGIA FUTURÍSTICA
-- Inserção dos conteúdos atuais para evitar site vazio
-- ========================================================

-- 1. INSERIR PERFIL ADMINISTRADOR INICIAL
INSERT INTO profiles (email, full_name, role)
VALUES ('leonardodossantos006@gmail.com', 'Leonardo Serra', 'admin')
ON CONFLICT (email) DO NOTHING;

-- 2. POPULAR HERO SLIDER
INSERT INTO hero_slides (title, subtitle, description, button_text, button_link, media_url, media_type, display_order)
VALUES 
('O poder do aço', 'EXCELÊNCIA EM AÇO', 'Líderes em engenharia de precisão.', 'EXPLORAR SOLUÇÕES', '#servicos', 'images/industrial-welding.mp4', 'video', 1),
('Engenharia de Alto Padrão', 'QUALIDADE ELITE', 'Transformamos aço em arte e solidez em Angola.', 'VER PORTFÓLIO', '#portfolio', 'images/industrial-welding2.mp4', 'video', 2);

-- 3. POPULAR NOSSA HISTÓRIA
INSERT INTO about_section (title, content, image_url, years_experience)
VALUES (
    'Da paixão pelo aço à excelência em engenharia', 
    'Fundada por Leonardo Francisco, nossa jornada começou em uma pequena oficina no coração de Luanda. Com determinação e amor pelo que fazemos, transformamos cada projeto em uma oportunidade de superar expectativas e construir relações duradouras.',
    'images/about-industrial-man.jpeg',
    5
);

-- 4. POPULAR SERVIÇOS (OS 8 CARDS)
INSERT INTO services (name, slug, description, full_content, price_start, icon_class, image_url, category)
VALUES 
('Serralheria de Arte', 'serralheria-de-arte', 'Design luxuoso para residências de alto padrão.', 'Serviço especializado em criar peças únicas e personalizadas para residências de luxo. Trabalhamos com design exclusivo, materiais nobres e acabamento impecável.', 250000.00, 'fa-brush', 'images/serv-1.jpeg', 'Residencial'),
('Estruturas Pesadas', 'estruturas-pesadas', 'Galpões industriais e hangares de grande escala.', 'Projetamos e montamos estruturas metálicas para galpões industriais, hangares, mezaninos e coberturas de grande porte. Utilizamos softwares de engenharia para cálculos estruturais precisos.', 1500000.00, 'fa-building', 'images/serv-2.jpeg', 'Industrial'),
('Solda de Precisão', 'solda-de-precisao', 'Processos industriais MIG, TIG e Arco Submerso.', 'Serviço de soldagem especializada para diversos tipos de materiais e aplicações. Trabalhamos com processos MIG, TIG e arco submerso, garantindo penetração perfeita.', 75000.00, 'fa-wrench', 'images/serv-3.jpeg', 'Técnico'),
('Corte CNC Plasma', 'corte-cnc-plasma', 'Usinagem de chapas grossas com perfeição robótica.', 'Corte de chapas metálicas com tecnologia CNC de última geração. Precisão milimétrica, rapidez na execução e qualidade superior no acabamento das peças.', 95000.00, 'fa-microchip', 'images/serv-4.jpeg', 'Usinagem'),
('Bancos Metálicos', 'bancos-metalicos', 'Revestimentos modernos para local de comércio.', 'Revestimentos modernos e mobiliário urbano para locais de comércio e espaços públicos, unindo durabilidade e estética.', 350000.00, 'fa-draw-polygon', 'images/serv-5.jpeg', 'Comercial'),
('Mobiliário Industrial', 'mobiliario-industrial', 'Móveis em aço para escritórios e residências.', 'Móveis em aço para escritórios, lojas e residências com estilo industrial moderno. Design robusto, durável e com acabamento de alta qualidade.', 150000.00, 'fa-couch', 'images/mobiliario.jpeg', 'Design'),
('Manutenção Industrial', 'manutencao-industrial', 'Serviços preventivos e corretivos 24/7.', 'Serviços preventivos e corretivos para equipamentos e estruturas metálicas. Atendimento 24/7 para indústrias e empresas.', 50000.00, 'fa-gear', 'images/serv-7.jpeg', 'Suporte'),
('Consultoria Técnica', 'consultoria-tecnica', 'Análise estrutural e projetos personalizados.', 'Análise estrutural, projeto e acompanhamento de obras. Nossa equipe de engenheiros oferece suporte completo desde a concepção até a entrega.', 20000.00, 'fa-chart-line', 'images/serv-8.jpeg', 'Engenharia');

-- 5. POPULAR ESPECIALIDADES (ELITE 8 MATRIX)
INSERT INTO specialties (name, description, icon_class, media_url, thumbnail_url, display_order)
VALUES 
('Estrutura Pesada', 'Portão grande e estruturas de suporte.', 'fa-layer-group', 'images/video (2).mp4', 'images/serv-2.jpeg', 1),
('Corte CNC Plasma', 'Tecnologia de corte automatizado com precisão de 0.01mm.', 'fa-bolt', 'images/industrial-welding.mp4', 'images/about-industrial-man.jpg', 2),
('Serralharia Arte', 'Fusão entre design de luxo e metalurgia artesanal.', 'fa-pen-nib', 'images/industrial-welding.mp4', 'images/about-industrial-man.jpg', 3),
('Manutenção 24/7', 'Suporte crítico e paradas industriais programadas.', 'fa-tools', 'images/industrial-welding.mp4', 'images/about-industrial-man.jpg', 4),
('Soldadura Elite', 'Processos de união de alta resistência para ligas especiais.', 'fa-fire', 'images/industrial-welding.mp4', 'images/about-industrial-man.jpg', 5),
('Mobiliário Tech', 'Design funcional de alto padrão para ambientes corporativos.', 'fa-chair', 'images/industrial-welding.mp4', 'images/about-industrial-man.jpg', 6),
('Fachadas ACM', 'Revestimentos modernos em alumínio composto para edifícios.', 'fa-building', 'images/industrial-welding.mp4', 'images/about-industrial-man.jpg', 7),
('Engenharia 3D', 'Projetos detalhados em ambiente BIM com simulação real.', 'fa-drafting-compass', 'images/industrial-welding.mp4', 'images/about-industrial-man.jpg', 8);

-- 6. POPULAR FAQ
INSERT INTO faqs (question, answer, display_order)
VALUES 
('Qual o prazo médio para entrega de um projeto?', 'O prazo varia conforme a complexidade do projeto. Projetos de serralheria residencial têm média de 15 a 30 dias, enquanto estruturas industriais podem levar de 45 a 90 dias.', 1),
('Vocês oferecem garantia nos serviços?', 'Sim! Todos os nossos serviços possuem garantia de 5 anos contra defeitos de fabricação e execução.', 2),
('Atendem todo o território de Angola?', 'Sim! Temos capacidade logística para atender projetos em todas as províncias de Angola.', 3),
('Como funciona o processo de orçamento?', 'Basta preencher o formulário de contato ou nos chamar no WhatsApp. Retornamos em até 24h.', 4);

-- 7. POPULAR CATÁLOGO
INSERT INTO catalogs (name, description, pdf_url, cover_url, file_size, version)
VALUES (
    'Catálogo Técnico 2025', 
    'Especificações completas de materiais, portfólio detalhado de projetos e informações técnicas avançadas.', 
    'catalogo.pdf', 
    'images/catalogue-mockup.jpg', 
    '24.5 MB', 
    '2025'
);

-- 8. PORTFÓLIO INICIAL
INSERT INTO portfolio (title, slug, client, category, description, main_image_url)
VALUES 
('Projeto Industrial Viana', 'projeto-industrial-viana', 'Governo de Angola', 'Industrial', 'Estrutura metálica completa para pavilhão industrial.', 'images/site (9).jpeg'),
('Residência de Luxo Talatona', 'residencia-luxo-talatona', 'Cliente Privado', 'Serralharia Arte', 'Portões e corrimãos em design minimalista.', 'images/site (7).jpeg');