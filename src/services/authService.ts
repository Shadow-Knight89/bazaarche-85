
import { 
  loginUser as apiLoginUser, 
  logoutUser as apiLogoutUser, 
  registerUser as apiRegisterUser 
} from "../utils/api";
import { configureAxiosCSRF } from "../utils/api/base";
import { User, SecurityQuestion } from "../types";

/**
 * Service for handling authentication-related operations
 */
export const authService = {
  /**
   * Login a user with username and password
   */
  login: async (username: string, password: string): Promise<User | null> => {
    try {
      // Configure CSRF token before making login request
      await configureAxiosCSRF();
      
      const userData = await apiLoginUser(username, password);
      
      if (userData) {
        return {
          id: userData.id.toString(),
          username: userData.username,
          password: '',
          isAdmin: username === 'admin',
          canComment: true
        };
      }
      
      return null;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  /**
   * Register a new user
   */
  register: async (username: string, password: string, securityQuestion: SecurityQuestion): Promise<User | null> => {
    try {
      const userData = await apiRegisterUser({
        username,
        password,
      });
      
      if (userData) {
        return {
          id: userData.id.toString(),
          username: userData.username,
          password: '',
          isAdmin: false,
          securityQuestion,
          canComment: true
        };
      }
      
      return null;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },
  
  /**
   * Logout the current user
   */
  logout: async (): Promise<void> => {
    try {
      // Configure CSRF token before making logout request
      await configureAxiosCSRF();
      await apiLogoutUser();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
};
