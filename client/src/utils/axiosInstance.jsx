import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000',
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  config.headers['Cache-Control'] = 'no-cache';
  config.headers['Pragma'] = 'no-cache';
  config.headers['Expires'] = '0';

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default instance;
