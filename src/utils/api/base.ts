
import axios from 'axios';
import { toast } from '@/components/ui/use-toast';

export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:8000/api';

// Flag to track if we've already configured CSRF
let csrfConfigured = false;

// Configure axios for CSRF protection
export const configureAxiosCSRF = async () => {
  try {
    console.log('Configuring CSRF protection, current status:', { csrfConfigured });
    
    if (!csrfConfigured) {
      // Enable sending cookies with cross-domain requests
      axios.defaults.withCredentials = true;
      
      console.log('Requesting CSRF token from:', `${API_BASE_URL}/csrf/`);
      
      // Get CSRF token from server and set in cookies
      const response = await axios.get(`${API_BASE_URL}/csrf/`);
      console.log('CSRF token response:', response.data);
      
      csrfConfigured = true;
    }
    return true;
  } catch (error) {
    console.error('Error configuring CSRF:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
    return false;
  }
};

// Handle API errors with consistent error messages
export const handleApiError = (error: any) => {
  console.error('API Error:', error);
  
  let errorMessage = 'خطایی رخ داد. لطفا دوباره تلاش کنید.';
  let suppressMessage = false;
  
  if (error?.response?.data?.detail) {
    errorMessage = error.response.data.detail;
    
    // Don't show the "Authentication credentials were not provided" message to users
    if (errorMessage === "Authentication credentials were not provided." || 
        errorMessage === "Authentication credentials were not provided") {
      console.warn("Authentication error - suppressed from UI");
      suppressMessage = true;
    }
  } else if (error?.message) {
    errorMessage = error.message;
  }
  
  if (!suppressMessage) {
    toast({
      title: "خطا",
      description: errorMessage,
      variant: "destructive",
    });
  }
  
  return Promise.reject(error);
};
