import { useQuery } from 'react-query';

import { TransactionService } from '../../services';

const useTransactionListRequest = (vaultId: string) => {
  return useQuery(['predicate/transactions', vaultId], () =>
    TransactionService.getByVault(vaultId),
  );
};

export { useTransactionListRequest };
