import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // adjust as needed
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // or wherever you store it
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;