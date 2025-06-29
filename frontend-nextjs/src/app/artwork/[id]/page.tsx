"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Heart,
  Share2,
  ShoppingCart,
  Eye,
  Calendar,
  Tag,
  Palette,
  Star,
  ZoomIn,
  ZoomOut,
  Download,
  MessageCircle,
  ArrowLeft,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";
import ImageWithFallbackPublic from "@/components/ImageWithFallbackPublic";
import { useArtwork, ArtworkDetails } from "@/hooks/useArtworks";

// Define types based on your API response
interface Artwork {
  id: string;
  title: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  images?: { url: string }[];
  medium?: string;
  dimensions?: string;
  createdYear?: string;
  category: {
    id: string;
    name: string;
  };
  categoryId?: number;
  featured?: boolean;
  sold?: boolean;
  createdAt: string;
}

export default function ArtworkDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: artwork, isLoading, error } = useArtwork(params.id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  const toggleWishlist = () => {
    setIsInWishlist(!isInWishlist);
    toast({
      title: isInWishlist ? "Removed from wishlist" : "Added to wishlist",
      description: isInWishlist
        ? "Artwork removed from your saved collection"
        : "Artwork saved to your collection",
      variant: isInWishlist ? "destructive" : "default",
    });
  };

  const addToCart = () => {
    toast({
      title: "Added to cart",
      description: "Artwork added to your shopping cart",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: artwork?.title || artwork?.name || "Amazing Artwork",
          text: "Check out this beautiful artwork",
          url: window.location.href,
        })
        .catch((err) => console.error("Error sharing:", err));
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Artwork link copied to clipboard",
      });
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="min-h-screen bg-slate-900 pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-white mb-4">
              Artwork Not Found
            </h2>
            <p className="text-slate-400 mb-8">
              The artwork you are looking for does not exist or has been
              removed.
            </p>
            <Button
              onClick={() => router.push("/gallery")}
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Gallery
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Determine if we have images array or single image
  const artworkImages =
    artwork.images || (artwork.image ? [{ url: artwork.image }] : []);

  return (
    <div className="min-h-screen bg-slate-900 pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link
                  href="/"
                  className="text-sm font-medium text-slate-400 hover:text-amber-500"
                >
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-slate-400">/</span>
                  <Link
                    href="/gallery"
                    className="text-sm font-medium text-slate-400 hover:text-amber-500"
                  >
                    Gallery
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <span className="mx-2 text-slate-400">/</span>
                  <span className="text-sm font-medium text-amber-500 truncate max-w-[200px]">
                    {artwork.title || artwork.name}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Artwork Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Images */}
          <div>
            {/* Main Image */}
            <div className="relative bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
              <div
                className={`relative aspect-square overflow-hidden ${
                  isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
                }`}
                onClick={() => setIsZoomed(!isZoomed)}
              >
                <div
                  className={`transition-transform duration-500 ${
                    isZoomed ? "scale-150" : "scale-100"
                  }`}
                >
                  <ImageWithFallbackPublic
                    src={
                      artworkImages[selectedImage]?.url || "/placeholder.svg"
                    }
                    alt={artwork.title || artwork.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Image Controls */}
              <div className="absolute top-4 right-4 flex space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-slate-900/50 backdrop-blur-sm border-slate-700 text-slate-300 hover:bg-slate-900/80 hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsZoomed(!isZoomed);
                        }}
                      >
                        {isZoomed ? (
                          <ZoomOut size={16} />
                        ) : (
                          <ZoomIn size={16} />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isZoomed ? "Zoom Out" : "Zoom In"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {/* Thumbnails */}
            {artworkImages.length > 1 && (
              <div className="grid grid-cols-5 gap-3 mt-4">
                {artworkImages.map((image, index) => (
                  <div
                    key={index}
                    className={`relative aspect-square bg-slate-800 rounded-md overflow-hidden cursor-pointer border-2 ${
                      selectedImage === index
                        ? "border-amber-500"
                        : "border-slate-700"
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <ImageWithFallbackPublic
                      src={image.url}
                      alt={`${artwork.title || artwork.name} - thumbnail ${
                        index + 1
                      }`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-8">
              {/* Title and Actions */}
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {artwork.title || artwork.name}
                  </h1>
                  <div className="text-amber-500 font-medium text-lg mb-4">
                    {formatPrice(artwork.price)}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className={`${
                      isInWishlist
                        ? "bg-red-500/20 text-red-500 border-red-500/30"
                        : "bg-slate-700 text-slate-300 border-slate-600"
                    } hover:bg-slate-700/80`}
                    onClick={toggleWishlist}
                  >
                    <Heart
                      size={18}
                      className={isInWishlist ? "fill-current" : ""}
                    />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-700/80"
                    onClick={handleShare}
                  >
                    <Share2 size={18} />
                  </Button>
                </div>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {artwork.category && (
                  <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30">
                    <Tag className="h-3.5 w-3.5 mr-1" />
                    {artwork.category.name}
                  </Badge>
                )}
                {artwork.featured && (
                  <Badge className="bg-purple-500/20 text-purple-500 border-purple-500/30">
                    <Star className="h-3.5 w-3.5 mr-1" />
                    Featured
                  </Badge>
                )}
                {artwork.sold && (
                  <Badge className="bg-red-500/20 text-red-500 border-red-500/30">
                    Sold
                  </Badge>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-white mb-2">
                  Description
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  {artwork.description}
                </p>
              </div>

              {/* Specifications */}
              <div className="mb-6 space-y-3">
                <h3 className="text-lg font-medium text-white mb-2">Details</h3>

                <div className="grid grid-cols-2 gap-4">
                  {artwork.medium && (
                    <div className="flex items-center">
                      <Palette className="h-4 w-4 text-slate-400 mr-2" />
                      <div>
                        <div className="text-sm text-slate-400">Medium</div>
                        <div className="text-slate-200">{artwork.medium}</div>
                      </div>
                    </div>
                  )}

                  {artwork.dimensions && (
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-slate-400 mr-2"
                      >
                        <path d="M3 3v18h18" />
                        <path d="M15 9H9v6" />
                      </svg>
                      <div>
                        <div className="text-sm text-slate-400">Dimensions</div>
                        <div className="text-slate-200">
                          {artwork.dimensions}
                        </div>
                      </div>
                    </div>
                  )}

                  {artwork.createdYear && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-slate-400 mr-2" />
                      <div>
                        <div className="text-sm text-slate-400">Year</div>
                        <div className="text-slate-200">
                          {artwork.createdYear}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-slate-400 mr-2"
                    >
                      <rect width="18" height="10" x="3" y="11" rx="2" />
                      <circle cx="12" cy="5" r="2" />
                      <path d="M12 7v4" />
                      <line x1="8" x2="8" y1="16" y2="16" />
                      <line x1="16" x2="16" y1="16" y2="16" />
                    </svg>
                    <div>
                      <div className="text-sm text-slate-400">Availability</div>
                      <div className="text-slate-200">
                        {artwork.sold ? "Sold" : "Available"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-slate-700/50 my-6" />

              {/* Purchase Section */}
              {!artwork.sold ? (
                <div className="space-y-4">
                  <div className="flex flex-col space-y-4">
                    <Button
                      onClick={addToCart}
                      className="bg-amber-500 hover:bg-amber-600 text-white h-12 text-base"
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Add to Cart
                    </Button>

                    <div className="text-center text-slate-400 text-sm">
                      <div className="flex justify-center space-x-3 mb-2">
                        <div className="flex items-center">
                          <Shield className="h-4 w-4 mr-1 text-green-500" />
                          <span>Secure payment</span>
                        </div>
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1 text-blue-500" />
                          <span>Verified artist</span>
                        </div>
                      </div>
                      <p>
                        Free shipping • 30-day returns • Certificate of
                        authenticity
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4 text-center">
                  <h3 className="text-lg font-medium text-slate-300 mb-2">
                    This artwork has been sold
                  </h3>
                  <p className="text-slate-400 mb-4">
                    Browse other available artworks in our gallery
                  </p>
                  <Button
                    onClick={() => router.push("/gallery")}
                    variant="outline"
                    className="border-amber-500/30 text-amber-500 hover:bg-amber-500/10"
                  >
                    View More Artworks
                  </Button>
                </div>
              )}

              {/* Contact Artist */}
              <div className="mt-6">
                <Button
                  variant="outline"
                  className="w-full border-slate-700 text-slate-300 hover:bg-slate-700/50"
                  onClick={() => router.push("/contact")}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Ask About This Artwork
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
