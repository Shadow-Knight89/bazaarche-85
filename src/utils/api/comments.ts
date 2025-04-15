
import axios from 'axios';
import { API_BASE_URL, handleApiError, configureAxiosCSRF } from './base';
import { toast } from '@/components/ui/use-toast';

// Fetch comments for a product
export const fetchComments = async (productId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/comments/?product=${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    return []; // Return empty array instead of throwing error
  }
};

// Post a comment
export const postComment = async (commentData: any) => {
  try {
    await configureAxiosCSRF();
    const response = await axios.post(`${API_BASE_URL}/comments/`, commentData);
    toast({
      title: "Success",
      description: "Comment posted successfully",
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};
