import { Metadata, ResolvingMetadata } from "next";
import {
  SEO_KEYWORDS,
  generateMetaDescription,
  generatePageTitle,
} from "@/utils/seo";

// Define the types for generateMetadata params
type Props = {
  params: { id: string };
};

// Generate dynamic metadata based on the artwork ID
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Fetch artwork data
  const id = params.id;
  let title = "Artwork";
  let description = "View this beautiful artwork in our gallery";

  try {
    // Fetch the artwork details
    const response = await fetch(`http://localhost:3000/api/artworks/${id}`);
    if (response.ok) {
      const artwork = await response.json();
      title = artwork.title || artwork.name || "Artwork";
      description =
        artwork.description || "View this beautiful artwork in our gallery";
    }
  } catch (error) {
    console.error("Error fetching artwork for metadata:", error);
  }

  return {
    title: generatePageTitle(title),
    description: description,
    keywords: SEO_KEYWORDS.gallery,
    openGraph: {
      title: title,
      description: description,
      type: "website",
    },
  };
}

export default function ArtworkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
