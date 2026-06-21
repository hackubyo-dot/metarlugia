/**
 * CONFIG/SEO.CONFIG.JS
 * Configurações globais de Search Engine Optimization (SEO).
 * Este arquivo define os padrões para metatags, redes sociais e visibilidade.
 */

const seoConfig = {
    // Configurações Gerais
    defaultTitle: "Metalurgia Futurística Leonardo Serra | Engenharia do Aço em Luanda",
    titleTemplate: "%s | Metalurgia Futurística",
    defaultDescription: "Líderes em metalurgia de precisão e serralheria de alto padrão em Angola. Estruturas metálicas, corte CNC e projetos industriais com excelência técnica.",
    siteUrl: process.env.APP_URL || "https://metarlugia.onrender.com",
    author: "Leonardo Serra",
    keywords: [
        "metalurgia Angola",
        "serralheria Luanda",
        "estruturas metálicas",
        "corte plasma CNC",
        "engenharia do aço",
        "serralheria de arte",
        "polo industrial viana",
        "metalurgia futurística"
    ],

    // Protocolos de Redes Sociais (Open Graph)
    openGraph: {
        type: 'website',
        locale: 'pt_BR',
        url: 'https://metarlugia.onrender.com',
        site_name: 'Metalurgia Futurística Leonardo Serra',
        images: [
            {
                url: 'https://metarlugia.onrender.com/images/og-image-default.jpg',
                width: 1200,
                height: 630,
                alt: 'Metalurgia Futurística de Precisão',
            }
        ],
    },

    // Twitter / X
    twitter: {
        handle: '@leonardoserra',
        site: '@leonardoserra',
        cardType: 'summary_large_image',
    },

    // Dados Estruturados (Schema.org) - Para o Google Local Business
    organization: {
        "@context": "https://schema.org",
        "@type": "IndustrialBusiness",
        "name": "Metalurgia Futurística Leonardo Serra",
        "alternateName": "Leonardo Serra Engenharia",
        "description": "Especialistas em fabricação metálica e engenharia de precisão.",
        "url": "https://metarlugia.onrender.com",
        "logo": "https://metarlugia.onrender.com/images/logo.png",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Polo Industrial de Viana",
            "addressLocality": "Viana",
            "addressRegion": "Luanda",
            "addressCountry": "AO"
        },
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+244939717295",
            "contactType": "sales",
            "areaServed": "AO",
            "availableLanguage": ["Portuguese", "English"]
        },
        "sameAs": [
            "https://www.facebook.com/metalurgiafuturistica",
            "https://www.instagram.com/leonardo_serra_metalurgia",
            "https://www.linkedin.com/company/metalurgia-futuristica"
        ]
    },

    /**
     * Função Helper: Gerador de Metadados
     * Mescla as configurações padrão com dados específicos de uma página (ex: post do blog).
     */
    getMetadata: (customData = {}) => {
        const title = customData.title 
            ? `${customData.title} | Metalurgia Futurística` 
            : seoConfig.defaultTitle;

        return {
            title: title,
            description: customData.description || seoConfig.defaultDescription,
            keywords: customData.keywords ? customData.keywords.join(', ') : seoConfig.keywords.join(', '),
            canonical: customData.canonical || seoConfig.siteUrl,
            og_title: customData.title || seoConfig.defaultTitle,
            og_description: customData.description || seoConfig.defaultDescription,
            og_image: customData.image || seoConfig.openGraph.images[0].url,
            og_url: customData.slug ? `${seoConfig.siteUrl}/${customData.slug}` : seoConfig.siteUrl,
            og_type: customData.type || seoConfig.openGraph.type,
            schema: JSON.stringify(seoConfig.organization)
        };
    }
};

module.exports = seoConfig;