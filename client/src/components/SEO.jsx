import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

export default function SEO({ title, description, image = "https://typegiggle.com/typegiggle_logo.png" }) {
  const location = useLocation();
  const fullTitle = title ? `${title} | TypeGiggle` : "TypeGiggle - Fun Typing Test & Speed Tracker";
  
  // Automatically construct the canonical URL based on the current path
  const canonicalUrl = `https://typegiggle.com${location.pathname}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      
      {/* Correct Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="website" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}