import axios from 'axios';

const { VITE_API_URL } = import.meta.env;

export const apiConfig = axios.create({
  baseURL: VITE_API_URL,
  timeout: 10 * 1000, // limit to try other requests
});
