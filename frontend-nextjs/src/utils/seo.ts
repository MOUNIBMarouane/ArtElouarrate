import { ArtworkWithCategory } from "@/types/database";

// Generate artwork structured data for SEO
export const generateArtworkStructuredData = (artwork: ArtworkWithCategory) => {
  const baseUrl = "https://elouarateart.com";
  const imageUrl = artwork.images?.[0]?.url 
    ? `${baseUrl}${artwork.images[0].url}` 
    : `${baseUrl}/placeholder-artwork.jpg`;
  
  // Convert USD to MAD for display
  const madPrice = Math.round(artwork.price * 10);
  
  return {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    "name": artwork.name,
    "description": artwork.description,
    "image": imageUrl,
    "url": `${baseUrl}/artwork/${artwork.id}`,
    "creator": {
      "@type": "Person",
      "name": "ELOUARATE Artist",
      "url": baseUrl
    },
    "dateCreated": artwork.year?.toString(),
    "medium": artwork.medium,
    "dimensions": artwork.dimensions,
    "artform": "Painting",
    "offers": {
      "@type": "Offer",
      "price": madPrice,
      "priceCurrency": "MAD",
      "availability": artwork.status === "AVAILABLE" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "ELOUARATE ART"
      }
    },
    "brand": {
      "@type": "Brand",
      "name": "ELOUARATE ART"
    }
  };
};

// SEO Keywords for different pages
export const SEO_KEYWORDS = {
  home: "moroccan art, premium paintings, art gallery, original artworks, authentic moroccan artists, oil paintings, canvas art, wall art, home decor, fine art, handmade paintings, cultural art, berber art, islamic art, north african art, art collection, luxury art, exclusive paintings, artistic masterpieces, moroccan culture, traditional art, contemporary art, landscape paintings, portrait paintings, custom art, art for sale, buy art online",
  gallery: "art gallery, paintings for sale, original artworks, moroccan paintings, canvas paintings, oil paintings, acrylic paintings, watercolor paintings, fine art, contemporary art, traditional art, landscape art, portrait art, abstract art, cultural paintings, handmade art, authentic art, premium art, luxury paintings, collectible art, wall art, home decor art",
  artwork: "original painting, authentic artwork, handmade painting, moroccan artist, oil on canvas, fine art piece, collectible painting, premium artwork, unique painting, art investment, gallery piece, museum quality, artistic masterpiece, cultural artwork, traditional painting, contemporary piece",
  artist: "moroccan artist, art portfolio, artist biography, artistic journey, painting techniques, artist showcase, professional artist, fine artist, art career, creative process, art inspiration, artist statement, art education, art exhibitions, art awards, artistic style, art philosophy, artist interview, art studio, behind the scenes"
};

// Generate page-specific meta descriptions
export const generateMetaDescription = (page: string, customData?: any): string => {
  const descriptions = {
    home: "Discover premium Moroccan paintings & original artworks at ELOUARATE ART. Shop authentic oil paintings, custom portraits, and breathtaking landscapes. Premium art gallery with worldwide shipping.",
    gallery: "Browse our exclusive collection of authentic Moroccan paintings and original artworks. Premium oil paintings, portraits, landscapes, and contemporary pieces. Worldwide shipping available.",
    artwork: customData?.name 
      ? `${customData.name} - Authentic ${customData.medium} painting by ELOUARATE ART. ${customData.dimensions}. ${customData.description?.substring(0, 100)}...`
      : "View this unique artwork from ELOUARATE ART's premium collection of authentic Moroccan paintings and original artworks.",
    artist: "Learn about the artist behind ELOUARATE ART. Discover the artistic journey, techniques, inspiration, and philosophy that shapes these unique Moroccan artworks."
  };
  
  return descriptions[page as keyof typeof descriptions] || descriptions.home;
};

// Generate dynamic page titles
export const generatePageTitle = (page: string, customData?: any): string => {
  const titles = {
    home: "ELOUARATE ART - Premium Moroccan Paintings & Original Artworks Gallery",
    gallery: "Art Gallery - Premium Moroccan Paintings Collection | ELOUARATE ART",
    artwork: customData?.name 
      ? `${customData.name} - ${customData.medium} Painting | ELOUARATE ART`
      : "Original Artwork | ELOUARATE ART",
    artist: "Artist Showcase - The Creator Behind ELOUARATE ART"
  };
  
  return titles[page as keyof typeof titles] || titles.home;
}; 