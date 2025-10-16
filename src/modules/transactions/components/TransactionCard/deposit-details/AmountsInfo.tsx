import { Text, VStack } from 'bako-ui';
import { bn } from 'fuels';

import type { AssetModel } from '@/modules/core';
import { useWorkspaceContext } from '@/modules/workspace/hooks';
import { isHex } from '@/utils';

import { AmountUSD } from '../transfer-details';

interface AmountsInfoProps {
  asset: AssetModel;
  txUSDAmount: string;
  isNFT: boolean;
}

const AmountsInfo = ({ asset, txUSDAmount, isNFT }: AmountsInfoProps) => {
  const {
    screenSizes: { isMobile },
    assetsMap,
  } = useWorkspaceContext();

  return (
    <VStack mt={0.5} w={{ base: '105px' }}>
      <Text
        textAlign={isMobile ? 'end' : 'center'}
        // variant={isMobile ? 'title-sm' : 'title-md'}
        color="grey.75"
        fontSize="sm"
      >
        {isNFT
          ? '1'
          : isHex(asset.amount)
            ? bn(asset?.amount)?.format({
                units:
                  assetsMap[asset?.assetId ?? '']?.units ??
                  assetsMap.UNKNOWN.units,
              })
            : asset.amount}
      </Text>
      <Text
        textAlign={isMobile ? 'end' : 'center'}
        // variant="description"
        fontSize="xs"
        color="grey.500"
      >
        <AmountUSD amount={txUSDAmount} isNFT={isNFT} />
      </Text>
    </VStack>
  );
};
export default AmountsInfo;
