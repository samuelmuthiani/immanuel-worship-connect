import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEO = ({
  title = 'Immanuel Worship Centre | Spiritual Home in Kilifi',
  description = 'Immanuel Worship Centre is a vibrant spiritual community in Kilifi, Kenya. Join us for worship, ministry, and spiritual growth.',
  keywords = 'church, worship, Kilifi, Kenya, Immanuel, Jesus, Christianity, community',
  image = 'https://immanuelworshipcentreorg.vercel.app/og-image.jpg',
  url = 'https://immanuelworshipcentreorg.vercel.app/',
  type = 'website'
}: SEOProps) => {
  const siteTitle = title.includes('Immanuel') ? title : `${title} | Immanuel Worship Centre`;

  return (
    <Helmet>
      {/* Standard metadata */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SEO;
