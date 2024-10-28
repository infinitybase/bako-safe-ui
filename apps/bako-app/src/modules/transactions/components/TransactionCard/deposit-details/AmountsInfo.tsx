import { AssetModel } from '@bako-safe/services/types';
import { Text, VStack } from '@chakra-ui/react';

import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { AmountUSD } from '../transfer-details';

interface AmountsInfoProps {
  asset: AssetModel;
  txUSDAmount: string;
}

const AmountsInfo = ({ asset, txUSDAmount }: AmountsInfoProps) => {
  const {
    screenSizes: { isMobile },
  } = useWorkspaceContext();

  return (
    <VStack mt={0.5} w={{ base: '105px' }}>
      <Text
        textAlign={isMobile ? 'end' : 'center'}
        variant={isMobile ? 'title-sm' : 'title-md'}
        color="grey.75"
        fontSize="sm"
      >
        {asset?.amount}
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
