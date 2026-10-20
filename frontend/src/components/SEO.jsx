import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, image, url }) => {
  const siteTitle = title ? `${title} | Styllo Vidros` : 'Styllo Vidros | Box, Espelhos, Janelas, Portas, Guarda Corpo, Blindex e Cortina de Vidro';
  const siteDescription = description || 'Especialistas em projetos sob medida em vidro temperado, cortinas de vidro, boxes e espelhos decorativos em Goiás e DF. Solicite seu orçamento via WhatsApp!';
  const siteUrl = url || 'https://styllovidros.com.br';
  const siteImage = image || 'https://styllovidros.com.br/og-image.jpg';

  return (
    <Helmet>
      {/* Título da Aba */}
      <title>{siteTitle}</title>
      <meta name="description" content={siteDescription} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Open Graph / Facebook / WhatsApp Preview */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={siteImage} />
      <meta property="og:url" content={siteUrl} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={siteDescription} />
      <meta name="twitter:image" content={siteImage} />
    </Helmet>
  );
};

export default SEO;