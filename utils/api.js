import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  timeout: 10000, 
});
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {

    return response;
  },
  (error) => {
    if (error.response) {
      console.error('Response error:', error.response.data);
      if (error.response.status === 401) {
        console.warn('Unauthorized! Redirecting to login...');
        localStorage.removeItem('token'); 
        window.location.href = '/login'; 
      }
    } else if (error.request) {
      
      console.error('No response received:', error.request);
    } else {
     
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;