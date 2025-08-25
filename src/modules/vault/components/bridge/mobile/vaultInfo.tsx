import { Avatar, Card, HStack, Text, VStack } from '@chakra-ui/react';

import { AddressWithCopyBtn } from '@/components';
import { AddressUtils } from '@/modules/core';

export function VaultInfoBridgeMobile() {
  const vaultName = 'My Vault';
  const address =
    '0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07';

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
          name={vaultName}
          boxShadow="0px 1.5px 1.5px 0px rgba(0, 0, 0, 0.4);"
          boxSize="30px"
          sx={{
            '& div': { fontSize: '12px' },
          }}
        />

        <VStack w="full" align="start" gap={0}>
          <Text color="grey.50" fontSize={12} fontWeight={500}>
            {vaultName}
          </Text>

          <AddressWithCopyBtn
            h="18px"
            value={address}
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
            customValue={AddressUtils.format(address)}
          />
        </VStack>
      </HStack>
    </Card>
  );
}
