import { VStack } from '@chakra-ui/react';
import { Operation } from '@fuel-ts/providers';
import { Vault } from 'bsafe';

import { DappTransactionAsset } from '@/modules/dapp/components/transaction/asset';
import { DappTransactionFromTo } from '@/modules/dapp/components/transaction/from-to';

interface OperationProps {
  operation?: Operation;
  vault?: Pick<Vault['BSAFEVault'], 'name' | 'predicateAddress'>;
  isLoading?: boolean;
}

const DappTransactionOperation = ({
  vault,
  operation,
  isLoading,
}: OperationProps) => {
  const { to, from } = operation ?? {};

  if (!to || !from || !vault || isLoading) {
    return null;
  }

  return (
    <VStack w="full" spacing={0} mb={7}>
      <DappTransactionFromTo
        to={from}
        from={to}
        vault={vault}
        isLoading={isLoading}
      />
      <DappTransactionAsset asset="" />
    </VStack>
  );
};

export { DappTransactionOperation };
