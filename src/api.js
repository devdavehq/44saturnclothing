import axios from 'axios';

// Create an Axios instance with default settings
const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}`, // Set your base URL here
  // withCredentials: true,
});

// Generic API request function
const apiRequest = async (method, url, data = {}, headers = {}) => {
  let responseData = {
    data: null,
    error: null,
    isLoading: true,
  };

  // Set custom headers if provided
  if (headers) {
    Object.keys(headers).forEach((key) => {
      apiClient.defaults.headers.common[key] = headers[key];
    });
  }

  try {
    const response = await apiClient({
      method,
      url,
      data,
    });
    responseData.data = response.data;
  } catch (error) {
    responseData.error = error.response ? error.response.data : error.message;
  } finally {
    responseData.isLoading = false;
  }

  // Reset headers to avoid affecting future requests
  if (headers) {
    Object.keys(headers).forEach((key) => {
      delete apiClient.defaults.headers.common[key];
    });
  }

  return responseData;
};

// Exported functions for different HTTP methods
export const get = (url, headers = {}) => apiRequest('get', url, {}, headers);
export const post = (url, data = {}, headers = {}) => apiRequest('post', url, data, headers);
export const put = (url, data = {}, headers = {}) => apiRequest('put', url, data, headers);
export const del = (url, headers = {}) => apiRequest('delete', url, {}, headers);