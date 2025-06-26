import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { ArtworkWithCategory, Category } from "@/types/database";
import { useAddArtwork, useUpdateArtwork } from "@/hooks/useArtworks";
import ImageUpload from "./ImageUpload";

interface ArtworkFormProps {
  artwork?: ArtworkWithCategory | null;
  categories: Category[];
  onClose: () => void;
}

const ArtworkForm = ({ artwork, categories, onClose }: ArtworkFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    original_price: "",
    category_id: "",
    image: "",
    description: "",
    medium: "",
    dimensions: "",
    year: "",
    status: "available" as "available" | "sold" | "reserved",
  });

  const addArtwork = useAddArtwork();
  const updateArtwork = useUpdateArtwork();

  // Convert MAD to USD for storage (1 USD = 10 MAD approximately)
  const convertMADToUSD = (madPrice: number) => {
    return madPrice / 10;
  };

  // Convert USD to MAD for display (1 USD = 10 MAD approximately)
  const convertUSDToMAD = (usdPrice: number) => {
    return usdPrice * 10;
  };

  useEffect(() => {
    if (artwork) {
      setFormData({
        name: artwork.name,
        price: convertUSDToMAD(artwork.price).toString(),
        original_price: convertUSDToMAD(artwork.originalPrice).toString(),
        category_id: artwork.categoryId,
        image: artwork.images?.[0]?.url || "",
        description: artwork.description,
        medium: artwork.medium,
        dimensions: artwork.dimensions,
        year: artwork.year.toString(),
        status: artwork.status.toLowerCase() as
          | "available"
          | "sold"
          | "reserved",
      });
    }
  }, [artwork]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image.trim()) {
      return; // Image is required
    }

    const artworkData = {
      name: formData.name,
      price: convertMADToUSD(parseFloat(formData.price)),
      originalPrice: convertMADToUSD(parseFloat(formData.original_price)),
      categoryId: formData.category_id,
      imageUrl: formData.image, // Use imageUrl instead of image to match backend
      description: formData.description,
      medium: formData.medium,
      dimensions: formData.dimensions,
      year: parseInt(formData.year),
      status: formData.status.toUpperCase() as
        | "AVAILABLE"
        | "SOLD"
        | "RESERVED",
      isActive: true,
      isFeatured: artwork ? artwork.isFeatured : false, // Preserve existing isFeatured state
      // Don't send viewCount, createdAt, updatedAt for updates - let the server handle these
    };

    if (artwork) {
      updateArtwork.mutate(
        { id: artwork.id, artwork: artworkData },
        { onSuccess: onClose }
      );
    } else {
      addArtwork.mutate(artworkData, { onSuccess: onClose });
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {artwork ? "Modifier l'œuvre" : "Ajouter une nouvelle œuvre"}
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            {artwork
              ? "Modifiez les informations de l'œuvre ci-dessous."
              : "Remplissez les informations pour ajouter une nouvelle œuvre à votre collection."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="name">Titre de l'œuvre</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                placeholder="Entrez le titre de l'œuvre"
                className="text-lg font-medium"
              />
            </div>

            <div>
              <Label htmlFor="category">Catégorie</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, category_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
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
            </div>

            <div>
              <Label htmlFor="status">Statut</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "available" | "sold" | "reserved") =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Disponible</SelectItem>
                  <SelectItem value="sold">Vendu</SelectItem>
                  <SelectItem value="reserved">Réservé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="price">Prix actuel (MAD)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
                placeholder="0"
              />
              <p className="text-xs text-gray-500 mt-1">
                Prix en Dirham Marocain
              </p>
            </div>

            <div>
              <Label htmlFor="original_price">Prix original (MAD)</Label>
              <Input
                id="original_price"
                type="number"
                value={formData.original_price}
                onChange={(e) =>
                  setFormData({ ...formData, original_price: e.target.value })
                }
                required
                placeholder="0"
              />
              <p className="text-xs text-gray-500 mt-1">
                Prix original en Dirham Marocain
              </p>
            </div>

            <div>
              <Label htmlFor="medium">Technique</Label>
              <Input
                id="medium"
                value={formData.medium}
                onChange={(e) =>
                  setFormData({ ...formData, medium: e.target.value })
                }
                required
                placeholder="ex: Huile sur toile"
              />
            </div>

            <div>
              <Label htmlFor="dimensions">Dimensions</Label>
              <Input
                id="dimensions"
                value={formData.dimensions}
                onChange={(e) =>
                  setFormData({ ...formData, dimensions: e.target.value })
                }
                required
                placeholder="ex: 60x80 cm"
              />
            </div>

            <div>
              <Label htmlFor="year">Année de création</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: e.target.value })
                }
                required
                placeholder="2024"
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <ImageUpload
              currentImage={formData.image}
              onImageUploaded={(url) =>
                setFormData({ ...formData, image: url })
              }
              artworkId={artwork?.id}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              rows={4}
              placeholder="Description détaillée de l'œuvre, histoire, inspiration et techniques utilisées..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              disabled={
                addArtwork.isPending ||
                updateArtwork.isPending ||
                !formData.image.trim()
              }
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              {artwork ? "Mettre à jour l'œuvre" : "Créer l'œuvre"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Annuler
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ArtworkForm;
