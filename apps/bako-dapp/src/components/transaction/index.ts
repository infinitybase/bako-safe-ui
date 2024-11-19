import { DappTransactionFee } from './fee';
import {
  DappTransactionOperation,
  DappTransactionOperationSekeleton,
} from './operation';
import { DappRequestingFrom } from './requesting-from';

const DappTransaction = {
  Fee: DappTransactionFee,
  Operation: DappTransactionOperation,
  OperationSkeleton: DappTransactionOperationSekeleton,
  RequestingFrom: DappRequestingFrom,
};

export { DappTransaction };
