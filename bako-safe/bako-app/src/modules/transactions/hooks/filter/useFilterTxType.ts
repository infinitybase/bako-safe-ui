import { TransactionType } from 'bakosafe';
import { useState } from 'react';

const useFilterTxType = () => {
  const [txFilterType, setTxFilterType] = useState<TransactionType | undefined>(
    undefined,
  );

  const handleIncomingAction = () => {
    setTxFilterType((prev) =>
      prev === TransactionType.DEPOSIT ? undefined : TransactionType.DEPOSIT,
    );
  };

  const handleOutgoingAction = () => {
    setTxFilterType((prev) =>
      prev === TransactionType.TRANSACTION_SCRIPT
        ? undefined
        : TransactionType.TRANSACTION_SCRIPT,
    );
  };

  return {
    txFilterType,
    handleIncomingAction,
    handleOutgoingAction,
    setTxFilterType,
  };
};

export { useFilterTxType };
