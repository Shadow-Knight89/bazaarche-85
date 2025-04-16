
import axios from 'axios';
import { API_BASE_URL, handleApiError, configureAxiosCSRF } from './base';

// Upload an image to a folder in the backend
export const uploadImage = async (formData: FormData) => {
  try {
    // Make sure CSRF token is set before uploading
    await configureAxiosCSRF();
    
    // Add a timestamp to prevent caching issues
    formData.append('timestamp', Date.now().toString());
    
    const response = await axios.post(`${API_BASE_URL}/upload-image/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true
    });
    
    // Make sure the URL is absolute
    if (response.data && response.data.url) {
      // If the URL is relative, make it absolute
      if (response.data.url.startsWith('/')) {
        const baseUrl = process.env.NODE_ENV === 'production' 
          ? window.location.origin
          : 'http://localhost:8000';
        response.data.url = `${baseUrl}${response.data.url}`;
      }
    }
    
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};
