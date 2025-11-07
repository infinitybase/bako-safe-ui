import { Card, Text } from 'bako-ui';
import { memo } from 'react';
import { FiAlertTriangle as WarningIcon } from 'react-icons/fi';

export const GasAlert = memo(function GasAlert() {
  return (
    <Card.Root
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
    </Card.Root>
  );
});
