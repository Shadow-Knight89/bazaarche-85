
import axios from 'axios';
import { API_BASE_URL, handleApiError, configureAxiosCSRF } from './base';
import { toast } from '@/components/ui/use-toast';

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
