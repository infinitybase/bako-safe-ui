import type { AxiosInstance, AxiosResponse } from "axios";
import axios from "axios";
import type { ClientSetup } from "./types";

export class AxiosSetup {
  private static instance: AxiosSetup;
  private axiosInstance: AxiosInstance;

  /**
   * Private constructor to prevent direct instantiation.
   * @param config AxiosRequestConfig with a logout function.
   */
  private constructor(config: ClientSetup) {
    const { logout, accessToken, signerAddress, ...axiosConfig } = config;

    this.axiosInstance = axios.create(axiosConfig);
    this.axiosInstance.defaults.headers.common.authorization = accessToken;
    this.axiosInstance.defaults.headers.common.signerAddress = signerAddress;

    // Response interceptor to handle errors
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        if (error.response?.status === 401) {
          console.warn("Unauthorized access detected. Triggering logout.");

          const reason = error.response?.data?.message || "Unauthorized access";
          const endpoint = error.config.url || "Unknown endpoint";
          const headers = error.config.headers;

          logout?.({
            status: 401,
            reason,
            endpoint,
            headers,
          });
        }
        return Promise.reject(error);
      },
    );
  }

  /**
   * Static method to get or create the singleton instance.
   * @param config AxiosRequestConfig with a logout function.
   * @returns Singleton instance of AxiosSetup.
   */
  public static getInstance(config: ClientSetup): AxiosInstance {
    if (!AxiosSetup.instance) {
      AxiosSetup.instance = new AxiosSetup(config);
    }
    return AxiosSetup.instance.axiosInstance;
  }
}
