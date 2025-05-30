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

export const metadataArrayToObject = (
  metadata: Record<string, string>[],
  key: string,
) => {
  return metadata
    .map((v) => {
      const keyValue = Object.keys(v).find((k) => k !== 'value');
      const keyName = v[keyValue!].toLowerCase().replace(' ', '-');
      return {
        key: `${key}:${keyName}`,
        value: v.value,
      };
    })
    .reduce(
      (acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
      },
      {} as Record<string, string>,
    );
};

export const formatMetadataFromIpfs = (metadata: Record<string, string>) => {
  const metadataEntries = Object.entries(metadata).filter(
    ([key]) => !key.toLowerCase().includes('uri'),
  );
  const metadataObject: Record<string, string> = {};
  for (const [key, value] of metadataEntries) {
    if (Array.isArray(value)) {
      const metadataValueRecord = metadataArrayToObject(value, key);
      Object.assign(metadataObject, metadataValueRecord);
      delete metadataObject[key];
      continue;
    }
    if (metadataObject[key] === undefined) {
      const metadataValue = value as string;
      metadataObject[key] = metadataValue as string;
    }
  }
  return metadataObject;
};
