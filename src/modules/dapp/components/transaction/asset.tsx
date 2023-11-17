import { Avatar, Box, HStack, Text } from '@chakra-ui/react';
import React from 'react';

import { Card } from '@/components';

export interface FeeProps {
  asset: string;
}

const DappTransactionAsset = ({ asset }: FeeProps) => {
  return (
    <Card as={HStack} w="full" borderTopRadius={0}>
      <Avatar
        mb={2}
        name="U"
        color="white"
        bgColor="dark.150"
        variant="roundedSquare"
      />
      <Box w="full">
        <Text variant="subtitle">Token</Text>
        <Text variant="description">q2898iuewi...2928</Text>
      </Box>
      <Box minW="max-content">
        <Text variant="subtitle">1.0987 TKN</Text>
      </Box>
    </Card>
  );
};

export { DappTransactionAsset };
