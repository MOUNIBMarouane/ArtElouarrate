"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Eye, Heart } from "lucide-react";
import Link from "next/link";
import { useArtworks } from "@/hooks/useArtworks";
import { getImageUrl } from "@/lib/utils";
import ImageWithFallbackPublic from "@/components/ImageWithFallbackPublic";

const FeaturedArtworks = () => {
  const { data: artworks = [] } = useArtworks("");

  // Get featured artworks (first 3 available ones)
  const featuredArtworks = artworks
    .filter((artwork) => artwork.status === "AVAILABLE")
    .slice(0, 3);

  // Convert USD to MAD for display (1 USD = 10 MAD approximately)
  const convertToMAD = (usdPrice: number) => {
    return Math.round(usdPrice * 10);
  };

  const formatMADPrice = (usdPrice: number) => {
    const madPrice = convertToMAD(usdPrice);
    return `${madPrice.toLocaleString()} MAD`;
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-purple-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Œuvres{" "}
            <span className="bg-gradient-to-r from-purple-600 to-rose-600 bg-clip-text text-transparent">
              Sélectionnées
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez une sélection de mes œuvres les plus célèbres, chacune
            racontant une histoire unique
          </p>
        </div>

        {featuredArtworks.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredArtworks.map((artwork) => (
              <Card
                key={artwork.id}
                className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                <div className="relative overflow-hidden">
                  <ImageWithFallbackPublic
                    src={getImageUrl(artwork.images?.[0]?.url)}
                    alt={artwork.name}
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
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
                </div>

                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="font-bold text-xl text-gray-900 group-hover:text-purple-600 transition-colors duration-300 mb-2">
                      {artwork.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {artwork.medium} • {artwork.dimensions} • {artwork.year}
                    </p>
                  </div>

                  <p className="text-gray-700 text-sm leading-relaxed line-clamp-2">
                    {artwork.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatMADPrice(artwork.price)}
                    </div>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 text-white"
                    >
                      Voir détails
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Eye className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Œuvres bientôt disponibles
            </h3>
            <p className="text-gray-600">
              De nouveaux chefs-d'œuvre sont en préparation pour l'exposition
            </p>
          </div>
        )}

        <div className="text-center">
          <Link href="/artwork">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 text-white px-8 py-3 rounded-full"
            >
              Voir toutes les œuvres
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedArtworks;
