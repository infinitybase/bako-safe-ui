import { useDisclosure } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  useFuelAccount,
  useTransactionListRequest,
  useVaultDetailsRequest,
} from '@/modules';

const useSidebar = () => {
  const navigate = useNavigate();
  const params = useParams<{ vaultId: string }>();
  const drawer = useDisclosure();
  const { account } = useFuelAccount();

  const vaultDetailsRequest = useVaultDetailsRequest(params.vaultId!);
  const transactionListRequest = useTransactionListRequest(params.vaultId!);

  const pendingTransactions = useMemo(() => {
    /* TODO: Catch pending transactions by Witnesses.status when implement this in server */
    return (
      transactionListRequest.data
        ?.filter((transaction) => transaction.predicateID === params.vaultId)
        .map((transaction) => transaction.witnesses)
        .flat()
        .filter((transaction) => !transaction.signature)
        .filter((transaction) => transaction.account === account).length ?? 0
    );
  }, [account, params.vaultId, transactionListRequest.data]);

  return {
    route: {
      params,
      navigate,
    },
    vaultRequest: vaultDetailsRequest,
    pendingTransactions,
    drawer,
  };
};

export { useSidebar };
