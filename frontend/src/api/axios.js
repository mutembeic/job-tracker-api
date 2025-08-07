import axios from 'axios';

// 1. Get the base URL from environment variables.
//    import.meta.env.VITE_API_BASE_URL is how Vite exposes .env variables.
//    If the variable is not defined, it will fall back to your local server URL.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

// 2. Create the Axios instance with the base URL.
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

//Use an interceptor to dynamically add the Authorization header to every request.
api.interceptors.request.use(
  (config) => {
    // Get the token from localStorage right before the request is sent.
    const token = localStorage.getItem('access_token');
    
    // If a token exists, add it to the request headers.
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// 4. Export the configured instance.
export default api;
