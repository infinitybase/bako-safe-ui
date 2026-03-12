import { CookieName, CookiesConfig } from '@/config/cookies';

interface IGenerateRedirectQueryParams {
  sessionId: string | null;
  origin?: string | null;
  name?: string | null;
  request_id?: string | null;
  byConnector?: string | null;
  connectorType?: string | null;
}

const authCredentials = () => ({
  token: CookiesConfig.getCookie(CookieName.ACCESS_TOKEN),
  address: CookiesConfig.getCookie(CookieName.ADDRESS),
});

const authCredentialsByKey = (key: 'token' | 'address') => {
  const credentials = authCredentials();
  const hasCredential = key in credentials;

  if (!hasCredential) {
    throw new Error('Key not found in credentials');
  }

  return credentials[key];
};

const generateRedirectQueryParams = ({
  sessionId,
  origin,
  name,
  request_id,
  byConnector,
  connectorType,
}: IGenerateRedirectQueryParams) => {
  const queryParams = [
    sessionId && `sessionId=${sessionId}`,
    origin && `origin=${origin}`,
    name && `name=${name}`,
    request_id && `request_id=${request_id}`,
    byConnector && `byConnector=${byConnector}`,
    connectorType && `connector_type=${connectorType}`,
  ]
    .filter(Boolean)
    .join('&');

  return queryParams ? `?${queryParams}` : '';
};

export { authCredentials, authCredentialsByKey, generateRedirectQueryParams };
