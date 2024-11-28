import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import { useAuth } from '@/modules/auth';
import {
  SocketEvents,
  SocketUsernames,
  useGetParams,
  useSocket,
} from '@/modules/core';
import { useHomeTransactions } from '@/modules/home/hooks/useHomeTransactions';
import { useHasReservedCoins } from '@/modules/vault/hooks';
import {
  StatusFilter,
  useVaultTransactionsList,
} from '@/modules/vault/hooks/list/useVaultTransactionsList';

import { useTransactionList, useTransactionsSignaturePending } from '../list';
import { usePendingTransactionsList } from '../list/useGetPendingTransactionsList';
import { useSignTransaction } from '../signature';

export type IuseTransactionDetails = ReturnType<typeof useTransactionDetails>;
type HandleWithSocketEventProps = {
  sessionId: string;
  to: string;
  type: string;
};

const useTransactionDetails = () => {
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);
  const { socket } = useSocket();

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
  });
  const transactionsPageList = useTransactionList({
    workspaceId: workspace?.id,
  });

  const pendingTransactions = usePendingTransactionsList(
    homeTransactions.transactions!,
    transactionsPageList.lists.transactions!,
    vaultTransactions.lists.transactions,
  );

  const { refetchAssets } = useHasReservedCoins(vaultId ?? '', workspace?.id);

  const signTransaction = useSignTransaction({
    transactionList: transactionsPageList,
    pendingTransactions: pendingTransactions,
    pendingSignerTransactionsRefetch: pendingSignerTransactions.refetch,
    homeTransactionsRefetch: homeTransactions.request.refetch,
    vaultBalanceRefetch: refetchAssets,
  });

  const resetAllTransactionsTypeFilters = () => {
    transactionsPageList.handlers.listTransactionTypeFilter(undefined);
    transactionsPageList.filter.set(StatusFilter.ALL);
    vaultTransactions.handlers.listTransactionTypeFilter(undefined);
    vaultTransactions.filter.set(StatusFilter.ALL);
  };

  useEffect(() => {
    const prevPath = prevPathRef.current;
    const currentPath = location.pathname;
    const hasSelectedTransaction =
      !!vaultTransactions.handlers.selectedTransaction?.id;

    return () => {
      const isNavigatingAway = currentPath !== prevPath;
      const isLeavingVault = !currentPath.includes('vault');

      if (isNavigatingAway || isLeavingVault) {
        hasSelectedTransaction &&
          vaultTransactions.handlers.setSelectedTransaction({
            id: '',
            name: '',
          });

        resetAllTransactionsTypeFilters();
      }

      prevPathRef.current = currentPath;
    };
  }, [location.pathname, vaultTransactions.handlers.selectedTransaction?.id]);

  const handleWithSocketEvent = ({ to, type }: HandleWithSocketEventProps) => {
    const isValid =
      to === SocketUsernames.UI && type === SocketEvents.TRANSACTION_UPDATE;
    if (isValid) {
      pendingSignerTransactions.refetch();
      homeTransactions.request.refetch();
      vaultTransactions.request.refetch();
      transactionsPageList.request.refetch();
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    socket.on(SocketEvents.DEFAULT, handleWithSocketEvent);

    return () => {
      socket.off(SocketEvents.DEFAULT, handleWithSocketEvent);
    };
  }, []);

  return {
    homeTransactions,
    vaultTransactions,
    transactionsPageList,
    signTransaction,
    pendingSignerTransactions,
    isPendingSigner:
      pendingSignerTransactions.data?.transactionsBlocked ?? false,
    pendingSignerTransactionsLength:
      pendingSignerTransactions.data?.ofUser || 0,
    resetAllTransactionsTypeFilters,
  };
};

export { useTransactionDetails };
