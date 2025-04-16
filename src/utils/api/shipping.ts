
import axios from 'axios';
import { API_BASE_URL, handleApiError, configureAxiosCSRF } from './base';
import { toast } from '@/components/ui/use-toast';

// Fetch shipping addresses
export const fetchShippingAddresses = async () => {
  try {
    await configureAxiosCSRF();
    const response = await axios.get(`${API_BASE_URL}/shipping-addresses/`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Get a specific shipping address
export const fetchShippingAddress = async (id: string) => {
  try {
    await configureAxiosCSRF();
    const response = await axios.get(`${API_BASE_URL}/shipping-addresses/${id}/`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Create a new shipping address
export const createShippingAddress = async (addressData: any) => {
  try {
    await configureAxiosCSRF();
    const response = await axios.post(`${API_BASE_URL}/shipping-addresses/`, addressData);
    toast({
      title: "موفق",
      description: "آدرس با موفقیت اضافه شد",
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Update shipping address
export const updateShippingAddress = async (id: string, addressData: any) => {
  try {
    await configureAxiosCSRF();
    const response = await axios.put(`${API_BASE_URL}/shipping-addresses/${id}/`, addressData);
    toast({
      title: "موفق",
      description: "آدرس با موفقیت به‌روزرسانی شد",
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Delete shipping address
export const deleteShippingAddress = async (id: string) => {
  try {
    await configureAxiosCSRF();
    const response = await axios.delete(`${API_BASE_URL}/shipping-addresses/${id}/`);
    toast({
      title: "موفق",
      description: "آدرس با موفقیت حذف شد",
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Set default shipping address
export const setDefaultShippingAddress = async (id: string) => {
  try {
    await configureAxiosCSRF();
    const response = await axios.post(`${API_BASE_URL}/shipping-addresses/${id}/set-default/`);
    toast({
      title: "موفق",
      description: "آدرس پیش‌فرض تغییر کرد",
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};
