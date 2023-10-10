import { Box, Button, HStack, Icon, Text } from '@chakra-ui/react';
import React from 'react';

import { HomeIcon } from '@/components';
import { useVaultDetails } from '@/modules/vault/hooks';

import { AmountDetails } from '../../components/AmountDetails';
import { CardDetails } from '../../components/CardDetails';
import { SignersDetails } from '../../components/SignersDetails';
const VaultDetailsPage = () => {
  const { vault, store, assets } = useVaultDetails();

  if (!vault) return null;

  return (
    <Box w="full">
      <HStack mb={9} w="full" justifyContent="space-between">
        <Box display="flex" flexDirection="row" alignItems="center">
          <Icon as={HomeIcon} fontSize="lg" color="grey.200" mr={3} />
          <Text color="grey.200" fontWeight="semibold">
            Home / Vaults / {vault.name}
          </Text>
        </Box>
        <Button variant="secondary" bgColor="dark.100" border="none">
          Set as template
        </Button>
      </HStack>

      <HStack alignItems="flex-start" w="full" spacing={5}>
        <CardDetails vault={vault} store={store} />
        <AmountDetails assets={assets} />
        <SignersDetails vault={vault} />
      </HStack>
    </Box>
  );
};

export { VaultDetailsPage };
