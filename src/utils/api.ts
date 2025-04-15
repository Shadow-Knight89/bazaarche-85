import axios from 'axios';
import { toast } from '@/components/ui/use-toast';

// Django backend URL - adjust this to your Django server's address
const API_BASE_URL = 'http://localhost:8000/api'; 

// Configure axios to include credentials for handling sessions
axios.defaults.withCredentials = true;

// API error handler
const handleApiError = (error: any) => {
  console.error('API Error:', error);
  
  let errorMessage = 'An error occurred';
  if (error.response) {
    errorMessage = error.response.data?.detail || 
                  (typeof error.response.data === 'string' ? error.response.data : 'Server error');
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

// Fetch all products
export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Fetch a single product
export const fetchProduct = async (id: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

// Create a product
export const createProduct = async (productData: any) => {
  try {
    await configureAxiosCSRF();
	const response = await axios.get(`${API_BASE_URL}/products/`);
    console.log(response.data); // Check if IDs are unique
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Update a product
export const updateProduct = async (id: string, productData: any) => {
  try {
    await configureAxiosCSRF();
    const response = await axios.put(`${API_BASE_URL}/products/${id}/`, productData);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Remove a product
export const removeProduct = async (productId: number) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/products/${productId}/`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Fetch all categories
export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Create a category
export const createCategory = async (categoryData: any) => {
  try {
    await configureAxiosCSRF();
    const response = await axios.post(`${API_BASE_URL}/categories/`, categoryData);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Update a category
export const updateCategory = async (id: string, categoryData: any) => {
  try {
    await configureAxiosCSRF();
    const response = await axios.put(`${API_BASE_URL}/categories/${id}/`, categoryData);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Delete a category
export const deleteCategory = async (id: string) => {
  try {
    await configureAxiosCSRF();
    const response = await axios.delete(`${API_BASE_URL}/categories/${id}/`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

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
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

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

// Authentication endpoints
export const loginUser = async (username: string, password: string) => {
  try {
    await configureAxiosCSRF();
    const response = await axios.post(`${API_BASE_URL}/auth/login/`, { username, password });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const logoutUser = async () => {
  try {
    await configureAxiosCSRF();
    const response = await axios.post(`${API_BASE_URL}/auth/logout/`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const registerUser = async (userData: any) => {
  try {
    await configureAxiosCSRF();
    const response = await axios.post(`${API_BASE_URL}/auth/register/`, userData);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

