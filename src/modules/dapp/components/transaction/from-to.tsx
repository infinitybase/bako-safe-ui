import { HStack, Icon } from 'bako-ui';
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

const DappTransactionFromTo = ({ to, from, vault, hasAssets }: FromToProps) => {
  const isContract = to.type === AddressType.contract;

  return (
    <HStack gap={2} css={{ gap: 0, w: 'full', position: 'relative' }}>
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
    </HStack>
  );
};

export { DappTransactionFromTo };
