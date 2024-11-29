import { Assets, bn, BNInput, NetworkFuel } from 'fuels';

import { Maybe, UNKNOWN_ASSET_UNITS } from '@/modules/core/utils';

interface GetAssetUnitsParams {
  fuelsTokens?: Assets;
  chainId: number;
  assetId: string;
  amount: Maybe<BNInput>;
}

const formatAssetAmount = ({
  fuelsTokens,
  chainId,
  assetId,
  amount,
}: GetAssetUnitsParams): string => {
  const units =
    fuelsTokens
      ?.map((asset) => {
        const network = asset?.networks?.find(
          (network) => network && network.chainId === chainId,
        ) as NetworkFuel;

        if (network && network.assetId === assetId) return network.decimals;
      })
      .find((units) => units !== undefined) ?? UNKNOWN_ASSET_UNITS;

  return bn(amount)?.format({ units });
};

export { formatAssetAmount };
