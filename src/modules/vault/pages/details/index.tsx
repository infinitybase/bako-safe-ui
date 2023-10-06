import { HStack, Icon, Text, VStack } from '@chakra-ui/react';
import React from 'react';

import { HomeIcon } from '@/components';

import { CardDetails } from '../../components/CardDetails';

const VaultDetailsPage = () => {
  //const { vault, assets, navigate, account } = useVaultDetails();

  return (
    <VStack w="full" spacing={6}>
      <HStack w="full" justifyContent="flex-start">
        <Icon as={HomeIcon} fontSize="lg" color="grey.200" />
        <Text color="grey.200" fontWeight="semibold">
          Home / Vaults / [vaultName]
        </Text>
      </HStack>

      <HStack w="full">
        <VStack w="50%" justifyContent="flex-start">
          <HStack w="full">
            <Text color="grey.200" fontWeight="semibold">
              Overview
            </Text>
          </HStack>
          <HStack w="full">
            <CardDetails />
          </HStack>
        </VStack>
      </HStack>
    </VStack>
  );
};

export { VaultDetailsPage };
