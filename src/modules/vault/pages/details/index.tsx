import { Box, Button, HStack, Icon, Text, VStack } from '@chakra-ui/react';
import React from 'react';

import { HomeIcon } from '@/components';

import { AmountDetails } from '../../components/AmountDetails';
import { CardDetails } from '../../components/CardDetails';
import { SignersDetails } from '../../components/SignersDetails';
const VaultDetailsPage = () => {
  return (
    <VStack
      w="full"
      spacing={6}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <HStack w="full" justifyContent="space-between">
        <Box display="flex" flexDirection="row" alignItems="center">
          <Icon as={HomeIcon} fontSize="lg" color="grey.200" mr={3} />
          <Text color="grey.200" fontWeight="semibold">
            Home / Vaults / [vaultName]
          </Text>
        </Box>
        <Button
          variant="primary"
          backgroundColor="grey.500"
          color="white"
          cursor="pointer"
        >
          Set as template
        </Button>
      </HStack>

      <HStack
        w="full"
        display="flex"
        alignItems="start"
        justifyContent="center"
      >
        <CardDetails />
        <AmountDetails />
        <SignersDetails />
      </HStack>
    </VStack>
  );
};

export { VaultDetailsPage };
