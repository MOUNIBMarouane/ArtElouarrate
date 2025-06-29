"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Palette,
  Search,
  Filter,
  Grid3X3,
  List,
  Star,
  Eye,
  Phone,
  MessageCircle,
  ArrowRight,
  SortAsc,
  SortDesc,
  Crown,
  Sparkles,
  Heart,
  Share2,
} from "lucide-react";
import Link from "next/link";
import ImageWithFallbackPublic from "@/components/ImageWithFallbackPublic";
import { artworksApi, categoriesApi } from "@/lib/api";
import { Artwork, Category } from "@/lib/api";

export default function Store() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredArtworks, setFilteredArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load artworks from real API
        const artworksResponse = await artworksApi.getAll();
        if (artworksResponse?.success) {
          setArtworks(artworksResponse.data || []);
        }

        // Load categories from real API
        const categoriesResponse = await categoriesApi.getAll();
        if (categoriesResponse?.success) {
          setCategories(categoriesResponse.data || []);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        // Set empty arrays if API fails
        setArtworks([]);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter and sort artworks
  useEffect(() => {
    let filtered = [...artworks];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (artwork) =>
          artwork.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          artwork.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          artwork.medium?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (artwork) => artwork.categoryId === selectedCategory
      );
    }

    // Filter by price range
    if (priceRange.min) {
      filtered = filtered.filter(
        (artwork) => artwork.price >= parseFloat(priceRange.min)
      );
    }
    if (priceRange.max) {
      filtered = filtered.filter(
        (artwork) => artwork.price <= parseFloat(priceRange.max)
      );
    }

    // Sort artworks
    switch (sortBy) {
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "popular":
        filtered.sort((a, b) => b.viewCount - a.viewCount);
        break;
    }

    setFilteredArtworks(filtered);
  }, [artworks, searchTerm, selectedCategory, sortBy, priceRange]);

  const contactWhatsApp = (artwork: Artwork) => {
    const message = `Hello! I'm interested in "${
      artwork.name
    }" priced at $${artwork.price.toLocaleString()}. Could you provide more details?`;
    const whatsappUrl = `https://wa.me/212658651060?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const shareArtwork = (artwork: Artwork) => {
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

  return (
    <div className="min-h-screen bg-slate-900 pt-20">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-purple-500/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 mb-6">
            <Crown className="w-4 h-4 mr-2" />
            Premium Art Store
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Art & <span className="text-amber-400">Tableaux</span> Collection
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Discover exceptional artworks and tableaux, each piece carefully
            crafted with passion and available for your collection.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={() =>
                window.open(
                  "https://wa.me/212658651060?text=Hello! I'd like to learn more about your art collection.",
                  "_blank"
                )
              }
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Contact on WhatsApp
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-slate-600 text-slate-200 hover:bg-slate-800/50 px-8 py-3 rounded-xl"
              onClick={() => window.open("tel:+212658651060", "_blank")}
            >
              <Phone className="w-5 h-5 mr-2" />
              Call Now
            </Button>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search artworks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700 text-white focus:border-amber-500"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-4 items-center">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-40 bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode Toggle */}
              <div className="flex border border-slate-700 rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={
                    viewMode === "grid"
                      ? "bg-amber-500 hover:bg-amber-600"
                      : "text-slate-400 hover:text-white"
                  }
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={
                    viewMode === "list"
                      ? "bg-amber-500 hover:bg-amber-600"
                      : "text-slate-400 hover:text-white"
                  }
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Artworks Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card
                  key={i}
                  className="bg-slate-800 border-slate-700 overflow-hidden"
                >
                  <div className="aspect-square bg-slate-700 animate-pulse"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-slate-700 rounded animate-pulse mb-2"></div>
                    <div className="h-4 bg-slate-700 rounded animate-pulse w-3/4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredArtworks.length > 0 ? (
            <div
              className={`${
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-6"
              }`}
            >
              {filteredArtworks.map((artwork) => (
                <Card
                  key={artwork.id}
                  className={`bg-slate-800/80 backdrop-blur-sm border-slate-700 overflow-hidden hover:border-amber-500/50 transition-all duration-300 group hover:transform hover:scale-105 card-hover ${
                    viewMode === "list" ? "flex flex-row" : ""
                  }`}
                >
                  <div
                    className={`relative overflow-hidden ${
                      viewMode === "list" ? "w-64 h-64" : "aspect-square"
                    }`}
                  >
                    <ImageWithFallbackPublic
                      src={artwork.images?.[0]?.url || "/placeholder.svg"}
                      alt={artwork.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Status Badges */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                      <Badge
                        className={`${
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
                        <Badge className="bg-amber-500 text-white">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>

                    {/* Hover Actions */}
                    <div className="absolute bottom-3 left-3 right-3 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="flex items-center justify-between text-white">
                        <div className="flex items-center space-x-2">
                          <Eye className="w-4 h-4" />
                          <span className="text-sm">{artwork.viewCount}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:bg-white/20 p-2"
                            onClick={(e) => {
                              e.preventDefault();
                              shareArtwork(artwork);
                            }}
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white p-2"
                            onClick={(e) => {
                              e.preventDefault();
                              contactWhatsApp(artwork);
                            }}
                          >
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <CardContent
                    className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold text-white line-clamp-1 group-hover:text-amber-400 transition-colors">
                        {artwork.name}
                      </h3>
                      <div className="text-right ml-4">
                        {artwork.originalPrice > artwork.price && (
                          <div className="text-sm text-slate-500 line-through">
                            ${artwork.originalPrice.toLocaleString()}
                          </div>
                        )}
                        <div className="text-lg font-bold text-amber-400">
                          ${artwork.price.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                      {artwork.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                      <span>{artwork.medium}</span>
                      <span>{artwork.dimensions}</span>
                      <span>{artwork.year}</span>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={`/store/artwork/${artwork.id}`}
                        className="flex-1"
                      >
                        <Button
                          variant="outline"
                          className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                        >
                          View Details
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                      <Button
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                        onClick={() => contactWhatsApp(artwork)}
                        disabled={artwork.status === "SOLD"}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Contact
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Palette className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-400 mb-2">
                No Artworks Found
              </h3>
              <p className="text-slate-500 mb-6">
                Try adjusting your search criteria or filters
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setPriceRange({ min: "", max: "" });
                }}
                variant="outline"
                className="border-slate-600 text-slate-300"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* WhatsApp Contact CTA */}
      <section className="py-16 bg-gradient-to-r from-green-500/10 to-emerald-500/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Interested in a{" "}
            <span className="text-green-400">Custom Piece?</span>
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Contact me directly for custom artwork, commissions, or any
            questions about the available pieces.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={() =>
                window.open(
                  "https://wa.me/212658651060?text=Hello! I'm interested in commissioning a custom artwork.",
                  "_blank"
                )
              }
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Custom Commission
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-slate-600 text-slate-200 hover:bg-slate-800/50 px-8 py-4 text-lg rounded-xl"
              onClick={() => window.open("tel:+212658651060", "_blank")}
            >
              <Phone className="w-5 h-5 mr-2" />
              Direct Call
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
