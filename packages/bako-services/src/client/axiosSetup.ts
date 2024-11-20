import type { AxiosInstance, AxiosResponse } from "axios";
import axios from "axios";
import type { ClientSetup, Credentials, LogoutParams } from "./types";

export class AxiosSetup {
  private static instance: AxiosSetup;
  private axiosInstance: AxiosInstance;
  private logout?: (params: LogoutParams) => void;

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

          this.logout?.({
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

  /**
   * Updates the default headers with the provided credentials.
   *
   * @param credentials - An object containing the access token and signer address.
   * @param credentials.accessToken - The access token for authorization.
   * @param credentials.signerAddress - The signer address for identification.
   */
  public setCredentials({ accessToken, signerAddress }: Credentials) {
    this.axiosInstance.defaults.headers.common.authorization = accessToken;
    this.axiosInstance.defaults.headers.common.signerAddress = signerAddress;
  }

  /**
   * Set the logout function to handle 401 errors.
   * @param logout Logout handler function
   */
  public setLogout(logout: (params: LogoutParams) => void) {
    this.logout = logout;
  }
}
