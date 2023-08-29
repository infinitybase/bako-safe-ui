import axios from 'axios';

const { VITE_TOKEN_API, VITE_API_URL } = import.meta.env;

const api = axios.create({
  baseURL: VITE_API_URL,
});

api.interceptors.request.use(
  (value) => {
    value.headers['authorization'] = VITE_TOKEN_API;
    return value;
  },
  (error) => error,
);

export { api };
