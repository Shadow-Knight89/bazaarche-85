
import axios from 'axios';
import { toast } from '@/components/ui/use-toast';

// Django backend URL - make sure this matches your Django server's address
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

// Fetch all products
export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Fetch a single product
export const fetchProduct = async (id: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/${id}/`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Create a product
export const createProduct = async (productData: any) => {
  try {
    await configureAxiosCSRF();
    const response = await axios.post(`${API_BASE_URL}/products/`, productData);
    toast({
      title: "Success",
      description: "Product created successfully",
    });
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
    toast({
      title: "Success",
      description: "Product updated successfully",
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Remove a product
export const removeProduct = async (id: string | number) => {
  try {
    await configureAxiosCSRF();
    const response = await axios.delete(`${API_BASE_URL}/products/${id}/`);
    toast({
      title: "Success",
      description: "Product removed successfully",
    });
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
    return handleApiError(error);
  }
};

// Create a category
export const createCategory = async (categoryData: any) => {
  try {
    await configureAxiosCSRF();
    const response = await axios.post(`${API_BASE_URL}/categories/`, categoryData);
    toast({
      title: "Success",
      description: "Category created successfully",
    });
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
    toast({
      title: "Success",
      description: "Category updated successfully",
    });
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
    toast({
      title: "Success",
      description: "Category deleted successfully",
    });
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
    toast({
      title: "Success",
      description: "Comment posted successfully",
    });
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
    toast({
      title: "Success",
      description: "Logged in successfully",
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const logoutUser = async () => {
  try {
    await configureAxiosCSRF();
    const response = await axios.post(`${API_BASE_URL}/auth/logout/`);
    toast({
      title: "Success",
      description: "Logged out successfully",
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const registerUser = async (userData: any) => {
  try {
    await configureAxiosCSRF();
    const response = await axios.post(`${API_BASE_URL}/auth/register/`, userData);
    toast({
      title: "Success",
      description: "Registration successful",
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Fetch all purchases
export const fetchPurchases = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/purchases/`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Create a new purchase
export const createPurchase = async (purchaseData: any) => {
  try {
    await configureAxiosCSRF();
    const response = await axios.post(`${API_BASE_URL}/purchases/`, purchaseData);
    toast({
      title: "Success",
      description: "Purchase completed successfully",
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Get purchase details
export const fetchPurchaseDetails = async (id: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/purchases/${id}/`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};
