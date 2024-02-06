import { PENDING_TRANSACTIONS_QUERY_KEY } from '@/modules/transactions/hooks/list/useTotalSignaturesPendingRequest';

export const HomeQueryKey = {
  DEFAULT: 'home',
  PENDING_TRANSACTIONS: PENDING_TRANSACTIONS_QUERY_KEY,
  FULL_DATA: () => [HomeQueryKey.DEFAULT, 'full-data'],
};
