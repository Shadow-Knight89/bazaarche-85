
import axios from 'axios';
import { API_BASE_URL, handleApiError, configureAxiosCSRF } from './base';

// Upload an image
export const uploadImage = async (formData: FormData) => {
  try {
    await configureAxiosCSRF();
    const response = await axios.post(`${API_BASE_URL}/upload-image/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};
