import { Alert, Box, Icon, Text } from '@chakra-ui/react';
import React from 'react';

import { DappWarning } from '@/components/icons/dapp-warning';

export interface DappConnectionAlertProps {
  origin: string;
}

const DappConnectionAlert = (props: DappConnectionAlertProps) => (
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
        {props.origin}
      </Text>
    </Box>
  </Alert>
);

export { DappConnectionAlert };
