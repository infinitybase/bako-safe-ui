// import { CookieName, CookiesConfig } from "@/config/cookies";

interface IGenerateRedirectQueryParams {
  sessionId: string | null;
  origin?: string | null;
  name?: string | null;
  request_id?: string | null;
  byConnector?: string | null;
}

// const authCredentials = () => ({
//   token: CookiesConfig.getCookie(CookieName.ACCESS_TOKEN),
//   address: CookiesConfig.getCookie(CookieName.ADDRESS),
// });

// const authCredentialsByKey = (key: "token" | "address") => {
//   const credentials = authCredentials();
//   const hasCredential = key in credentials;

//   if (!hasCredential) {
//     throw new Error("Key not found in credentials");
//   }

//   return credentials[key];
// };

const generateRedirectQueryParams = ({
  sessionId,
  origin,
  name,
  request_id,
  byConnector,
}: IGenerateRedirectQueryParams) => {
  const queryParams = [
    sessionId && `sessionId=${sessionId}`,
    origin && `origin=${origin}`,
    name && `name=${name}`,
    request_id && `request_id=${request_id}`,
    byConnector && `byConnector=${byConnector}`,
  ]
    .filter(Boolean)
    .join("&");

  return queryParams ? `?${queryParams}` : "";
};

export const localStorageKeys = {
  HARDWARE_ID: "bakosafe/hardwareId",
  WEB_AUTHN_LAST_LOGIN_USERNAME: "bakosafe/web-authn-last-login-username",
  NETWORKS: "bakosafe/networks/list",
  SELECTED_CHAIN_ID: "bakosafe/selected-chain-id",
  SELECTED_NETWORK: "bakosafe/selected-network",
};

export {
  //  authCredentials,
  // authCredentialsByKey,
  generateRedirectQueryParams,
};
