interface IGenerateRedirectQueryParams {
  sessionId: string | null;
  origin?: string | null;
  name?: string | null;
  request_id?: string | null;
  byConnector?: string | null;
}

enum Encoder {
  FUEL = 'FUEL',
  METAMASK = 'METAMASK',
  WEB_AUTHN = 'WEB_AUTHN',
}

export { Encoder, IGenerateRedirectQueryParams };
