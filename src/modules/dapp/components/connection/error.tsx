import { Alert, Box, Icon, Text } from '@chakra-ui/react';

import { ErrorIcon } from '@/components/icons/error';

const DappError = () => (
  <Alert
    px={6}
    py={4}
    bgColor="error.900"
    borderWidth={1}
    borderRadius={8}
    borderColor="red.900"
  >
    <Icon fontSize="2xl" as={ErrorIcon} color="error.500" />
    <Box w="full" ml={4}>
      <Text variant="subtitle" color="error.500">
        New transactions disable
      </Text>
      <Text fontSize="sm" fontWeight="normal" color="grey.200">
        This vault has pending transaction and you cannot create another one.
        Complete the pending transaction to create another one.
      </Text>
    </Box>
  </Alert>
);

export { DappError };
