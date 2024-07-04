import { AssetModel, useScreenSize } from '@/modules/core';
import { Box, Text } from '@chakra-ui/react';

interface AmountsInfoProps {
  asset: AssetModel;
  txUSDAmount: string;
}

const AmountsInfo = ({ asset, txUSDAmount }: AmountsInfoProps) => {
  const { isMobile } = useScreenSize();

  return (
    <Box mt={0.5} w={{ base: 82 }}>
      <Text
        textAlign="center"
        variant={isMobile ? 'title-sm' : 'title-md'}
        color="grey.75"
        fontSize="sm"
      >
        {asset?.amount}
      </Text>
      <Text
        textAlign="center"
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
