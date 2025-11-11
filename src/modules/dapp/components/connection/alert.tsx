import { Alert, Box, Icon, Text } from 'bako-ui';
import React from 'react';

import { DappWarning } from '@/components/icons/dapp-warning';

const DappConnectionAlert = () => (
  <Alert
    px={6}
    py={4}
    bgColor="#FDD8351A"
    borderWidth={1}
    borderRadius={8}
    borderColor="#FDD8351A"
  >
    <Icon fontSize="2xl" as={DappWarning} />
    <Box w="full" ml={4}>
      <Text variant="subtitle" color="#FDD835">
        Double check it!
      </Text>
      <Text fontSize="sm" fontWeight="normal" color="grey.200">
        Please carefully review this externally created transaction before
        approving it.
      </Text>
    </Box>
  </Alert>
);

export { DappConnectionAlert };
