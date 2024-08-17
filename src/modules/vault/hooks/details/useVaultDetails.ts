import { useState } from 'react';
import { useSidebar } from '../details';
import { useGetParams } from '@/modules/core';
import { useFilterTxType } from '@/modules/transactions/hooks/filter';
import { useTransactionsContext } from '@/modules/transactions/providers/TransactionsProvider';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';
import { useCLI } from '@/modules/cli/hooks';

const useVaultDetails = () => {
  const [byMonth, setByMonth] = useState(false);

  const {
    vaultPageParams: { vaultId, workspaceId },
  } = useGetParams();

  const { txFilterType, handleIncomingAction, handleOutgoingAction } =
    useFilterTxType();

  const {
    vaultDetails: { vaultRequest, assets },
    authDetails: {
      userInfos: { address: account, id: userId },
    },
    workspaceInfos: {
      currentWorkspaceRequest: { currentWorkspace },
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

  const {
    settings: CLISettings,
    hasPermission: hasCLIPermission,
    APIToken,
    commingSoonFeatures: { commingSoonDialog, selectedFeature },
  } = useCLI({
    vaultId: vaultRequest.data.id ?? '',
    userId,
    currentWorkspace: currentWorkspace,
  });

  const sideBarDetails = useSidebar({
    params: { vaultId: vaultId ?? '', workspaceId: workspaceId ?? '' },
  });

  return {
    CLIInfos: {
      CLISettings,
      hasCLIPermission,
      APIToken,
      commingSoonFeatures: { commingSoonDialog, selectedFeature },
    },
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
