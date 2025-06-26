import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye } from "lucide-react";
import { ArtworkWithCategory, Category } from "@/types/database";
import { useDeleteArtwork } from "@/hooks/useArtworks";
import { getImageUrl } from "@/lib/utils";
import ImageWithFallback from "./ImageWithFallback";

interface ArtworkListProps {
  artworks: ArtworkWithCategory[];
  categories: Category[];
  onEdit: (artwork: ArtworkWithCategory) => void;
  onImageUpdated?: () => void;
}

const ArtworkList = ({
  artworks,
  categories,
  onEdit,
  onImageUpdated,
}: ArtworkListProps) => {
  const deleteArtwork = useDeleteArtwork();

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.color || "#8B5CF6";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-100 text-green-800";
      case "SOLD":
        return "bg-red-100 text-red-800";
      case "RESERVED":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Convert USD to MAD for display (1 USD = 10 MAD approximately)
  const convertToMAD = (usdPrice: number) => {
    return Math.round(usdPrice * 10);
  };

  const formatMADPrice = (usdPrice: number) => {
    const madPrice = convertToMAD(usdPrice);
    return `${madPrice.toLocaleString()} MAD`;
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette œuvre ?")) {
      deleteArtwork.mutate(id);
    }
  };

  if (artworks.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-300">
        <p className="text-gray-500 text-lg">
          Aucune œuvre trouvée correspondant à votre recherche.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {artworks.map((artwork) => (
        <div
          key={artwork.id}
          className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group"
        >
          <div className="relative overflow-hidden">
            {artwork.images && artwork.images.length > 0 ? (
              <ImageWithFallback
                src={getImageUrl(artwork.images[0].url)}
                alt={artwork.name}
                artworkId={artwork.id}
                artworkName={artwork.name}
                onImageUpdated={onImageUpdated}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-2">🎨</div>
                  <div className="text-sm">Pas d'image</div>
                </div>
              </div>
            )}
            <div className="absolute top-3 left-3">
              <Badge
                className="text-white font-medium"
                style={{
                  backgroundColor: getCategoryColor(artwork.categoryId),
                }}
              >
                {artwork.category?.name || "Unknown Category"}
              </Badge>
            </div>
            <div className="absolute top-3 right-3">
              <Badge className={`${getStatusColor(artwork.status)} border-0`}>
                {artwork.status === "AVAILABLE"
                  ? "Disponible"
                  : artwork.status === "SOLD"
                  ? "Vendu"
                  : "Réservé"}
              </Badge>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="absolute bottom-3 right-3 flex space-x-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="rounded-full bg-white/90 backdrop-blur-sm hover:bg-white"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="p-5 space-y-4">
            <div>
              <h3 className="font-bold text-lg text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
                {artwork.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {artwork.medium} • {artwork.dimensions} • {artwork.year}
              </p>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
              {artwork.description}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="space-y-1">
                <div className="flex items-baseline space-x-2">
                  <span className="text-xl font-bold text-gray-900">
                    {formatMADPrice(artwork.price)}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    {formatMADPrice(artwork.originalPrice)}
                  </span>
                </div>
                <div className="text-xs text-green-600 font-semibold">
                  Économie{" "}
                  {formatMADPrice(artwork.originalPrice - artwork.price)}
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(artwork)}
                className="flex-1 hover:bg-purple-50 hover:border-purple-300"
              >
                <Edit className="h-4 w-4 mr-1" />
                Modifier
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(artwork.id)}
                disabled={deleteArtwork.isPending}
                className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArtworkList;
