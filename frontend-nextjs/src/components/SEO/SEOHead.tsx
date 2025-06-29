import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  price?: string;
  currency?: string;
  availability?: string;
  brand?: string;
  category?: string;
  structuredData?: object[];
}

const SEOHead = ({
  title = "ELOUARATE ART - Premium Moroccan Paintings & Original Artworks Gallery",
  description = "Discover premium Moroccan paintings & original artworks at ELOUARATE ART. Shop authentic oil paintings, custom portraits, and breathtaking landscapes. Premium art gallery with worldwide shipping.",
  keywords = "moroccan art, paintings, oil paintings, art gallery, original artworks, custom portraits, authentic art, premium paintings",
  image = "https://elouarateart.com/og-image.jpg",
  url = "https://elouarateart.com/",
  type = "website",
  price,
  currency = "MAD",
  availability = "InStock",
  brand = "ELOUARATE ART",
  category,
  structuredData = [],
}: SEOHeadProps) => {
  const fullTitle = title.includes("ELOUARATE ART")
    ? title
    : `${title} | ELOUARATE ART`;
  const fullDescription =
    description.length > 155
      ? description.substring(0, 155) + "..."
      : description;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="ELOUARATE ART Studio" />
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="ELOUARATE ART" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content="@ElouarateArt" />

      {/* Product-specific meta tags */}
      {price && (
        <>
          <meta property="product:price:amount" content={price} />
          <meta property="product:price:currency" content={currency} />
          <meta property="product:availability" content={availability} />
          <meta property="product:brand" content={brand} />
          {category && <meta property="product:category" content={category} />}
        </>
      )}

      {/* Structured Data */}
      {structuredData.map((data, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEOHead;
