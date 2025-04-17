import { DappTransactionFee } from './fee';
import { DappTransactionFromTo } from './from-to';
import { DappTransactionOperation } from './operation';
import { DappTransactionOperationCard } from './operation-card';
import { DappTransactionOperationSection } from './operation-section';
import { DappRequestingFrom } from './requesting-from';

const DappTransaction = {
  Fee: DappTransactionFee,
  Operation: DappTransactionOperation,
  RequestingFrom: DappRequestingFrom,
  OperationSection: DappTransactionOperationSection,
  FromTo: DappTransactionFromTo,
  Card: DappTransactionOperationCard,
};

export { DappTransaction };
