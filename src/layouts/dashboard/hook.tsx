import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useTransactionListRequest, useVaultDetailsRequest } from '@/modules';

const useSidebar = () => {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();

  const vaultDetailsRequest = useVaultDetailsRequest(params.id!);
  const transactionListRequest = useTransactionListRequest(params.id!);

  const pendingTransactions = useMemo(() => {
    return (
      transactionListRequest.data
        ?.filter((transaction) => transaction.predicateID === params.id)
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
