import ArtistHero from "@/components/artist/ArtistHero";
import AboutSection from "@/components/artist/AboutSection";
import ArtisticJourney from "@/components/artist/ArtisticJourney";
import ProcessSection from "@/components/artist/ProcessSection";
import TestimonialsSection from "@/components/artist/TestimonialsSection";
import StatisticsSection from "@/components/artist/StatisticsSection";
import ContactSection from "@/components/artist/ContactSection";
import { Metadata } from "next";
import {
  SEO_KEYWORDS,
  generateMetaDescription,
  generatePageTitle,
} from "@/utils/seo";

export const metadata: Metadata = {
  title: generatePageTitle("artist"),
  description: generateMetaDescription("artist"),
  keywords: SEO_KEYWORDS.artist,
  openGraph: {
    title: generatePageTitle("artist"),
    description: generateMetaDescription("artist"),
    url: "https://elouarateart.com/artist-showcase",
    images: [
      {
        url: "https://elouarateart.com/og-image-artist.jpg",
        width: 1200,
        height: 630,
        alt: "ELOUARATE ART - Artist Showcase",
      },
    ],
  },
};

export default function ArtistShowcase() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-900">
      <ArtistHero />
      <StatisticsSection />
      <AboutSection />
      <ProcessSection />
      <ArtisticJourney />
      <TestimonialsSection />
      <ContactSection />
    </div>
  );
}
