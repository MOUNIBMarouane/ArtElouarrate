export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  sortOrder?: number;
  isActive?: boolean;
  artworkCount?: number;
  artworks?: Artwork[];
  createdAt?: string;
  updatedAt?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ArtworkImage {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  isPrimary: boolean;
  artworkId: string;
  createdAt: string;
}

export interface Artwork {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  categoryId: string;
  image?: string;
  images?: ArtworkImage[];
  description: string;
  medium: string;
  dimensions: string;
  year: number;
  status: 'AVAILABLE' | 'SOLD' | 'RESERVED';
  isFeatured?: boolean;
  isActive?: boolean;
  viewCount?: number;
  createdAt?: string;
  updatedAt?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ArtworkWithCategory extends Artwork {
  category?: Category;
}

// Backend API response types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
