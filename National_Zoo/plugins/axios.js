// plugins/axios.js
import axios from 'axios';
import { checkAndRefreshToken } from '../composables/useAuth';

axios.interceptors.request.use(async (config) => {
  await checkAndRefreshToken(); // Check and refresh token before each request
  const token = useCookie("auth").value;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});