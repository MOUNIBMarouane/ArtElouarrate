import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, Image, RotateCcw, Trash2 } from "lucide-react";
import { useImageUpload } from "@/hooks/useImageUpload";

interface ImageUploadProps {
  currentImage?: string;
  currentImageId?: string; // ID of the current image for deletion/replacement
  onImageUploaded: (url: string) => void;
  onImageDeleted?: () => void;
  className?: string;
  artworkId?: string; // ID of the artwork for direct image association
}

const ImageUpload = ({
  currentImage,
  currentImageId,
  onImageUploaded,
  onImageDeleted,
  className = "",
  artworkId,
}: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [isExistingImage, setIsExistingImage] = useState(false);

  // Update preview when currentImage changes (for editing)
  useEffect(() => {
    console.log("ImageUpload: currentImage changed to:", currentImage);
    setPreview(currentImage || null);
    setIsExistingImage(!!currentImage && !currentImage.startsWith("blob:"));
  }, [currentImage]);

  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, deleteImage, replaceImage, uploading } =
    useImageUpload();

  const handleFileSelect = async (
    file: File,
    isReplacement: boolean = false
  ) => {
    if (file && file.type.startsWith("image/")) {
      console.log(
        "ImageUpload: File selected:",
        file.name,
        "isReplacement:",
        isReplacement
      );

      // Create preview
      const previewUrl = URL.createObjectURL(file);
      console.log("ImageUpload: Setting preview URL:", previewUrl);
      setPreview(previewUrl);
      setIsExistingImage(false);

      let uploadedUrl: string | null = null;

      if (isReplacement && currentImageId) {
        // Replace existing image
        uploadedUrl = await replaceImage(currentImageId, file);
        console.log(
          "ImageUpload: Replacement completed, URL received:",
          uploadedUrl
        );
      } else {
        // Upload new image
        uploadedUrl = await uploadImage(file, artworkId);
        console.log(
          "ImageUpload: Upload completed, URL received:",
          uploadedUrl
        );
      }

      if (uploadedUrl) {
        console.log("ImageUpload: Calling onImageUploaded with:", uploadedUrl);
        onImageUploaded(uploadedUrl);
        setIsExistingImage(true);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isReplacement = isExistingImage && !!currentImageId;
      handleFileSelect(file, isReplacement);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const clearImage = () => {
    // Clean up blob URL if it exists
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setIsExistingImage(false);
    onImageUploaded("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDeleteImage = async () => {
    if (currentImageId) {
      const success = await deleteImage(currentImageId);
      if (success) {
        clearImage();
        onImageDeleted?.();
      }
    } else {
      clearImage();
    }
  };

  const handleReplaceImage = () => {
    fileInputRef.current?.click();
  };

  // Clean up blob URLs when component unmounts
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>Artwork Image</Label>

      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-md border"
            crossOrigin="anonymous"
            onError={(e) => {
              console.error("Image failed to load:", preview);
              // Try loading through the API endpoint if direct upload fails
              const target = e.target as HTMLImageElement;
              if (
                preview &&
                preview.includes("/uploads/") &&
                !target.src.includes("/api/images/")
              ) {
                const filename = preview.split("/").pop();
                target.src = `http://localhost:3000/api/images/${filename}`;
              }
            }}
          />
          <div className="absolute top-2 right-2 flex gap-1">
            {isExistingImage && currentImageId && (
              <>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleReplaceImage}
                  disabled={uploading}
                  title="Replace image"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteImage}
                  disabled={uploading}
                  title="Delete image"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
            {!isExistingImage && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={clearImage}
                title="Remove image"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-md p-6 text-center transition-colors ${
            isDragOver
              ? "border-purple-400 bg-purple-50"
              : "border-gray-300 hover:border-purple-400"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="flex flex-col items-center space-y-2">
            <Image className="h-8 w-8 text-gray-400" />
            <div className="text-sm text-gray-600">
              <p>Drag and drop an image here, or</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="mt-2"
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? "Uploading..." : "Choose Image"}
              </Button>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;
