import { DappTransactionFee } from './fee';
import { DappTransactionOperation } from './operation';
import { DappTransactionOperationCard } from './operation-card';
import { DappTransactionOperationPanel } from './operation-panel';
import { DappTransactionOperationSectionGroup } from './operation-section-group';
import { DappTransactionOperationSectionMain } from './operation-section-main';

const DappTransaction = {
  Fee: DappTransactionFee,
  Operation: DappTransactionOperation,
  Card: DappTransactionOperationCard,
  OperationPanel: DappTransactionOperationPanel,
  OperationSectionMain: DappTransactionOperationSectionMain,
  OperationSectionGroup: DappTransactionOperationSectionGroup,
};

export { DappTransaction };
