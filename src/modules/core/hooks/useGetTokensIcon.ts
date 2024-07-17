import { assetsMap } from '../utils';

const useGetTokensIcon = (tokenId: string) => {
  const icon = assetsMap[tokenId].icon;

  return icon;
};

export { useGetTokensIcon };
