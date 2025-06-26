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
    "artworkSurface": "Canvas",
    "artMedium": artwork.medium,
    "genre": artwork.category?.name || "Fine Art",
    "offers": {
      "@type": "Offer",
      "price": madPrice,
      "priceCurrency": "MAD",
      "availability": artwork.status === "AVAILABLE" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "ELOUARATE ART"
      },
      "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    "brand": {
      "@type": "Brand",
      "name": "ELOUARATE ART"
    },
    "category": artwork.category?.name || "Fine Art",
    "keywords": [
      "moroccan art",
      "painting",
      artwork.medium?.toLowerCase(),
      artwork.category?.name?.toLowerCase(),
      "original artwork",
      "handmade",
      "authentic"
    ].filter(Boolean).join(", ")
  };
};

// Generate gallery page structured data
export const generateGalleryStructuredData = (artworks: ArtworkWithCategory[]) => {
  const baseUrl = "https://elouarateart.com";
  
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "ELOUARATE ART Gallery - Moroccan Paintings Collection",
    "description": "Browse our premium collection of authentic Moroccan paintings and original artworks.",
    "url": `${baseUrl}/artwork`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": artworks.length,
      "itemListElement": artworks.slice(0, 10).map((artwork, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "VisualArtwork",
          "name": artwork.name,
          "url": `${baseUrl}/artwork/${artwork.id}`,
          "image": artwork.images?.[0]?.url 
            ? `${baseUrl}${artwork.images[0].url}` 
            : `${baseUrl}/placeholder-artwork.jpg`,
          "offers": {
            "@type": "Offer",
            "price": Math.round(artwork.price * 10),
            "priceCurrency": "MAD"
          }
        }
      }))
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": baseUrl
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Artwork Gallery",
          "item": `${baseUrl}/artwork`
        }
      ]
    }
  };
};

// Generate category page structured data
export const generateCategoryStructuredData = (categoryName: string, artworks: ArtworkWithCategory[]) => {
  const baseUrl = "https://elouarateart.com";
  
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${categoryName} - ELOUARATE ART`,
    "description": `Discover authentic ${categoryName.toLowerCase()} paintings by ELOUARATE ART. Premium Moroccan artworks with worldwide shipping.`,
    "url": `${baseUrl}/category/${encodeURIComponent(categoryName.toLowerCase())}`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": artworks.length,
      "itemListElement": artworks.slice(0, 10).map((artwork, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "VisualArtwork",
          "name": artwork.name,
          "url": `${baseUrl}/artwork/${artwork.id}`,
          "category": categoryName
        }
      }))
    }
  };
};

// Generate FAQ structured data
export const generateFAQStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Do you ship internationally?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we offer worldwide shipping for all our artworks. Shipping costs and delivery times vary by location. Please contact us for specific shipping information to your country."
        }
      },
      {
        "@type": "Question",
        "name": "Are the paintings original?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, all our paintings are 100% original, handmade artworks created by talented Moroccan artists. Each piece is unique and comes with a certificate of authenticity."
        }
      },
      {
        "@type": "Question",
        "name": "What payment methods do you accept?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We accept various payment methods including credit cards, bank transfers, and PayPal. All transactions are secure and protected."
        }
      },
      {
        "@type": "Question",
        "name": "Can I commission a custom painting?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we offer custom portrait and landscape commissions. Contact us with your requirements, and we'll work with you to create a unique piece tailored to your specifications."
        }
      },
      {
        "@type": "Question",
        "name": "How long does delivery take?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Delivery times vary by location. Domestic shipping within Morocco takes 3-5 business days, while international shipping typically takes 7-21 business days depending on the destination."
        }
      }
    ]
  };
};

// Generate article structured data for blog posts
export const generateArticleStructuredData = (title: string, description: string, publishDate: string, imageUrl?: string) => {
  const baseUrl = "https://elouarateart.com";
  
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "image": imageUrl || `${baseUrl}/blog-default.jpg`,
    "author": {
      "@type": "Person",
      "name": "ELOUARATE ART Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "ELOUARATE ART",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`
      }
    },
    "datePublished": publishDate,
    "dateModified": publishDate,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${encodeURIComponent(title.toLowerCase().replace(/\s+/g, '-'))}`
    }
  };
};

// Generate breadcrumb structured data
export const generateBreadcrumbStructuredData = (items: Array<{ name: string; url: string }>) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
};

// SEO Keywords for different pages
export const SEO_KEYWORDS = {
  home: "moroccan art, premium paintings, art gallery, original artworks, authentic moroccan artists, oil paintings, canvas art, wall art, home decor, fine art, handmade paintings, cultural art, berber art, islamic art, north african art, art collection, luxury art, exclusive paintings, artistic masterpieces, moroccan culture, traditional art, contemporary art, landscape paintings, portrait paintings, custom art, art for sale, buy art online",
  gallery: "art gallery, paintings for sale, original artworks, moroccan paintings, canvas paintings, oil paintings, acrylic paintings, watercolor paintings, fine art, contemporary art, traditional art, landscape art, portrait art, abstract art, cultural paintings, handmade art, authentic art, premium art, luxury paintings, collectible art, wall art, home decor art",
  artwork: "original painting, authentic artwork, handmade painting, moroccan artist, oil on canvas, fine art piece, collectible painting, premium artwork, unique painting, art investment, gallery piece, museum quality, artistic masterpiece, cultural artwork, traditional painting, contemporary piece",
  categories: "art categories, painting styles, art types, moroccan art styles, traditional paintings, contemporary art, landscape paintings, portrait paintings, abstract art, cultural art, religious art, berber art, islamic calligraphy, geometric art, architectural art",
  about: "moroccan artist, art studio, authentic paintings, handmade artworks, cultural heritage, artistic tradition, morocco art scene, berber culture, islamic art history, north african artists, traditional craftsmanship, artistic expertise, cultural authenticity, art passion, creative process"
};

// Generate page-specific meta descriptions
export const generateMetaDescription = (page: string, customData?: any): string => {
  const descriptions = {
    home: "Discover premium Moroccan paintings & original artworks at ELOUARATE ART. Shop authentic oil paintings, custom portraits, and breathtaking landscapes. Premium art gallery with worldwide shipping.",
    gallery: "Browse our exclusive collection of authentic Moroccan paintings and original artworks. Premium oil paintings, portraits, landscapes, and contemporary pieces. Worldwide shipping available.",
    artwork: customData?.name 
      ? `${customData.name} - Authentic ${customData.medium} painting by ELOUARATE ART. ${customData.dimensions}. ${customData.description?.substring(0, 100)}...`
      : "View this unique artwork from ELOUARATE ART's premium collection of authentic Moroccan paintings and original artworks.",
    category: customData?.category 
      ? `${customData.category} Paintings - ELOUARATE ART collection of authentic ${customData.category.toLowerCase()} artworks. Premium Moroccan paintings with worldwide shipping.`
      : "Browse artworks by category from ELOUARATE ART's premium collection of authentic Moroccan paintings.",
    about: "Learn about ELOUARATE ART studio, our authentic Moroccan artists, and the story behind our premium collection of handmade paintings and original artworks.",
    contact: "Contact ELOUARATE ART for custom paintings, commissions, shipping information, and inquiries about our premium collection of authentic Moroccan artworks."
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
    category: customData?.category 
      ? `${customData.category} Paintings - Authentic Moroccan Art | ELOUARATE ART`
      : "Art Categories | ELOUARATE ART",
    about: "About Us - Authentic Moroccan Artists & Premium Art Studio | ELOUARATE ART",
    contact: "Contact Us - Custom Paintings & Art Commissions | ELOUARATE ART",
    admin: "Admin Dashboard | ELOUARATE ART",
    login: "Login | ELOUARATE ART"
  };
  
  return titles[page as keyof typeof titles] || titles.home;
}; 