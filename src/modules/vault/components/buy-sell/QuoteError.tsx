import { Stack, Text } from '@chakra-ui/react';
import { FiInfo as InfoIcon } from 'react-icons/fi';

import { CardRoot } from './CardRoot';

export const QuoteError = () => {
  return (
    <CardRoot flexDirection="row" alignItems="center">
      <InfoIcon fontSize="lg" color="red.500" />
      <Stack gap={0}>
        <Text color="red.500" fontSize="sm">
          No quotes available
        </Text>

        <Text color="red.500" fontSize="sm">
          Please try a different combination
        </Text>
      </Stack>
    </CardRoot>
  );
};
