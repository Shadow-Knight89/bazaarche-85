import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api'; // Adjust if necessary

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