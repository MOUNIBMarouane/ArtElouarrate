import { useState } from "react";
import { AlertCircle, ImageIcon, RefreshCw } from "lucide-react";

interface ImageWithFallbackPublicProps {
  src: string;
  alt: string;
  className?: string;
}

const ImageWithFallbackPublic = ({
  src,
  alt,
  className = "",
}: ImageWithFallbackPublicProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    console.error("Image failed to load:", src);
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
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

  // If image failed to load, show fallback
  return (
    <div
      className={`${className} bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center relative group`}
    >
      <div className="text-center p-4">
        <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600 font-medium mb-2">
          Image indisponible
        </p>
        <p className="text-xs text-gray-500 mb-3">
          L'image ne peut pas être chargée pour le moment
        </p>

        <button
          onClick={handleRetryLoad}
          className="inline-flex items-center px-3 py-1 text-xs bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Réessayer
        </button>
      </div>
    </div>
  );
};

export default ImageWithFallbackPublic;
