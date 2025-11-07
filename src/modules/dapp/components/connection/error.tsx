import { Alert, Box, Icon, Text } from 'bako-ui';

import { RoundedErrorIcon } from '@/components/icons/rounded-error';

const DappError = () => (
  <Alert
    px={2}
    pt={1}
    pb={4}
    bgColor="error.900"
    borderWidth={1}
    borderRadius={8}
    borderColor="red.900"
    h={87}
    display="flex"
    alignItems="start"
  >
    <Icon fontSize="20px" as={RoundedErrorIcon} color="error.500" />
    <Box ml={2} w="312px" pr={8}>
      <Text variant="subtitle" color="error.500" fontSize="sm" mb={2}>
        New transactions disable
      </Text>
      <Text
        textAlign="start"
        fontWeight="normal"
        color="grey.200"
        fontSize={12}
        lineHeight="14px"
      >
        This vault has pending transaction and you cannot create another one.
        Complete the pending transaction to create another one
      </Text>
    </Box>
  </Alert>
);

export { DappError };
