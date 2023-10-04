import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useTransactionListRequest, useVaultDetailsRequest } from '@/modules';

const useSidebar = () => {
  const navigate = useNavigate();
  const params = useParams<{ vaultId: string }>();

  const vaultDetailsRequest = useVaultDetailsRequest(params.vaultId!);
  const transactionListRequest = useTransactionListRequest(params.vaultId!);

  const pendingTransactions = useMemo(() => {
    return (
      transactionListRequest.data
        ?.filter((transaction) => transaction.predicateID === params.vaultId)
        .map((transaction) => transaction.witnesses)
        .flat()
        .filter((transaction) => !transaction.signature).length ?? 0
    );
  }, [params, transactionListRequest.data]);

  return {
    route: {
      params,
      navigate,
    },
    vaultRequest: vaultDetailsRequest,
    pendingTransactions,
  };
};

export { useSidebar };
