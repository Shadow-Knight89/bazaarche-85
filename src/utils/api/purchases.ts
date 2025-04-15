
import axios from 'axios';
import { API_BASE_URL, handleApiError, configureAxiosCSRF } from './base';
import { toast } from '@/components/ui/use-toast';

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
