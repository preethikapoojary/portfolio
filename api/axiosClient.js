import axios from 'axios';

const axiosClient = axios.create({
  baseURL: '/api',
  timeout: 15000,
});

export default axiosClient;
