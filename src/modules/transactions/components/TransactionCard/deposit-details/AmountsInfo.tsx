import { AssetModel } from '@/modules/core';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';
import { Box, Text } from '@chakra-ui/react';

interface AmountsInfoProps {
  asset: AssetModel;
  txUSDAmount: string;
}

const AmountsInfo = ({ asset, txUSDAmount }: AmountsInfoProps) => {
  const {
    screenSizes: { isMobile },
  } = useWorkspaceContext();

  return (
    <Box mt={0.5} w={{ base: '105px' }}>
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
        ${txUSDAmount}
      </Text>
    </Box>
  );
};
export default AmountsInfo;
