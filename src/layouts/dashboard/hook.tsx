import { useDisclosure } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { useWorkspace } from '@/modules';
import { useFuelAccount } from '@/modules/auth/store';
import { Pages } from '@/modules/core';
import {
  useTransactionListRequest,
  useTransactionsSignaturePending,
} from '@/modules/transactions/hooks';
import { useVaultAssets, useVaultDetailsRequest } from '@/modules/vault/hooks';

const useSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ workspaceId: string; vaultId: string }>();
  const drawer = useDisclosure();
  const { account } = useFuelAccount();
  const { currentWorkspace } = useWorkspace();
  const vaultDetailsRequest = useVaultDetailsRequest(params.vaultId!);
  const { data: transactions } = useTransactionListRequest(params.vaultId!);
  const vaultAssets = useVaultAssets(vaultDetailsRequest?.predicateInstance);

  const pendingSignerTransactions = useTransactionsSignaturePending([
    params.vaultId!,
  ]);

  useMemo(() => {
    pendingSignerTransactions.refetch();
  }, [account, params.vaultId, transactions]);

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
        workspaceId: currentWorkspace.id,
      }),
    ),
    transactions: checkPathname(
      Pages.transactions({
        vaultId: params?.vaultId ?? '',
        workspaceId: currentWorkspace.id,
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
    vaultAssets,
    transactionListRequest: {
      ...transactions,
      pendingTransactions:
        pendingSignerTransactions.data?.transactionsBlocked ?? false,
      hasTransactions: !!transactions?.length,
    },
    vaultRequest: vaultDetailsRequest,
  };
};

export { useSidebar };
