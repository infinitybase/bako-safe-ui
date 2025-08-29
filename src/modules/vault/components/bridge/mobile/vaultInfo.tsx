import { Avatar, Card, HStack, Text, VStack } from '@chakra-ui/react';
import { useMemo } from 'react';

import { AddressWithCopyBtn } from '@/components';
import { AddressUtils } from '@/modules/core';
import { useVaultInfosContext } from '@/modules/vault/VaultInfosProvider';

export function VaultInfoBridgeMobile() {
  const { vault } = useVaultInfosContext();

  const vaultAddress = useMemo(() => {
    if (!vault) return '';

    return AddressUtils.format(vault.data?.predicateAddress ?? '', 4);
  }, [vault]);

  return (
    <Card padding={3} w="full" bgColor="grey.825" gap={3}>
      <Text color="grey.425" fontSize={12}>
        Vault
      </Text>
      <HStack w="full" align="center">
        <Avatar
          borderRadius={6}
          bgColor="grey.950"
          color="grey.75"
          name={vault?.data?.name}
          boxShadow="0px 1.5px 1.5px 0px rgba(0, 0, 0, 0.4);"
          boxSize="30px"
          sx={{
            '& div': { fontSize: '12px' },
          }}
        />

        <VStack w="full" align="start" gap={0}>
          <Text color="grey.50" fontSize={12} fontWeight={500}>
            {vault?.data?.name}
          </Text>

          <AddressWithCopyBtn
            h="18px"
            value={vault.data?.predicateAddress ?? ''}
            gap="4px"
            alignItems="center"
            textProps={{
              textAlign: 'start',
              maxW: 'full',
              wordBreak: 'break-all',
              noOfLines: 1,
              isTruncated: false,
              fontSize: 'xs',
            }}
            justifyContent="start"
            customValue={vaultAddress}
          />
        </VStack>
      </HStack>
    </Card>
  );
}
