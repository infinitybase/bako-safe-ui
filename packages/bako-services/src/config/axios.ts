import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

interface AxiosSetupOptions {
  baseURL: string;
  onRedirect?: (url: string) => void;
  onError?: (error: AxiosError) => void;
  onRequestSuccess?: (response: AxiosResponse) => void;
  onRequestError?: (error: AxiosError) => void;
}

export const createAxiosInstance = (
  options: AxiosSetupOptions,
): AxiosInstance => {
  const { baseURL, onRedirect, onError, onRequestSuccess, onRequestError } =
    options;

  const instance = axios.create({
    baseURL,
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config) => config,
    (error) => {
      if (onRequestError) onRequestError(error);
      return Promise.reject(error);
    },
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => {
      if (onRequestSuccess) onRequestSuccess(response);

      // Example of a redirect condition based on response
      if (response.status === 302 && onRedirect && response.headers.location) {
        onRedirect(response.headers.location);
      }
      return response;
    },
    (error) => {
      if (
        error.response &&
        error.response.status === 302 &&
        onRedirect &&
        error.response.headers.location
      ) {
        // Handle redirects on error (if needed)
        onRedirect(error.response.headers.location);
      } else if (onError) {
        onError(error);
      }
      return Promise.reject(error);
    },
  );

  return instance;
};
