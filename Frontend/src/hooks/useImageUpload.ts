import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadImage = async (file: File, artworkId?: string): Promise<string | null> => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return null;
    }

    console.log('useImageUpload: Starting upload for file:', file.name, 'artworkId:', artworkId);
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      // Add artworkId if provided (for existing artworks)
      if (artworkId && artworkId !== 'temp') {
        formData.append('artworkId', artworkId);
      }

      // Get authentication token
      const adminToken = localStorage.getItem('adminToken');
      const userToken = localStorage.getItem('userToken');
      const token = adminToken || userToken;
      
      console.log('useImageUpload: Token found:', !!token, 'artworkId:', artworkId);

      const response = await fetch('http://localhost:3000/api/upload/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      console.log('useImageUpload: Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('useImageUpload: Upload failed:', errorData);
        throw new Error(errorData.message || `Upload failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('useImageUpload: Upload response:', result);

      toast({
        title: "Success",
        description: "Image uploaded successfully!",
      });

      // Return the relative URL (backend now stores images in database)
      const imageUrl = result.data.url;
      console.log('useImageUpload: Returning image URL:', imageUrl);
      return imageUrl;
    } catch (error) {
      console.error('useImageUpload: Error uploading image:', error);
      toast({
        title: "Upload Error",
        description: error instanceof Error ? error.message : "Failed to upload image. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (imageId: string): Promise<boolean> => {
    console.log('useImageUpload: Deleting image:', imageId);
    setUploading(true);
    
    try {
      const adminToken = localStorage.getItem('adminToken');
      const userToken = localStorage.getItem('userToken');
      const token = adminToken || userToken;

      const response = await fetch(`http://localhost:3000/api/upload/image/${imageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Delete failed: ${response.status}`);
      }

      toast({
        title: "Success",
        description: "Image deleted successfully!",
      });

      return true;
    } catch (error) {
      console.error('useImageUpload: Error deleting image:', error);
      toast({
        title: "Delete Error",
        description: error instanceof Error ? error.message : "Failed to delete image. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setUploading(false);
    }
  };

  const replaceImage = async (imageId: string, file: File): Promise<string | null> => {
    console.log('useImageUpload: Replacing image:', imageId, 'with:', file.name);
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('image', file);

      const adminToken = localStorage.getItem('adminToken');
      const userToken = localStorage.getItem('userToken');
      const token = adminToken || userToken;

      const response = await fetch(`http://localhost:3000/api/upload/image/${imageId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Replace failed: ${response.status}`);
      }

      const result = await response.json();

      toast({
        title: "Success",
        description: "Image replaced successfully!",
      });

      return result.data.url;
    } catch (error) {
      console.error('useImageUpload: Error replacing image:', error);
      toast({
        title: "Replace Error",
        description: error instanceof Error ? error.message : "Failed to replace image. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadImage, deleteImage, replaceImage, uploading };
};
