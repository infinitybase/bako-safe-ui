import { useQuery } from '@tanstack/react-query';
import { getAssetById } from 'fuels';

import { GarageService } from '../services/garage';
import { GarageQueryKeys } from '../utils/constants';
import { Networks, resolveNetwork } from '../utils/resolver-network';
import { useChainId } from './useChainId';

export const useListAssets = () => {
  const { chainId } = useChainId();

  const network = resolveNetwork(chainId ?? Networks.MAINNET).toLowerCase() as
    | 'mainnet'
    | 'testnet';

  const { data: assets, ...rest } = useQuery({
    queryKey: [GarageQueryKeys.ASSETS_FOR_LISTING, chainId],
    queryFn: async () => {
      const assets = await GarageService.getAssets({
        chainId: chainId ?? undefined,
      });

      const assetsWithMetadata = await Promise.all(
        assets.map(async (asset) => {
          const metadata = await getAssetById({
            assetId: asset.id,
            network: network,
          });
          return {
            ...asset,
            metadata,
          };
        }),
      );
      return assetsWithMetadata;
    },
    initialData: [],
    enabled: chainId !== null,
  });

  return { assets, ...rest };
};
