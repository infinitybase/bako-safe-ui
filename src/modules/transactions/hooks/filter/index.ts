import { useState, useCallback } from 'react';
import { TransactionType } from 'bakosafe';

export const useFilterTxType = (onReset?: () => void) => {
  const [txFilterType, setTxFilterType] = useState<TransactionType | undefined>();

  const handleIncomingAction = useCallback(() => {
    setTxFilterType(TransactionType.TRANSACTION_SCRIPT);
    onReset?.();
  }, [onReset]);

  const handleOutgoingAction = useCallback(() => {
    setTxFilterType(TransactionType.TRANSACTION_CREATE);
    onReset?.();
  }, [onReset]);

  return {
    txFilterType,
    setTxFilterType,
    handleIncomingAction,
    handleOutgoingAction,
  };
};