const gateways = [
  'https://cloudflare-ipfs.com/ipfs/',
  'https://gateway.pinata.cloud/ipfs/',
  'https://ipfs.io/ipfs/',
];

export const resolveIpfsUrl = async (
  ipfsPath: string,
): Promise<string | null> => {
  for (const gateway of gateways) {
    const url = `${gateway}${ipfsPath}`;
    try {
      const res = await fetch(url, { method: 'HEAD' });
      if (res.ok) return url;
    } catch (_) {
      continue;
    }
  }
  return null;
};
