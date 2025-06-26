import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Heart, Eye, Palette, MapPin } from "lucide-react";
import { useArtworks } from "@/hooks/useArtworks";
import { useCategories } from "@/hooks/useCategories";
import { getImageUrl } from "@/lib/utils";

const ArtistShowcase = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const { data: artworks = [], isLoading: artworksLoading } =
    useArtworks(searchTerm);
  const { data: categories = [] } = useCategories();

  const filteredArtworks = artworks.filter((artwork) => {
    const categoryMatch =
      selectedCategory === "all" || artwork.categoryId === selectedCategory;
    const statusMatch =
      selectedStatus === "all" ||
      artwork.status.toLowerCase() === selectedStatus;
    return categoryMatch && statusMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 border-green-200";
      case "sold":
        return "bg-red-100 text-red-800 border-red-200";
      case "reserved":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Convert USD to MAD (approximate exchange rate: 1 USD = 10 MAD)
  const convertToMAD = (usdPrice: number) => {
    return Math.round(usdPrice * 10);
  };

  const formatMADPrice = (usdPrice: number) => {
    const madPrice = convertToMAD(usdPrice);
    return `${madPrice.toLocaleString()} MAD`;
  };

  if (artworksLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              ELOUARATE ART
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Discover exceptional artwork - Prix en Dirham Marocain (MAD)
            </p>
            <div className="flex items-center justify-center space-x-6 text-purple-200">
              <div className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>Original Artworks</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Morocco</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Search and Filters */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher des œuvres d'art..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div className="flex gap-3">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="available">Disponible</SelectItem>
                  <SelectItem value="sold">Vendu</SelectItem>
                  <SelectItem value="reserved">Réservé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        {filteredArtworks.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Palette className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucune œuvre trouvée
            </h3>
            <p className="text-gray-600">
              Essayez d'ajuster vos critères de recherche
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredArtworks.map((artwork) => (
              <div
                key={artwork.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={getImageUrl(artwork.images?.[0]?.url)}
                    alt={artwork.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center justify-between">
                        <Badge
                          className="text-white border-0 backdrop-blur-sm"
                          style={{
                            backgroundColor: artwork.category?.color + "CC",
                          }}
                        >
                          {artwork.category?.name}
                        </Badge>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="rounded-full bg-white/20 backdrop-blur-sm border-0 text-white hover:bg-white/30"
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="rounded-full bg-white/20 backdrop-blur-sm border-0 text-white hover:bg-white/30"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge
                      className={`${getStatusColor(
                        artwork.status.toLowerCase()
                      )} backdrop-blur-sm`}
                    >
                      {artwork.status === "AVAILABLE"
                        ? "Disponible"
                        : artwork.status === "SOLD"
                        ? "Vendu"
                        : "Réservé"}
                    </Badge>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-bold text-xl text-gray-900 group-hover:text-purple-600 transition-colors duration-300 mb-2">
                      {artwork.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {artwork.medium} • {artwork.dimensions} • {artwork.year}
                    </p>
                  </div>

                  <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                    {artwork.description}
                  </p>

                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline space-x-2">
                          <span className="text-2xl font-bold text-gray-900">
                            {formatMADPrice(artwork.price)}
                          </span>
                          {artwork.originalPrice > artwork.price && (
                            <span className="text-sm text-gray-500 line-through">
                              {formatMADPrice(artwork.originalPrice)}
                            </span>
                          )}
                        </div>
                        {artwork.originalPrice > artwork.price && (
                          <div className="text-xs text-green-600 font-semibold">
                            Économie{" "}
                            {formatMADPrice(
                              artwork.originalPrice - artwork.price
                            )}
                          </div>
                        )}
                      </div>
                      <Button
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                        disabled={artwork.status === "SOLD"}
                      >
                        {artwork.status === "SOLD"
                          ? "Vendu"
                          : artwork.status === "RESERVED"
                          ? "Réservé"
                          : "Demander"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistShowcase;
