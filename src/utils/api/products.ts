
import axios from 'axios';
import { API_BASE_URL, handleApiError, configureAxiosCSRF } from './base';
import { toast } from '@/components/ui/use-toast';

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
