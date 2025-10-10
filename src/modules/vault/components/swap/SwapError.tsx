import { Card, Text } from '@chakra-ui/react';
import { FiAlertTriangle as WarningIcon } from 'react-icons/fi';

export const SwapError = ({ error }: { error: string }) => {
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
        {error}
      </Text>
    </Card.Root>
  );
};
