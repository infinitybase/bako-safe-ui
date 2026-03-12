import { VStack } from 'bako-ui';

import { UseTransactionSocket } from '../../hooks';
import { CategorizedOperations } from '../../services/simplify-transaction';
import { DappTransaction } from '.';

interface DappTransactionOperationPanel {
  operations?: CategorizedOperations;
  vault: UseTransactionSocket['vault'];
}

export const DappTransactionOperationPanel = (
  props: DappTransactionOperationPanel,
) => {
  const { operations, vault } = props;

  const renderIntermediateContractCalls =
    (operations?.intermediateContractCalls?.length ?? 0) > 0;
  const renderNotRelatedToCurrentAccount =
    (operations?.notRelatedToCurrentAccount?.length ?? 0) > 0;

  return (
    <VStack gap={1} w="full">
      <DappTransaction.OperationSectionMain
        operations={operations?.mainOperations}
        vault={vault}
      />
      {renderIntermediateContractCalls && (
        <DappTransaction.OperationSectionGroup
          title="Intermediate contract calls"
          operations={operations?.intermediateContractCalls ?? []}
          vault={vault}
        />
      )}
      {renderNotRelatedToCurrentAccount && (
        <DappTransaction.OperationSectionGroup
          title="Operations not related to your vault"
          operations={operations?.notRelatedToCurrentAccount ?? []}
          vault={vault}
        />
      )}
    </VStack>
  );
};
