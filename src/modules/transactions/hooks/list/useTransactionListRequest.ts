import { useQuery } from 'react-query';

import { TransactionService } from '../../services';

const useTransactionListRequest = (vaultId: string) => {
  return useQuery(['predicate/transactions', vaultId], () =>
    TransactionService.getTransactions({ predicateId: vaultId }),
  );
};

export { useTransactionListRequest };
