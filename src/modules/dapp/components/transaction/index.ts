import { DappTransactionFee } from './fee';
import { DappTransactionOperation } from './operation';
import { DappTransactionOperationSection } from './operationSection';
import { DappRequestingFrom } from './requesting-from';

const DappTransaction = {
  Fee: DappTransactionFee,
  Operation: DappTransactionOperation,
  RequestingFrom: DappRequestingFrom,
  OperationSection: DappTransactionOperationSection,
};

export { DappTransaction };
