import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { Artwork } from '@/lib/api';
import { ArtworkWithCategory } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

export const useArtworks = (searchTerm?: string) => {
  return useQuery({
    queryKey: ['artworks', searchTerm],
    queryFn: async () => {
      const response = await api.artworks.getAll(searchTerm);
      console.log('🔍 useArtworks - API Response:', response);
      // The API returns { data: { artworks: [...] } }
      return response.data?.artworks as ArtworkWithCategory[] || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

export const useAddArtwork = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (artwork: Omit<Artwork, 'id' | 'created_at' | 'updated_at'>) => {
      const response = await api.artworks.create(artwork);
      console.log('🔍 useAddArtwork - API Response:', response);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artworks'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Artwork created",
        description: "New artwork has been successfully added.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create artwork. Please try again.",
        variant: "destructive",
      });
      console.error('Error creating artwork:', error);
    },
  });
};

export const useUpdateArtwork = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, artwork }: { id: string; artwork: any }) => {
      console.log('🔍 useUpdateArtwork - Updating artwork:', { id, artwork });
      const response = await api.artworks.update(id, artwork);
      console.log('🔍 useUpdateArtwork - API Response:', response);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artworks'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Artwork updated",
        description: "Artwork has been successfully updated.",
      });
    },
    onError: (error: any) => {
      console.error('❌ Error updating artwork:', error);
      
      let errorMessage = "Failed to update artwork. Please try again.";
      
      if (error?.response?.status === 404) {
        errorMessage = "Artwork not found. It may have been deleted.";
      } else if (error?.response?.status === 400) {
        errorMessage = "Invalid artwork data. Please check all fields.";
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteArtwork = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.artworks.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artworks'] });
      toast({
        title: "Artwork deleted",
        description: "Artwork has been successfully removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete artwork. Please try again.",
        variant: "destructive",
      });
      console.error('Error deleting artwork:', error);
    },
  });
};
