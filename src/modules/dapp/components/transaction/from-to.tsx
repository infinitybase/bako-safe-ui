import { Box, chakra, HStack, Icon } from '@chakra-ui/react';
import { OperationTransactionAddress } from '@fuel-ts/providers';
import { Vault } from 'bakosafe';

import { DappRightArrow } from '@/components/icons/dapp-right-arrow';
import { DappTransactionRecipient } from '@/modules/dapp/components/transaction/recipient';

interface FromToProps {
  to: OperationTransactionAddress;
  from: OperationTransactionAddress;
  vault: Pick<Vault['BakoSafeVault'], 'name' | 'predicateAddress'>;
  hasAssets?: boolean;
}

const FromToContainer = chakra(HStack, {
  baseStyle: {
    gap: 0,
    w: 'full',
    position: 'relative',
  },
});

const DappTransactionFromTo = ({ to, from, vault, hasAssets }: FromToProps) => {
  return (
    <FromToContainer>
      <DappTransactionRecipient
        isSender
        type={from.type}
        chain={from.chain}
        vault={vault}
        address={from.address}
        fullBorderRadius={!hasAssets}
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
        vault={vault}
        address={to.address}
        fullBorderRadius={!hasAssets}
      />
    </FromToContainer>
  );
};

export { DappTransactionFromTo };
