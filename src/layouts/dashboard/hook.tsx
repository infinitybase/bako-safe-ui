import { useDisclosure } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { useFuelAccount } from '@/modules/auth/store';
import { Pages } from '@/modules/core';
import { useTransactionListRequest } from '@/modules/transactions/hooks';
import { waitingSignatures } from '@/modules/transactions/utils';
import { useVaultAssets, useVaultDetailsRequest } from '@/modules/vault/hooks';

const useSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ workspaceId: string; vaultId: string }>();
  const drawer = useDisclosure();
  const { account } = useFuelAccount();

  const vaultDetailsRequest = useVaultDetailsRequest(params.vaultId!);
  const transactionListRequest = useTransactionListRequest(params.vaultId!);
  const vaultAssets = useVaultAssets(vaultDetailsRequest?.predicateInstance);

  const pendingTransactions = useMemo(() => {
    return waitingSignatures({
      account,
      transactions: transactionListRequest.data ?? [],
    });
  }, [account, params.vaultId, transactionListRequest.data]);

  const checkPathname = (path: string) => location.pathname === path;

  const menuItems = {
    home: checkPathname(
      Pages.detailsVault({
        workspaceId: params?.workspaceId ?? '',
        vaultId: params?.vaultId ?? '',
      }),
    ),
    settings: checkPathname(
      Pages.vaultSettings({ vaultId: params?.vaultId ?? '' }),
    ),
    transactions: checkPathname(
      Pages.transactions({ vaultId: params?.vaultId ?? '' }),
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
      ...transactionListRequest,
      pendingTransactions,
      hasTransactions: !!transactionListRequest.data?.length,
    },
    vaultRequest: vaultDetailsRequest,
  };
};

export { useSidebar };
