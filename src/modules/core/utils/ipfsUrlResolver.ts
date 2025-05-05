const gateways = [
  'https://cloudflare-ipfs.com/ipfs/',
  'https://gateway.pinata.cloud/ipfs/',
  'https://ipfs.io/ipfs/',
];

export const resolveIpfsUrl = async (
  ipfsPath: string,
): Promise<string | null> => {
  if (ipfsPath.startsWith('http://') || ipfsPath.startsWith('https://')) {
    return ipfsPath;
  }

  const cleanHash = ipfsPath
    .replace(/^ipfs:\/\//, '')
    .replace(/^\/?ipfs\//, '');

  for (const gateway of gateways) {
    const url = `${gateway}${cleanHash}`;
    try {
      const res = await fetch(url, { method: 'HEAD' });
      if (res.ok) return url;
    } catch (_) {
      continue;
    }
  }

  return null;
};
