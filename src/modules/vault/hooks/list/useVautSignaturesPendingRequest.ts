import { TransactionService } from '@/modules/transactions/services';
import { useQuery } from '@tanstack/react-query';

const PENDING_VAULT_TRANSACTIONS_QUERY_KEY = 'vault-pending-transactions';

const useVaultSignaturesPendingRequest = (predicateId?: string[]) => {
  return useQuery({
    queryKey: [PENDING_VAULT_TRANSACTIONS_QUERY_KEY, predicateId],
    queryFn: () => {
      return TransactionService.getTransactionsSignaturePending(predicateId);
    },
    enabled: predicateId && !!predicateId[0],
    refetchOnWindowFocus: false,
  });
};

export {
  PENDING_VAULT_TRANSACTIONS_QUERY_KEY,
  useVaultSignaturesPendingRequest,
};
