
import axios from 'axios';
import { API_BASE_URL, handleApiError, configureAxiosCSRF } from './base';
import { toast } from '@/components/ui/use-toast';

// Fetch all products
export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Fetch a single product by ID
export const fetchProduct = async (id: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

// Fetch a product by customId
export const fetchProductByCustomId = async (customId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/custom/${customId}/`);
    if (response.data) {
      return response.data;
    }
    throw new Error('Product not found');
  } catch (error) {
    console.error('Error fetching product by custom ID:', error);
    throw error;
  }
};

// Create a product
export const createProduct = async (productData: any) => {
  try {
    // Make sure CSRF token is set before creating product
    const csrfConfigured = await configureAxiosCSRF();
    if (!csrfConfigured) {
      throw new Error('Could not configure CSRF token');
    }
    
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
    // Make sure CSRF token is set before updating product
    const csrfConfigured = await configureAxiosCSRF();
    if (!csrfConfigured) {
      throw new Error('Could not configure CSRF token');
    }
    
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
    // Make sure CSRF token is set before removing product
    const csrfConfigured = await configureAxiosCSRF();
    if (!csrfConfigured) {
      throw new Error('Could not configure CSRF token');
    }
    
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
