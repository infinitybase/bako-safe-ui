import { InfoIcon } from '@chakra-ui/icons';
import { Card, Text } from '@chakra-ui/react';
import { memo } from 'react';

export const GasAlert = memo(function GasAlert() {
  return (
    <Card
      variant="outline"
      p={3}
      gap={2}
      alignItems="center"
      flexDirection="row"
    >
      <InfoIcon color="info.300" />
      <Text color="info.300" fontSize="xs">
        Insufficient ETH balance for paying gas.
      </Text>
    </Card>
  );
});
