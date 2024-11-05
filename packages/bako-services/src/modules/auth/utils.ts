interface IGenerateRedirectQueryParams {
  sessionId: string | null;
  origin?: string | null;
  name?: string | null;
  request_id?: string | null;
  byConnector?: string | null;
}

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

export { generateRedirectQueryParams };
