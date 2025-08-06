import { InfoIcon } from '@chakra-ui/icons';
import { Card, Text } from '@chakra-ui/react';

export const SwapError = ({ error }: { error: string }) => {
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
        {error}
      </Text>
    </Card>
  );
};
