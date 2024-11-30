import axios, { AxiosHeaders } from 'axios';

let authToken: string | null = null; // Initialize to null to avoid SSR issues

// Create an Axios instance
export const apiClient = axios.create({
  baseURL: process.env.AUTH_API_URL, // Ensure this is set correctly in your .env
  headers: {
    'Content-Type': 'application/json',
  },
});

// Set the token and update Axios defaults
export function setToken(token: string) {
  authToken = token; // Update the local variable
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token); // Update in localStorage
  }
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Set default Authorization header
}

// Clear the token and remove it from Axios defaults
export function clearToken() {
  authToken = null; // Clear the local variable
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken'); // Remove from localStorage
  }
  delete apiClient.defaults.headers.common['Authorization']; // Remove default Authorization header
}

// Add a request interceptor to ensure the token is always applied
apiClient.interceptors.request.use(
  (config) => {
    if (!config.headers) {
      config.headers = new AxiosHeaders(); // Initialize headers if undefined
    }

    // Add Authorization header if token exists
    if (authToken) {
      config.headers['Authorization'] = `Bearer ${authToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Load the token from localStorage on the client-side
if (typeof window !== 'undefined') {
  const tokenFromStorage = localStorage.getItem('authToken');
  if (tokenFromStorage) {
    setToken(tokenFromStorage); // Load and set the token during client-side rendering
  }
}
