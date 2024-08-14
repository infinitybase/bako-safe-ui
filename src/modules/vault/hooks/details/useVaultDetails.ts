import { useState } from 'react';
import { useSidebar } from '../details';
import { useGetParams } from '@/modules/core';
import { useFilterTxType } from '@/modules/transactions/hooks/filter';
import { useVaultTransactionsList } from '../list/useVaultTransactionsList';
import { useTransactionsContext } from '@/modules/transactions/providers/TransactionsProvider';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

const useVaultDetails = () => {
  const {
    vaultPageParams: { vaultId, workspaceId },
  } = useGetParams();
  const [byMonth, setByMonth] = useState(false);

  const { txFilterType, handleIncomingAction, handleOutgoingAction } =
    useFilterTxType();
  const {
    vaultDetails: { vaultRequest, assets },
  } = useWorkspaceContext();

  const { pendingSignerTransactions } = useTransactionsContext();

  const {
    transactionRequest,
    infinityTransactionsRef,
    infinityTransactions,
    filter,
    inView,
    account,
    selectedTransaction,
    setSelectedTransaction,
    defaultIndex,
  } = useVaultTransactionsList({
    byMonth: true,
    type: txFilterType,
    vaultId: vaultId!,
  });

  const sideBarDetails = useSidebar({
    params: { vaultId: vaultId ?? '', workspaceId: workspaceId ?? '' },
  });

  return {
    vault: {
      ...vaultRequest,
    },
    transactions: {
      ...transactionRequest,
      byMonth,
      setByMonth,
      txFilterType,
      handleIncomingAction,
      handleOutgoingAction,
      infinityTransactionsRef,
      infinityTransactions,
      homeDetailsLimitedTransactions: infinityTransactions?.slice(0, 1),
      filter,
      inView,
      account,
      selectedTransaction,
      setSelectedTransaction,
      defaultIndex,
    },
    sideBarDetails,
    assets,
    account,
    pendingSignerTransactions,
    isPendingSigner:
      pendingSignerTransactions.data?.transactionsBlocked ?? false,
    pendingSignerTransactionsLength:
      pendingSignerTransactions.data?.ofUser || 0,
  };
};

export type UseVaultDetailsReturn = ReturnType<typeof useVaultDetails>;

export { useVaultDetails };
