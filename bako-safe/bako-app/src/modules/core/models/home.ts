import { PENDING_TRANSACTIONS_QUERY_KEY } from '@/modules/transactions/hooks/list/useTotalSignaturesPendingRequest';

export const HomeQueryKey = {
  DEFAULT: 'home',
  HOME_WORKSPACE: (workspaceId: string) => [
    HomeQueryKey.DEFAULT,
    'me',
    workspaceId,
  ],
  ADDRESS_BOOK: () => [HomeQueryKey.DEFAULT, 'address-book'],
  PENDING_TRANSACTIONS: PENDING_TRANSACTIONS_QUERY_KEY,
  FULL_DATA: (workspaceId: string) => [
    HomeQueryKey.DEFAULT,
    HomeQueryKey.HOME_WORKSPACE(workspaceId),
  ],
};
