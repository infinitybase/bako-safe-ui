import { useState } from 'react';

import { useVaultByIdRequest } from '@/modules';
import { useGetParams } from '@/modules/core';
import { useFilterTxType } from '@/modules/transactions/hooks/filter';
import { useTransactionsContext } from '@/modules/transactions/providers/TransactionsProvider';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { useVaultAssets } from '../assets';
import { useSidebar } from '../details';

const useVaultDetails = () => {
  const {
    vaultPageParams: { vaultId, workspaceId },
  } = useGetParams();
  const [byMonth, setByMonth] = useState(false);

  const { txFilterType, handleIncomingAction, handleOutgoingAction } =
    useFilterTxType();

  const vaultRequest = useVaultByIdRequest(vaultId ?? '');

  const {
    authDetails: {
      userInfos: { address: account },
    },
  } = useWorkspaceContext();
  const {
    pendingSignerTransactions,
    vaultTransactions: {
      request,
      infinityTransactionsRef,
      lists: { infinityTransactions },
      filter,
      inView,
      defaultIndex,
      handlers: { selectedTransaction, setSelectedTransaction },
    },
  } = useTransactionsContext();

  const sideBarDetails = useSidebar({
    params: { vaultId: vaultId ?? '', workspaceId: workspaceId ?? '' },
  });

  const assets = useVaultAssets(vaultId!);

  return {
    vault: {
      ...vaultRequest,
    },
    transactions: {
      ...request,
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
