import { Text, VStack } from '@chakra-ui/react';

import type { AssetModel } from '@/modules/core';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { AmountUSD } from '../transfer-details';
import { bn } from 'fuels';

interface AmountsInfoProps {
  asset: AssetModel;
  txUSDAmount: string;
}

const AmountsInfo = ({ asset, txUSDAmount }: AmountsInfoProps) => {
  const {
    screenSizes: { isMobile },
    assetsMap,
  } = useWorkspaceContext();

  return (
    <VStack mt={0.5} w={{ base: '105px' }}>
      <Text
        textAlign={isMobile ? 'end' : 'center'}
        variant={isMobile ? 'title-sm' : 'title-md'}
        color="grey.75"
        fontSize="sm"
      >
        {bn(asset?.amount).format({
          units:
            assetsMap[asset?.assetId ?? ''].units ?? assetsMap.UNKNOWN.units,
        })}
      </Text>
      <Text
        textAlign={isMobile ? 'end' : 'center'}
        variant="description"
        fontSize="xs"
        color="grey.500"
      >
        <AmountUSD amount={txUSDAmount} />
      </Text>
    </VStack>
  );
};
export default AmountsInfo;
