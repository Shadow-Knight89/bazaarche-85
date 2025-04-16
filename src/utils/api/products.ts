
import axios from 'axios';
import { API_BASE_URL, handleApiError, configureAxiosCSRF } from './base';
import { toast } from '@/components/ui/use-toast';

// Fetch all products
export const fetchProducts = async () => {
  try {
    await configureAxiosCSRF();
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
    await configureAxiosCSRF();
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
    await configureAxiosCSRF();
    
    // First try to search by customId parameter
    const response = await axios.get(`${API_BASE_URL}/products/`, {
      params: { custom_id: customId }
    });
    
    // If we got results, return the first one
    if (response.data && response.data.length > 0) {
      return response.data[0];
    }
    
    // If no results by customId parameter, fetch all products and filter manually
    const allProducts = await fetchProducts();
    const product = allProducts.find((p: any) => p.customId === customId);
    
    if (product) {
      return product;
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
    await configureAxiosCSRF();
    
    const response = await axios.post(`${API_BASE_URL}/products/`, productData, {
      withCredentials: true
    });
    
    toast({
      title: "موفق",
      description: "محصول با موفقیت ایجاد شد",
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
    await configureAxiosCSRF();
    
    const response = await axios.put(`${API_BASE_URL}/products/${id}/`, productData, {
      withCredentials: true
    });
    
    toast({
      title: "موفق",
      description: "محصول با موفقیت به‌روزرسانی شد",
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
    await configureAxiosCSRF();
    
    const response = await axios.delete(`${API_BASE_URL}/products/${id}/`, {
      withCredentials: true
    });
    
    toast({
      title: "موفق",
      description: "محصول با موفقیت حذف شد",
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};
