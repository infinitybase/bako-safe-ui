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
