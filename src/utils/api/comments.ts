
import axios from 'axios';
import { API_BASE_URL, handleApiError, configureAxiosCSRF } from './base';
import { toast } from '@/components/ui/use-toast';

// Cache for comments to prevent redundant API calls
const commentsCache = new Map<string, { data: any, timestamp: number }>();
const CACHE_EXPIRY_TIME = 30000; // 30 seconds

// Fetch comments for a product
export const fetchComments = async (productId: string) => {
  try {
    // Check cache first
    const now = Date.now();
    const cachedData = commentsCache.get(productId);
    
    if (cachedData && (now - cachedData.timestamp < CACHE_EXPIRY_TIME)) {
      console.log('Using cached comments for product:', productId);
      return cachedData.data;
    }
    
    console.log('Fetching fresh comments for product:', productId);
    const response = await axios.get(`${API_BASE_URL}/comments/?product=${productId}`);
    
    // Update cache
    commentsCache.set(productId, {
      data: response.data,
      timestamp: now
    });
    
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
    
    // Invalidate cache for this product
    if (commentData.product) {
      commentsCache.delete(commentData.product.toString());
    }
    
    toast({
      title: "Success",
      description: "Comment posted successfully",
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};
