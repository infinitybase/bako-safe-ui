import { DappTransactionFee } from './fee';
import { DappTransactionOperation } from './operation';
import { DappTransactionOperationCard } from './operation-card';
import { DappTransactionOperationPanel } from './operation-panel';
import { DappTransactionOperationSectionGroup } from './operation-section-group';
import { DappTransactionOperationSectionMain } from './operation-section-main';
import { DappRequestingFrom } from './requesting-from';

const DappTransaction = {
  Fee: DappTransactionFee,
  Operation: DappTransactionOperation,
  RequestingFrom: DappRequestingFrom,
  Card: DappTransactionOperationCard,
  OperationPanel: DappTransactionOperationPanel,
  OperationSectionMain: DappTransactionOperationSectionMain,
  OperationSectionGroup: DappTransactionOperationSectionGroup,
};

export { DappTransaction };
