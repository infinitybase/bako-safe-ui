import { WarningIcon } from '@chakra-ui/icons';
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
      <WarningIcon color="warning.500" />
      <Text color="warning.500" fontSize="xs">
        Insufficient ETH balance for paying gas.
      </Text>
    </Card>
  );
});
