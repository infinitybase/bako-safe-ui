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
    try {
      return simplifyTransaction(tx, txRequest, txAccount);
    } catch (err) {
      console.error('Error simplifying transaction:', err);
      return;
    }
  }, [tx, txRequest, txAccount]);

  return {
    transaction,
    isReady: !!transaction,
  };
}
