import { useDisclosure } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { useAuth } from '@/modules/auth';
import { Pages } from '@/modules/core';
import {
  useTransactionListRequest,
  useTransactionsSignaturePending,
} from '@/modules/transactions/hooks';
import { useVaultDetailsRequest } from '@/modules/vault/hooks';

const useSidebar = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ workspaceId: string; vaultId: string }>();
  const drawer = useDisclosure();

  const vaultDetailsRequest = useVaultDetailsRequest(params.vaultId!);
  const { data: transactions } = useTransactionListRequest(params.vaultId!);
  const {
    workspaces: { current },
  } = useAuth();
  const pendingSignerTransactions = useTransactionsSignaturePending([
    params.vaultId!,
  ]);

  useMemo(() => {
    pendingSignerTransactions.refetch();
  }, [auth.account, params.vaultId, transactions]);

  const checkPathname = (path: string) => location.pathname === path;

  const menuItems = {
    home: checkPathname(
      Pages.detailsVault({
        workspaceId: params?.workspaceId ?? '',
        vaultId: params?.vaultId ?? '',
      }),
    ),
    settings: checkPathname(
      Pages.vaultSettings({
        vaultId: params?.vaultId ?? '',
        workspaceId: current ?? '',
      }),
    ),
    transactions: checkPathname(
      Pages.transactions({
        vaultId: params?.vaultId ?? '',
        workspaceId: current ?? '',
      }),
    ),
    balance: checkPathname(
      Pages.vaultBalance({
        vaultId: params?.vaultId ?? '',
        workspaceId: current ?? '',
      }),
    ),
  };

  return {
    route: {
      params,
      navigate,
    },
    drawer,
    menuItems,
    transactionListRequest: {
      ...transactions,
      pendingTransactions:
        pendingSignerTransactions.data?.transactionsBlocked ?? false,
      pendingSignerTransactionsLength:
        pendingSignerTransactions.data?.ofUser || 0,
      hasTransactions: !!transactions?.length,
    },
    vaultRequest: vaultDetailsRequest,
  };
};

export { useSidebar };
