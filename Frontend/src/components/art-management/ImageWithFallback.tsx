import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload, AlertCircle, ImageIcon, RefreshCw } from "lucide-react";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useUpdateArtwork } from "@/hooks/useArtworks";
import { toast } from "@/hooks/use-toast";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  artworkId: string;
  artworkName: string;
  onImageUpdated?: () => void;
  className?: string;
}

const ImageWithFallback = ({
  src,
  alt,
  artworkId,
  artworkName,
  onImageUpdated,
  className = "",
}: ImageWithFallbackProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadImage, uploading } = useImageUpload();
  const updateArtwork = useUpdateArtwork();

  const handleImageError = () => {
    console.error("Image failed to load:", src);
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleFileSelect = async (file: File) => {
    try {
      console.log("Uploading new image for artwork:", artworkId);

      // Upload the image first
      const uploadedUrl = await uploadImage(file);

      if (uploadedUrl) {
        console.log("Image uploaded successfully:", uploadedUrl);

        // Update the artwork with the new image URL
        await updateArtwork.mutateAsync({
          id: artworkId,
          imageUrl: uploadedUrl,
        });

        toast({
          title: "Succès",
          description: "Image mise à jour avec succès!",
        });

        // Reset states
        setImageError(false);
        setIsDialogOpen(false);

        // Notify parent component
        onImageUpdated?.();
      }
    } catch (error) {
      console.error("Error updating artwork image:", error);
      toast({
        title: "Erreur",
        description: "Échec de la mise à jour de l'image. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRetryLoad = () => {
    setImageError(false);
    setImageLoading(true);
    // Force reload by adding timestamp
    const img = new Image();
    img.onload = handleImageLoad;
    img.onerror = handleImageError;
    img.src = `${src}?t=${Date.now()}`;
  };

  // If image loaded successfully, show it
  if (!imageError && !imageLoading) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
    );
  }

  // If image is loading, show skeleton
  if (imageLoading && !imageError) {
    return (
      <div
        className={`${className} bg-gray-200 animate-pulse flex items-center justify-center`}
      >
        <ImageIcon className="h-8 w-8 text-gray-400" />
        <img
          src={src}
          alt={alt}
          className="hidden"
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      </div>
    );
  }

  // If image failed to load, show fallback with options
  return (
    <div
      className={`${className} bg-gradient-to-br from-red-50 to-orange-50 border-2 border-dashed border-red-200 flex flex-col items-center justify-center relative group`}
    >
      <div className="text-center p-4">
        <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
        <p className="text-sm text-red-600 font-medium mb-2">Image manquante</p>
        <p className="text-xs text-gray-500 mb-3">
          Le fichier image a été supprimé du serveur
        </p>

        <div className="flex flex-col space-y-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleRetryLoad}
            className="text-xs hover:bg-blue-50"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Réessayer
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="text-xs bg-purple-600 hover:bg-purple-700"
              >
                <Upload className="h-3 w-3 mr-1" />
                Télécharger
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Remplacer l'image manquante</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  <p>
                    <strong>Œuvre:</strong> {artworkName}
                  </p>
                  <p>
                    <strong>ID:</strong> {artworkId}
                  </p>
                  <p className="text-red-600 mt-2">
                    L'image de cette œuvre est manquante. Veuillez télécharger
                    une nouvelle image.
                  </p>
                </div>

                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Cliquez pour sélectionner une image
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, GIF jusqu'à 10MB
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={uploading || updateArtwork.isPending}
                />

                {(uploading || updateArtwork.isPending) && (
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                    <span>
                      {uploading ? "Téléchargement..." : "Mise à jour..."}
                    </span>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1"
                    disabled={uploading || updateArtwork.isPending}
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1"
                    disabled={uploading || updateArtwork.isPending}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choisir image
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default ImageWithFallback;
