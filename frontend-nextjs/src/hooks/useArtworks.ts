import { useQuery } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { ArtworkWithCategory } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

interface ArtworkImage {
  url: string;
}

interface Category {
  id: string;
  name: string;
}

export interface ArtworkDetails {
  id: string;
  title?: string;
  name?: string;
  description: string;
  price: number;
  image?: string;
  images?: ArtworkImage[];
  category: Category;
  categoryId?: number;
  medium?: string;
  dimensions?: string;
  createdYear?: string;
  featured?: boolean;
  sold?: boolean;
  isActive?: boolean;
  isFeatured?: boolean;
  viewCount?: number;
  createdAt: string;
  updatedAt?: string;
}

interface UseArtworksOptions {
  categoryId?: string | null;
  featured?: boolean;
  limit?: number;
}

// Fetch all artworks
export const useArtworks = (searchTerm: string = '', options?: UseArtworksOptions) => {
  return useQuery({
    queryKey: ['artworks', searchTerm, options],
    queryFn: async () => {
      // Build query params
      const params = new URLSearchParams();
      
      if (options?.categoryId) {
        params.append('category', options.categoryId);
      }
      
      if (options?.featured) {
        params.append('featured', 'true');
      }
      
      if (options?.limit) {
        params.append('limit', options.limit.toString());
      }
      
      const queryString = params.toString() ? `?${params.toString()}` : '';
      
      const response = await fetch(`/api/artworks${queryString}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch artworks');
      }
      
      return await response.json() as ArtworkDetails[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get a single artwork by ID
export const useArtwork = (id: string) => {
  return useQuery({
    queryKey: ['artwork', id],
    queryFn: async () => {
      if (!id) return null;
      
      const response = await fetch(`/api/artworks/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch artwork');
      }
      
      return await response.json() as ArtworkDetails;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!id, // Only run the query if there's an ID
  });
};

export const useAddArtwork = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (artwork: Partial<ArtworkDetails>) => {
      const response = await api.artworks.create(artwork);
      return response.data as any;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artworks'] });
      toast({
        title: 'Success',
        description: 'Artwork added successfully.',
        variant: 'default',
      });
    },
    onError: (error) => {
      console.error('Error adding artwork:', error);
      toast({
        title: 'Error',
        description: 'Failed to add artwork. Please try again.',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateArtwork = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ArtworkDetails> }) => {
      const response = await api.artworks.update(id, data);
      return response.data as any;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artworks'] });
      toast({
        title: 'Success',
        description: 'Artwork updated successfully.',
        variant: 'default',
      });
    },
    onError: (error) => {
      console.error('Error updating artwork:', error);
      toast({
        title: 'Error',
        description: 'Failed to update artwork. Please try again.',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteArtwork = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.artworks.delete(id);
      return response.data as any;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artworks'] });
      toast({
        title: 'Success',
        description: 'Artwork deleted successfully.',
        variant: 'default',
      });
    },
    onError: (error) => {
      console.error('Error deleting artwork:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete artwork. Please try again.',
        variant: 'destructive',
      });
    },
  });
};
