import { DappTransactionFee } from './fee';
import {
  DappTransactionOperation,
  DappTransactionOperationSekeleton,
} from './operation';

const DappTransaction = {
  Fee: DappTransactionFee,
  Operation: DappTransactionOperation,
  OperationSkeleton: DappTransactionOperationSekeleton,
};

export { DappTransaction };
