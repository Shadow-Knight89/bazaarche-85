
import axios from 'axios';
import { toast } from '@/components/ui/use-toast';

// Django backend URL - make sure this matches your Django server's address
export const API_BASE_URL = 'http://localhost:8000/api'; 

// Configure axios to include credentials for handling sessions
axios.defaults.withCredentials = true;

// API error handler
export const handleApiError = (error: any) => {
  console.error('API Error:', error);
  
  let errorMessage = 'An error occurred';
  if (error.response) {
    errorMessage = error.response.data?.detail || 
                  (typeof error.response.data === 'string' ? error.response.data : 'Server error');
    
    // Check for validation errors (usually as an object)
    if (typeof error.response.data === 'object' && !error.response.data.detail) {
      errorMessage = Object.entries(error.response.data)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
    }
  } else if (error.request) {
    errorMessage = 'No response from server';
  } else {
    errorMessage = error.message;
  }
  
  toast({
    title: 'Error',
    description: errorMessage,
    variant: "destructive",
  });
  
  return Promise.reject(error);
};

// Get CSRF token handling for Django
export const getCSRFToken = async () => {
  try {
    await axios.get(`${API_BASE_URL}/csrf/`);
    return document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    return null;
  }
};

// Configure axios to include the CSRF token in requests
export const configureAxiosCSRF = async () => {
  const csrfToken = await getCSRFToken();
  if (csrfToken) {
    axios.defaults.headers.common['X-CSRFToken'] = csrfToken;
  }
};
