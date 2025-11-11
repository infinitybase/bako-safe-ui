import { TransactionType } from 'bakosafe';
import { useState } from 'react';

// Now status and type filters is Together in TransactionFilters component
// So we need to reset status filter when type filter changes
const useFilterTxType = (resetStatusFilter: () => void) => {
  const [txFilterType, setTxFilterType] = useState<TransactionType | undefined>(
    undefined,
  );

  const handleIncomingAction = () => {
    setTxFilterType((prev) =>
      prev === TransactionType.DEPOSIT ? undefined : TransactionType.DEPOSIT,
    );
    resetStatusFilter();
  };

  const handleOutgoingAction = () => {
    setTxFilterType((prev) =>
      prev === TransactionType.TRANSACTION_SCRIPT
        ? undefined
        : TransactionType.TRANSACTION_SCRIPT,
    );
    resetStatusFilter();
  };

  const handleAllAction = () => {
    setTxFilterType(undefined);
    resetStatusFilter();
  };

  return {
    txFilterType,
    handleIncomingAction,
    handleOutgoingAction,
    handleAllAction,
    setTxFilterType,
  };
};

export { useFilterTxType };
