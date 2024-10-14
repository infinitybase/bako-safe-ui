import { chakra, HStack, Icon } from '@chakra-ui/react';
import { AddressType, OperationTransactionAddress } from 'fuels';

import { ForwardIcon, PlayIcon } from '@/components/icons';
import { DappTransactionRecipient } from '@/modules/dapp/components/transaction/recipient';

interface FromToProps {
  to: OperationTransactionAddress;
  from: OperationTransactionAddress;
  vault: {
    name: string;
    predicateAddress: string;
  };
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
  const isContract = to.type === AddressType.contract;

  return (
    <FromToContainer gap={2}>
      <DappTransactionRecipient
        isSender
        type={from.type}
        chain={from.chain}
        vault={vault}
        address={from.address}
        fullBorderRadius={!hasAssets}
      />

      <Icon
        as={isContract ? PlayIcon : ForwardIcon}
        boxSize="30px"
        width="min-content"
        left="50%"
        right="50%"
        position="absolute"
        transform="translate(-50%)"
      />

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
