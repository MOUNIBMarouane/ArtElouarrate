import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | ELOUARATE ART",
  description:
    "Get in touch with ELOUARATE ART for inquiries about artworks, commissions, or collaborations.",
  keywords:
    "contact artist, art inquiries, commission artwork, art collaboration, moroccan art contact",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
      <p className="text-center text-lg mb-12">
        This page is under construction. Check back soon to get in touch with
        us.
      </p>
    </div>
  );
}
