
import axios from 'axios';
import { API_BASE_URL, handleApiError, configureAxiosCSRF } from './base';
import { toast } from '@/components/ui/use-toast';

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
