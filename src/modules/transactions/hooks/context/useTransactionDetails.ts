import { useAuth } from '@/modules/auth';
import { useGetParams } from '@/modules/core';
import { useHomeTransactions } from '@/modules/home/hooks/useHomeTransactions';
import { useVaultTransactionsList } from '@/modules/vault/hooks/list/useVaultTransactionsList';

import { useTransactionList, useTransactionsSignaturePending } from '../list';
import { useSignTransaction } from '../signature';

export type IuseTransactionDetails = ReturnType<typeof useTransactionDetails>;

const useTransactionDetails = () => {
  const {
    userInfos: { workspace },
  } = useAuth();
  const {
    vaultPageParams: { vaultId },
  } = useGetParams();

  const homeTransactions = useHomeTransactions(workspace?.id);
  const pendingSignerTransactions = useTransactionsSignaturePending([vaultId!]);
  const vaultTransactions = useVaultTransactionsList({
    vaultId: vaultId!,
    byMonth: true,
  });
  const transactionsPageList = useTransactionList({
    workspaceId: workspace?.id,
    byMonth: true,
  });

  const signTransaction = useSignTransaction({
    transactionList: transactionsPageList,
    pendingSignerTransactionsRefetch: pendingSignerTransactions.refetch,
    homeTransactionsRefetch: homeTransactions.request.refetch,
  });

  const invalidateAllTransactionsTypeFilters = () => {
    homeTransactions.handlers.homeTransactionTypeFilter(undefined);
    transactionsPageList.handlers.listTransactionTypeFilter(undefined);
    vaultTransactions.handlers.listTransactionTypeFilter(undefined);
  };

  return {
    homeTransactions,
    vaultTransactions,
    transactionsPageList,
    signTransaction,
    pendingSignerTransactions,
    invalidateAllTransactionsTypeFilters,
  };
};

export { useTransactionDetails };
