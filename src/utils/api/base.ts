
import axios from 'axios';
import { toast } from '@/components/ui/use-toast';

// Define API base URL
export const API_BASE_URL = 'http://localhost:8000/api';

// Configure axios with CSRF token
export const configureAxiosCSRF = async () => {
  try {
    // Get CSRF token
    await axios.get(`${API_BASE_URL}/csrf/`, { withCredentials: true });
    return true;
  } catch (error) {
    console.error('Error getting CSRF token:', error);
    return false;
  }
};

// Handle API errors
export const handleApiError = (error: any) => {
  const errorMessage = error?.response?.data?.detail || error?.message || 'An unknown error occurred';
  
  // Don't show toast for authentication errors when loading resources
  // This avoids the annoying "Authentication credentials were not provided" message
  // when just fetching data that doesn't require authentication
  if (
    error?.response?.status === 403 && 
    errorMessage.includes('Authentication credentials were not provided') &&
    (error?.config?.method === 'get' || !error?.config?.method)
  ) {
    console.log('Authentication required for this endpoint, but not showing toast');
    return null;
  }
  
  console.error('API Error:', error);
  
  toast({
    title: 'Error',
    description: errorMessage,
    variant: 'destructive',
  });
  
  throw error;
};
