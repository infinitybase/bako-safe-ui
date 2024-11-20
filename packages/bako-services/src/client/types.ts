import type { AxiosRequestConfig } from "axios";

export enum ApiUnauthorizedErrorsTitles {
  MISSING_CREDENTIALS = "Missing credentials",
  SESSION_NOT_FOUND = "Session not found",
  INVALID_ADDRESS = "Invalid address",
  EXPIRED_TOKEN = "Expired token",
}

export type IApiErrorTypes =
  | "CreateException"
  | "UpdateException"
  | "DeleteException"
  | "NotFound"
  | "Unauthorized"
  | "Internal";

export interface IApiError {
  type: IApiErrorTypes;
  title: string | ApiUnauthorizedErrorsTitles;
  detail: string;
}

export type LogoutParams = {
  status: number;
  reason: string;
  endpoint: string;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  headers: any;
};

export type Credentials = {
  signerAddress: string;
  accessToken: string;
};

export interface ClientSetup extends AxiosRequestConfig {
  logout?: (params?: LogoutParams) => void;
  signerAddress?: string;
  accessToken?: string;
}
