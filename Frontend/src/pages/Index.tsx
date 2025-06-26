import Header from "@/components/Header";
import ArtistHero from "@/components/artist/ArtistHero";
import AboutSection from "@/components/artist/AboutSection";
import FeaturedArtworks from "@/components/artist/FeaturedArtworks";
import ArtisticJourney from "@/components/artist/ArtisticJourney";
import ContactSection from "@/components/artist/ContactSection";
import Footer from "@/components/Footer";
import StatisticsSection from "@/components/artist/StatisticsSection";
import TestimonialsSection from "@/components/artist/TestimonialsSection";
import ProcessSection from "@/components/artist/ProcessSection";
import PremiumShowcase from "@/components/artist/PremiumShowcase";
import HorizontalCategoriesSection from "@/components/HorizontalCategoriesSection";
import SEOHead from "@/components/SEO/SEOHead";
import {
  SEO_KEYWORDS,
  generateMetaDescription,
  generatePageTitle,
} from "@/utils/seo";

const Index = () => {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "ELOUARATE ART",
      url: "https://elouarateart.com",
      description:
        "Premium Moroccan art gallery specializing in authentic oil paintings, custom portraits, and original artworks.",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://elouarateart.com/artwork?search={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "ELOUARATE ART",
      url: "https://elouarateart.com",
      logo: "https://elouarateart.com/logo.png",
      description:
        "Premium Moroccan art gallery specializing in authentic oil paintings, custom portraits, and original artworks.",
      foundingDate: "2020",
      address: {
        "@type": "PostalAddress",
        addressCountry: "MA",
        addressRegion: "Morocco",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+212658651060",
        contactType: "customer service",
        areaServed: "Worldwide",
        availableLanguage: ["English", "Arabic", "French"],
      },
      sameAs: [
        "https://www.instagram.com/elouarateart",
        "https://www.facebook.com/elouarateart",
      ],
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-900">
      <SEOHead
        title={generatePageTitle("home")}
        description={generateMetaDescription("home")}
        keywords={SEO_KEYWORDS.home}
        url="https://elouarateart.com/"
        image="https://elouarateart.com/og-image-home.jpg"
        structuredData={structuredData}
      />
      <Header />

      {/* Add top padding to account for fixed header */}
      <div className="pt-20">
        <ArtistHero />
        {/* <StatisticsSection /> */}
        {/* <AboutSection /> */}
        <PremiumShowcase />
        <HorizontalCategoriesSection />
        {/* <FeaturedArtworks /> */}
        {/* <ProcessSection /> */}
        {/* <TestimonialsSection /> */}
        {/* <ArtisticJourney /> */}
        <ContactSection />
      </div>

      <Footer />
    </div>
  );
};

export default Index;
