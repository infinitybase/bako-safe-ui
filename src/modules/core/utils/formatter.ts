export const isIPFS = (url: string) => Boolean(url?.startsWith('ipfs://'));

export const isHTTPS = (url: string) => Boolean(url?.startsWith('https://'));

export const IPFStoHTTP = (url: string) =>
  isIPFS(url) ? `https://ipfs.io/ipfs/${url.slice(7)}` : url;

export const parseURI = (uri: string) => {
  if (isIPFS(uri)) {
    return IPFStoHTTP(uri);
  }
  return uri;
};
