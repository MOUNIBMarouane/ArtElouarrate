import { Metadata } from "next";
import HomeContent from "@/components/HomeContent";

export const metadata: Metadata = {
  title: "ELOUARATE ART - Premium Art Gallery | Authentic Artworks Collection",
  description:
    "Discover exceptional artworks at ELOUARATE ART gallery. Premium collection of abstract, landscape, portrait, urban and digital art. Professional art consultation and worldwide shipping.",
  keywords: [
    "art gallery",
    "artworks",
    "paintings",
    "abstract art",
    "landscape art",
    "portrait art",
    "digital art",
    "art collection",
    "professional art",
    "premium art",
  ],
  authors: [{ name: "ELOUARATE ART Gallery" }],
  creator: "ELOUARATE ART",
  publisher: "ELOUARATE ART Gallery",
  openGraph: {
    title: "ELOUARATE ART - Premium Art Gallery",
    description:
      "Discover exceptional artworks at our premium art gallery. Professional collection with worldwide shipping.",
    url: "https://elouarate-art.com",
    siteName: "ELOUARATE ART",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ELOUARATE ART - Premium Art Gallery",
    description: "Discover exceptional artworks at our premium art gallery.",
    creator: "@elouarate_art",
  },
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
};

// Structured data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "ArtGallery",
  name: "ELOUARATE ART",
  description:
    "Premium art gallery featuring exceptional artworks across multiple categories",
  url: "https://elouarate-art.com",
  sameAs: [
    "https://facebook.com/elouarate-art",
    "https://instagram.com/elouarate_art",
  ],
  address: {
    "@type": "PostalAddress",
    addressCountry: "Global",
  },
  artMedium: [
    "Painting",
    "Digital Art",
    "Abstract Art",
    "Landscape Art",
    "Portrait Art",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Art Collection",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "VisualArtwork",
          name: "Premium Art Collection",
        },
      },
    ],
  },
};

export default function HomePage() {
  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Main Home Content */}
      <HomeContent />
    </>
  );
}
