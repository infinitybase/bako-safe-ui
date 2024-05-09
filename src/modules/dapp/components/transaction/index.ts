import { DappTransactionFee } from './fee';
import {
  DappTransactionOperation,
  DappTransactionOperationSekeleton,
} from './operation';
import { DappTransactionReservedAmount } from './reservedAmount';

const DappTransaction = {
  Fee: DappTransactionFee,
  Operation: DappTransactionOperation,
  OperationSkeleton: DappTransactionOperationSekeleton,
  ReservedAmount: DappTransactionReservedAmount,
};

export { DappTransaction };
