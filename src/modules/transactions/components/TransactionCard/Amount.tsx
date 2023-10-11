import { Box, Heading, HStack, Text } from '@chakra-ui/react';

import { AssetModel, NativeAssetId } from '@/modules/core';

interface TransactionCardAmountProps {
  assets: AssetModel[];
}

const Amount = ({ assets }: TransactionCardAmountProps) => {
  const ethAmount = assets.find((a) => a.assetID === NativeAssetId)?.amount;

  return (
    <HStack w={110} ml={6}>
      <Box mt={0.5}>
        <Heading variant="title-md" color="grey.200">
          {ethAmount}
        </Heading>
        <Text variant="description" fontSize="sm" color="grey.500">
          Amount sent
        </Text>
      </Box>
    </HStack>
  );
};

export { Amount };
