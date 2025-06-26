import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { Category } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.categories.getAll();
      console.log('🔍 useCategories - API Response:', response);
      // The API returns { data: { categories: [...] } }
      return response.data?.categories as Category[] || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

export const useAddCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (category: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => {
      const response = await api.categories.create(category);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Category created",
        description: "New category has been successfully added.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create category. Please try again.",
        variant: "destructive",
      });
      console.error('Error creating category:', error);
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, category }: { id: string; category: Omit<Category, 'id' | 'created_at' | 'updated_at'> }) => {
      const response = await api.categories.update(id, category);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Category updated",
        description: "Category has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update category. Please try again.",
        variant: "destructive",
      });
      console.error('Error updating category:', error);
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.categories.delete(id);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Category deleted",
        description: "Category has been successfully removed.",
      });
    },
    onError: (error: any) => {
      let errorMessage = "Failed to delete category. Please try again.";
      
      // Extract specific error message from the API response
      if (error?.message) {
        if (error.message.includes("artworks")) {
          errorMessage = "Cannot delete category that contains artworks. Please move or delete the artworks first.";
        } else if (error.message.includes("Category has artworks")) {
          errorMessage = "This category contains artworks. Please move them to another category or delete them first.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Cannot Delete Category",
        description: errorMessage,
        variant: "destructive",
      });
      console.error('Error deleting category:', error);
    },
  });
};
