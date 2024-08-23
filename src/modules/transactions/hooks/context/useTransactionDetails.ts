import { useAuth } from '@/modules/auth';
import { useGetParams } from '@/modules/core';
import { useHomeTransactions } from '@/modules/home/hooks/useHomeTransactions';
import {
  StatusFilter,
  useVaultTransactionsList,
} from '@/modules/vault/hooks/list/useVaultTransactionsList';

import { useTransactionList, useTransactionsSignaturePending } from '../list';
import { useSignTransaction } from '../signature';
import { usePendingTransactionsList } from '../list/useGetPendingTransactionsList';

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

  const pendingTransactions = usePendingTransactionsList(
    homeTransactions.transactions!,
    transactionsPageList.lists.infinityTransactions!,
  );

  const signTransaction = useSignTransaction({
    transactionList: transactionsPageList,
    pendingSignerTransactionsRefetch: pendingSignerTransactions.refetch,
    homeTransactionsRefetch: homeTransactions.request.refetch,
    pendingTransactions: pendingTransactions,
  });

  const resetAllTransactionsTypeFilters = () => {
    transactionsPageList.handlers.listTransactionTypeFilter(undefined);
    transactionsPageList.filter.set(StatusFilter.ALL);
    vaultTransactions.handlers.listTransactionTypeFilter(undefined);
    vaultTransactions.filter.set(StatusFilter.ALL);
  };

  return {
    homeTransactions,
    vaultTransactions,
    transactionsPageList,
    signTransaction,
    pendingSignerTransactions,
    resetAllTransactionsTypeFilters,
  };
};

export { useTransactionDetails };
