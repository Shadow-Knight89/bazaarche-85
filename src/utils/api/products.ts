
import axios from 'axios';
import { API_BASE_URL, handleApiError, configureAxiosCSRF } from './base';
import { toast } from '@/components/ui/use-toast';
import { FilterValues } from '@/components/ProductFilters';

interface FetchProductsParams extends FilterValues {
  page?: number;
}

// Fetch all products
export const fetchProducts = async (params?: FetchProductsParams) => {
  try {
    await configureAxiosCSRF();
    
    console.log('Fetching products with params:', params);
    console.log('API_BASE_URL:', API_BASE_URL);
    
    // Prepare query parameters
    const queryParams: any = {};
    
    if (params) {
      if (params.search) queryParams.search = params.search;
      if (params.category) queryParams.category = params.category;
      if (params.page) queryParams.page = params.page;
      
      // Handle sorting
      if (params.sort) {
        const [field, direction] = params.sort.split('_');
        
        if (field === 'name') {
          queryParams.ordering = direction === 'asc' ? 'name' : '-name';
        } else if (field === 'price') {
          queryParams.ordering = direction === 'asc' ? 'discountedPrice' : '-discountedPrice';
        } else if (field === 'newest') {
          queryParams.ordering = '-createdAt';
        }
      }
    }
    
    console.log('Making request to:', `${API_BASE_URL}/products/`, { params: queryParams });
    
    const response = await axios.get(`${API_BASE_URL}/products/`, { 
      params: queryParams,
      withCredentials: true, // Ensure cookies are sent with request
    });
    
    console.log('Products API response:', response.data);
    
    // Ensure we always return an array for results
    return {
      count: response.data.count || 0,
      results: Array.isArray(response.data.results) ? response.data.results : 
               (Array.isArray(response.data) ? response.data : [])
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    // Log more details about the error
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });
    }
    return { count: 0, results: [] };
  }
};

// Fetch a single product by ID
export const fetchProduct = async (id: string) => {
  try {
    await configureAxiosCSRF();
    console.log(`Fetching product with ID: ${id}`);
    const response = await axios.get(`${API_BASE_URL}/products/${id}/`, {
      withCredentials: true,
    });
    console.log('Product API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
    throw error;
  }
};

// Fetch a product by customId
export const fetchProductByCustomId = async (customId: string) => {
  try {
    await configureAxiosCSRF();
    console.log(`Fetching product with customId: ${customId}`);
    
    // First try to search by customId parameter
    const response = await axios.get(`${API_BASE_URL}/products/`, {
      params: { custom_id: customId },
      withCredentials: true,
    });
    
    console.log('Product by customId API response:', response.data);
    
    // If we got results, return the first one
    if (response.data && Array.isArray(response.data.results) && response.data.results.length > 0) {
      return response.data.results[0];
    } else if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      return response.data[0];
    }
    
    // If no results by customId parameter, fetch all products and filter manually
    const allProductsResponse = await fetchProducts();
    const allProducts = allProductsResponse.results;
    
    if (Array.isArray(allProducts)) {
      const product = allProducts.find((p: any) => p.customId === customId);
      if (product) {
        return product;
      }
    }
    
    throw new Error('Product not found');
  } catch (error) {
    console.error('Error fetching product by custom ID:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
    throw error;
  }
};

// Create a product
export const createProduct = async (productData: any) => {
  try {
    // Make sure CSRF token is set before creating product
    await configureAxiosCSRF();
    console.log('Creating product with data:', productData);
    
    const response = await axios.post(`${API_BASE_URL}/products/`, productData, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true
    });
    
    console.log('Create product API response:', response.data);
    
    toast({
      title: "موفق",
      description: "محصول با موفقیت ایجاد شد",
    });
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
    return handleApiError(error);
  }
};

// Update a product
export const updateProduct = async (id: string, productData: any) => {
  try {
    // Make sure CSRF token is set before updating product
    await configureAxiosCSRF();
    console.log(`Updating product ${id} with data:`, productData);
    
    const response = await axios.put(`${API_BASE_URL}/products/${id}/`, productData, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true
    });
    
    console.log('Update product API response:', response.data);
    
    toast({
      title: "موفق",
      description: "محصول با موفقیت به‌روزرسانی شد",
    });
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
    return handleApiError(error);
  }
};

// Remove a product
export const removeProduct = async (id: string | number) => {
  try {
    // Make sure CSRF token is set before removing product
    await configureAxiosCSRF();
    console.log(`Removing product with ID: ${id}`);
    
    const response = await axios.delete(`${API_BASE_URL}/products/${id}/`, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true
    });
    
    console.log('Remove product API response:', response.data);
    
    toast({
      title: "موفق",
      description: "محصول با موفقیت حذف شد",
    });
    return response.data;
  } catch (error) {
    console.error('Error removing product:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
    return handleApiError(error);
  }
};
