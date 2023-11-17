import { Box, HStack, Icon } from '@chakra-ui/react';
import { OperationTransactionAddress } from '@fuel-ts/providers';
import { Vault } from 'bsafe';
import React from 'react';

import { DappRightArrow } from '@/components/icons/dapp-right-arrow';
import { DappTransactionRecipient } from '@/modules/dapp/components/transaction/recipient';

interface FromToProps {
  to: OperationTransactionAddress;
  from: OperationTransactionAddress;
  vault: Pick<Vault['BSAFEVault'], 'name' | 'predicateAddress'>;
  isLoading?: boolean;
}

const DappTransactionFromTo = ({ to, from, vault }: FromToProps) => {
  return (
    <HStack w="full" position="relative" spacing={0}>
      <DappTransactionRecipient
        isSender
        type={from.type}
        chain={from.chain}
        address={from.address}
        isVault={vault.predicateAddress === from.address}
        vaultName={vault.name}
      />
      <Box
        px={4}
        py={3}
        left="50%"
        right="50%"
        width="min-content"
        bgColor="dark.150"
        position="absolute"
        transform="translate(-50%)"
        borderRadius={10}
      >
        <Icon as={DappRightArrow} color="grey.200" />
      </Box>
      <DappTransactionRecipient
        type={to.type}
        chain={to.chain}
        vaultName={vault.name}
        address={to.address}
        isVault={vault.predicateAddress === to.address}
      />
    </HStack>
  );
};

export { DappTransactionFromTo };
