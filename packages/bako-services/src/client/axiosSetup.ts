import type { AxiosInstance, AxiosResponse } from "axios";
import type { ClientSetup, Credentials, LogoutParams } from "./types";

export class AxiosSetup {
  private static instance: AxiosSetup;
  private axiosInstance: AxiosInstance;
  private logout?: (params: LogoutParams) => void;
  private accessToken: string | undefined;
  private signerAddress: string | undefined;

  /**
   * Private constructor to prevent direct instantiation.
   * @param config AxiosRequestConfig with a logout function.
   */
  private constructor(config: ClientSetup, api: AxiosInstance) {
    const { logout, accessToken, signerAddress, ...axiosConfig } = config;

    this.axiosInstance = api;

    this.accessToken = accessToken;
    this.signerAddress = signerAddress;

    this.updateAxiosHeaders();

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
  public static getInstance(
    config: ClientSetup,
    api: AxiosInstance,
  ): AxiosSetup {
    if (!AxiosSetup.instance) {
      AxiosSetup.instance = new AxiosSetup(config, api);
    }
    return AxiosSetup.instance;
  }

  /**
   * Updates the default headers with the provided credentials.
   *
   * @param credentials - An object containing the access token and signer address.
   * @param credentials.accessToken - The access token for authorization.
   * @param credentials.signerAddress - The signer address for identification.
   */
  public setCredentials({ accessToken, signerAddress }: Credentials) {
    this.accessToken = accessToken;
    this.signerAddress = signerAddress;

    this.updateAxiosHeaders();
  }
  /**
   * Set the logout function to handle 401 errors.
   * @param logout Logout handler function
   */
  public setLogout(logout: (params: LogoutParams) => void) {
    this.logout = logout;
  }

  private updateAxiosHeaders() {
    if (this.accessToken && this.signerAddress) {
      this.axiosInstance.defaults.headers["authorization"] = this.accessToken;
      this.axiosInstance.defaults.headers["signerAddress"] = this.signerAddress;
    }
  }
}
