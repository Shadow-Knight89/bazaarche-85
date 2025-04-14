
import axios from 'axios';

// Django backend URL - adjust this to your Django server's address
const API_BASE_URL = 'http://localhost:8000/api'; 

// Configure axios to include credentials for handling sessions
axios.defaults.withCredentials = true;

export const fetchProducts = async () => {
    const response = await axios.get(`${API_BASE_URL}/products/`);
    return response.data;
};

export const fetchComments = async (productId: string) => {
    const response = await axios.get(`${API_BASE_URL}/comments/?product=${productId}`);
    return response.data;
};

export const postComment = async (commentData: any) => {
    const response = await axios.post(`${API_BASE_URL}/comments/`, commentData);
    return response.data;
};

// Add CSRF token handling for Django
export const getCSRFToken = async () => {
    // Get the CSRF token from Django
    await axios.get(`${API_BASE_URL}/csrf/`);
    // Return the CSRF token from cookies
    return document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];
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
    const response = await axios.post(`${API_BASE_URL}/auth/login/`, { username, password });
    return response.data;
};

export const logoutUser = async () => {
    const response = await axios.post(`${API_BASE_URL}/auth/logout/`);
    return response.data;
};

export const registerUser = async (userData: any) => {
    const response = await axios.post(`${API_BASE_URL}/auth/register/`, userData);
    return response.data;
};
