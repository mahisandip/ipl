// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.10.102:8080/api',
});

// Add a response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Token invalid or expired
      window.localStorage.removeItem('adminToken'); 
      window.location.href = '/ipl/#/login?expired=true';
    }
    return Promise.reject(error);
  }
);

export default api;
