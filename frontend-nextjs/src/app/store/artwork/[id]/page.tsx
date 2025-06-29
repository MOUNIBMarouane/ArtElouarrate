"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Palette,
  ArrowLeft,
  MessageCircle,
  Phone,
  Share2,
  Heart,
  Eye,
  Calendar,
  Ruler,
  Tag,
  Star,
  Award,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Info,
  Shield,
  Clock,
  MapPin,
  Users,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import ImageWithFallbackPublic from "@/components/ImageWithFallbackPublic";
import { artworksApi } from "@/lib/api";
import { Artwork } from "@/lib/api";

export default function ArtworkDetail() {
  const params = useParams();
  const artworkId = params.id as string;

  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [relatedArtworks, setRelatedArtworks] = useState<Artwork[]>([]);

  useEffect(() => {
    const loadArtwork = async () => {
      try {
        const response = (await artworksApi.getById(artworkId)) as any;
        if (response?.success) {
          setArtwork(response.data);
        }
      } catch (error) {
        console.error("Error loading artwork:", error);
        // Fallback data
        setArtwork({
          id: artworkId,
          name: "Moroccan Sunset Dreams",
          description:
            "A mesmerizing blend of traditional Moroccan architecture with contemporary artistic vision. This piece captures the golden hour as it bathes the ancient walls of Marrakech in warm, ethereal light. Hand-painted with premium oils on canvas, every brushstroke tells a story of cultural heritage meeting modern artistic expression.\n\nThe artwork features intricate geometric patterns inspired by traditional Moroccan tilework, seamlessly integrated with flowing, contemporary forms. The color palette ranges from deep burgundy and gold to soft amber and cream, creating a visual symphony that speaks to both the past and present.\n\nThis piece is part of my 'Cultural Bridges' series, exploring the intersection of tradition and modernity in Moroccan society. It has been exhibited in three major galleries and has received critical acclaim for its innovative approach to cultural storytelling through visual art.",
          price: 2500,
          originalPrice: 3000,
          medium: "Oil on Canvas",
          dimensions: "60x80 cm",
          year: 2024,
          status: "AVAILABLE",
          isActive: true,
          isFeatured: true,
          viewCount: 256,
          categoryId: "1",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          images: [
            {
              id: "1",
              filename: "moroccan-sunset-1.jpg",
              originalName: "moroccan-sunset-1.jpg",
              mimeType: "image/jpeg",
              size: 1024000,
              url: "/lovable-uploads/03bcb36b-2cef-49c5-bebf-3ee8f4c081d2.png",
              isPrimary: true,
              artworkId: artworkId,
              createdAt: "2024-01-01T00:00:00Z",
            },
            {
              id: "2",
              filename: "moroccan-sunset-2.jpg",
              originalName: "moroccan-sunset-2.jpg",
              mimeType: "image/jpeg",
              size: 1024000,
              url: "/lovable-uploads/1dcc313f-7f0b-4090-9dc3-42d07e5291bf.png",
              isPrimary: false,
              artworkId: artworkId,
              createdAt: "2024-01-01T00:00:00Z",
            },
            {
              id: "3",
              filename: "moroccan-sunset-3.jpg",
              originalName: "moroccan-sunset-3.jpg",
              mimeType: "image/jpeg",
              size: 1024000,
              url: "/lovable-uploads/2fbe62dd-237c-4c35-8bd4-b3c4d5d69c05.png",
              isPrimary: false,
              artworkId: artworkId,
              createdAt: "2024-01-01T00:00:00Z",
            },
          ],
        });

        // Load related artworks
        setRelatedArtworks([
          {
            id: "2",
            name: "Desert Mirage",
            description: "Inspired by the vast Sahara desert",
            price: 3200,
            originalPrice: 3800,
            medium: "Mixed Media",
            dimensions: "70x90 cm",
            year: 2024,
            status: "AVAILABLE",
            isActive: true,
            isFeatured: false,
            viewCount: 142,
            categoryId: "1",
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z",
            images: [
              {
                id: "4",
                filename: "desert-mirage.jpg",
                originalName: "desert-mirage.jpg",
                mimeType: "image/jpeg",
                size: 1024000,
                url: "/lovable-uploads/5632be5b-8b74-457c-8ea8-30f3985cae44.png",
                isPrimary: true,
                artworkId: "2",
                createdAt: "2024-01-01T00:00:00Z",
              },
            ],
          },
          {
            id: "3",
            name: "Ocean Whispers",
            description: "Capturing the Atlantic coastline",
            price: 2200,
            originalPrice: 2600,
            medium: "Watercolor",
            dimensions: "40x60 cm",
            year: 2024,
            status: "AVAILABLE",
            isActive: true,
            isFeatured: false,
            viewCount: 167,
            categoryId: "3",
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z",
            images: [
              {
                id: "5",
                filename: "ocean-whispers.jpg",
                originalName: "ocean-whispers.jpg",
                mimeType: "image/jpeg",
                size: 1024000,
                url: "/lovable-uploads/6472ba85-9629-4ee4-b31e-6cb52f2f6699.png",
                isPrimary: true,
                artworkId: "3",
                createdAt: "2024-01-01T00:00:00Z",
              },
            ],
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    if (artworkId) {
      loadArtwork();
    }
  }, [artworkId]);

  const contactWhatsApp = () => {
    if (!artwork) return;
    const message = `Hello! I'm interested in purchasing "${
      artwork.name
    }" priced at $${artwork.price.toLocaleString()}. Could you provide more details about availability, shipping, and payment options?`;
    const whatsappUrl = `https://wa.me/212658651060?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const shareArtwork = () => {
    if (!artwork) return;
    if (navigator.share) {
      navigator.share({
        title: artwork.name,
        text: artwork.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const nextImage = () => {
    if (!artwork?.images || artwork.images.length === 0) return;
    const images = artwork.images;
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    if (!artwork?.images || artwork.images.length === 0) return;
    const images = artwork.images;
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading artwork details...</p>
        </div>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="min-h-screen bg-slate-900 pt-20 flex items-center justify-center">
        <div className="text-center">
          <Palette className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-400 mb-2">
            Artwork Not Found
          </h2>
          <p className="text-slate-500 mb-6">
            The artwork you're looking for doesn't exist.
          </p>
          <Link href="/store">
            <Button className="bg-amber-500 hover:bg-amber-600">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Store
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 pt-20">
      {/* Navigation */}
      <div className="bg-slate-800/50 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/store">
              <Button
                variant="ghost"
                className="text-slate-300 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Store
              </Button>
            </Link>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={shareArtwork}
                className="text-slate-300 hover:text-white"
              >
                <Share2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-300 hover:text-red-400"
              >
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-800 group">
              <ImageWithFallbackPublic
                src={
                  artwork.images?.[currentImageIndex]?.url || "/placeholder.svg"
                }
                alt={artwork.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Image Navigation */}
              {artwork.images && artwork.images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Button>
                </>
              )}

              {/* Zoom Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsZoomed(true)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ZoomIn className="w-5 h-5" />
              </Button>

              {/* Status Badge */}
              <Badge
                className={`absolute top-4 left-4 ${
                  artwork.status === "AVAILABLE"
                    ? "bg-green-500"
                    : artwork.status === "SOLD"
                    ? "bg-red-500"
                    : "bg-yellow-500"
                } text-white`}
              >
                {artwork.status}
              </Badge>

              {artwork.isFeatured && (
                <Badge className="absolute top-14 left-4 bg-amber-500 text-white">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {artwork.images && artwork.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {artwork.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden ${
                      index === currentImageIndex
                        ? "ring-2 ring-amber-500"
                        : "ring-1 ring-slate-700 hover:ring-slate-600"
                    } transition-all`}
                  >
                    <ImageWithFallbackPublic
                      src={image.url}
                      alt={`${artwork.name} - View ${index + 1}`}
                      width={100}
                      height={100}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Artwork Details */}
          <div className="space-y-8">
            {/* Title and Price */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {artwork.name}
              </h1>

              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-400">
                    {artwork.viewCount} views
                  </span>
                </div>
                {artwork.isFeatured && (
                  <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                    <Award className="w-3 h-3 mr-1" />
                    Featured Artwork
                  </Badge>
                )}
              </div>

              <div className="flex items-center space-x-4">
                {artwork.originalPrice > artwork.price ? (
                  <>
                    <div className="text-3xl font-bold text-amber-400">
                      ${artwork.price.toLocaleString()}
                    </div>
                    <div className="text-xl text-slate-500 line-through">
                      ${artwork.originalPrice.toLocaleString()}
                    </div>
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                      Save $
                      {(artwork.originalPrice - artwork.price).toLocaleString()}
                    </Badge>
                  </>
                ) : (
                  <div className="text-3xl font-bold text-amber-400">
                    ${artwork.price.toLocaleString()}
                  </div>
                )}
              </div>
            </div>

            {/* Artwork Specifications */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Info className="w-5 h-5 mr-2 text-amber-400" />
                  Artwork Details
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Palette className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="text-sm text-slate-400">Medium</div>
                      <div className="text-white font-medium">
                        {artwork.medium}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Ruler className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="text-sm text-slate-400">Dimensions</div>
                      <div className="text-white font-medium">
                        {artwork.dimensions}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="text-sm text-slate-400">Year</div>
                      <div className="text-white font-medium">
                        {artwork.year}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Tag className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="text-sm text-slate-400">Status</div>
                      <div
                        className={`font-medium ${
                          artwork.status === "AVAILABLE"
                            ? "text-green-400"
                            : artwork.status === "SOLD"
                            ? "text-red-400"
                            : "text-yellow-400"
                        }`}
                      >
                        {artwork.status}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Purchase Actions */}
            <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Interested in this artwork?
                </h3>
                <p className="text-slate-300 mb-6">
                  Contact me directly to discuss purchase details, shipping
                  options, and payment methods. I'll respond within 2-4 hours.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                    onClick={contactWhatsApp}
                    disabled={artwork.status === "SOLD"}
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    {artwork.status === "SOLD"
                      ? "Sold Out"
                      : "Contact on WhatsApp"}
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className="border-slate-600 text-slate-200 hover:bg-slate-800/50"
                    onClick={() => window.open("tel:+212658651060", "_blank")}
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Call Direct
                  </Button>
                </div>

                <div className="flex items-center justify-center mt-4 space-x-4 text-sm text-slate-400">
                  <div className="flex items-center space-x-1">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span>Authenticity Guaranteed</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span>Fast Response</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Artist Info */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <ImageWithFallbackPublic
                      src="/lovable-uploads/932dc5ad-3774-42d4-a621-edbc74c310fb.png"
                      alt="Artist"
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">
                      Mohammed Alaoui
                    </h4>
                    <p className="text-slate-400 text-sm flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      Casablanca, Morocco
                    </p>
                  </div>
                </div>

                <p className="text-slate-400 text-sm mb-4">
                  Professional contemporary artist with 12+ years of experience
                  specializing in Moroccan-inspired artwork.
                </p>

                <Link href="/artist-profile">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-slate-300"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    View Artist Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Description Section */}
        <div className="mt-16">
          <Card className="bg-slate-800/30 border-slate-700">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                About This Artwork
              </h2>
              <div className="prose prose-slate prose-invert max-w-none">
                {artwork.description.split("\n").map(
                  (paragraph, index) =>
                    paragraph.trim() && (
                      <p
                        key={index}
                        className="text-slate-300 mb-4 leading-relaxed"
                      >
                        {paragraph}
                      </p>
                    )
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Related Artworks */}
        {relatedArtworks.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">
                Related Artworks
              </h2>
              <Link href="/store">
                <Button
                  variant="outline"
                  className="border-slate-600 text-slate-300"
                >
                  View All
                  <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedArtworks.map((relatedArtwork) => (
                <Card
                  key={relatedArtwork.id}
                  className="bg-slate-800/50 border-slate-700 overflow-hidden hover:border-amber-500/50 transition-all duration-300 group"
                >
                  <div className="relative aspect-video">
                    <ImageWithFallbackPublic
                      src={
                        relatedArtwork.images?.[0]?.url || "/placeholder.svg"
                      }
                      alt={relatedArtwork.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <Badge
                      className={`absolute top-3 right-3 ${
                        relatedArtwork.status === "AVAILABLE"
                          ? "bg-green-500"
                          : "bg-red-500"
                      } text-white`}
                    >
                      {relatedArtwork.status}
                    </Badge>
                  </div>

                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-amber-400 transition-colors">
                      {relatedArtwork.name}
                    </h3>
                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                      {relatedArtwork.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="text-amber-400 font-bold">
                        ${relatedArtwork.price.toLocaleString()}
                      </div>
                      <Link href={`/store/artwork/${relatedArtwork.id}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-600 text-slate-300"
                        >
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
