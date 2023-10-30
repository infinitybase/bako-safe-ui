import { useDisclosure } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import {
  Pages,
  useFuelAccount,
  useTransactionListRequest,
  useVaultAssets,
  useVaultDetailsRequest,
  WitnessStatus,
} from '@/modules';

const useSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ vaultId: string }>();
  const drawer = useDisclosure();
  const { account } = useFuelAccount();

  const vaultDetailsRequest = useVaultDetailsRequest(params.vaultId!);
  const transactionListRequest = useTransactionListRequest(params.vaultId!);
  const vaultAssets = useVaultAssets(vaultDetailsRequest?.predicateInstance);

  const pendingTransactions = useMemo(() => {
    return (
      transactionListRequest.data
        ?.filter((transaction) => transaction.predicateID === params.vaultId)
        .map((transaction) => transaction.witnesses)
        .flat()
        .filter((witness) => witness.status === WitnessStatus.PENDING)
        .filter((transaction) => transaction.account === account).length ?? 0
    );
  }, [account, params.vaultId, transactionListRequest.data]);

  const checkPathname = (path: string) => location.pathname === path;

  const menuItems = {
    home: checkPathname(Pages.detailsVault({ vaultId: params?.vaultId ?? '' })),
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
