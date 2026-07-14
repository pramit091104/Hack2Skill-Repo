import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  url?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title = 'NutriSmart AI | Your Intelligent AI Nutrition Coach',
  description = 'Eat smarter with NutriSmart AI. Track meals instantly with AI vision, chat with your personal AI nutrition coach, and build healthy habits effortlessly.',
  keywords = 'AI nutrition, meal tracker, AI diet coach, calorie counter, healthy habits, nutrition AI',
  url = 'https://nutrismartai.vercel.app',
}) => {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${url}/og-image.jpg`} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={`${url}/og-image.jpg`} />
    </Helmet>
  );
};
