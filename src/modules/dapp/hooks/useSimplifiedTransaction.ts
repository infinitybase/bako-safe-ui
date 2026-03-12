import type { TransactionRequest, TransactionSummary } from 'fuels';
import { useMemo } from 'react';

import {
  SimplifiedTransaction,
  simplifyTransaction,
} from '../services/simplify-transaction';

type UseSimplifiedTransactionProps = {
  tx?: TransactionSummary;
  txRequest?: TransactionRequest;
  txAccount?: string;
};

export function useSimplifiedTransaction({
  tx,
  txRequest,
  txAccount,
}: UseSimplifiedTransactionProps) {
  const transaction = useMemo<SimplifiedTransaction | undefined>(() => {
    return simplifyTransaction(tx, txRequest, txAccount);
  }, [tx, txRequest, txAccount]);
  return {
    transaction,
    isReady: !!transaction,
  };
}
