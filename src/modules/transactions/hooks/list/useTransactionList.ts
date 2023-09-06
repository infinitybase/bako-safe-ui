import { useNavigate, useParams } from 'react-router-dom';

import { useVaultDetailsRequest } from '@/modules';
import { useTransactionListRequest } from '@/modules/transactions/hooks';

const useTransactionList = () => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();

  const transactionRequest = useTransactionListRequest(params.id!);
  const vaultRequest = useVaultDetailsRequest(params.id!);

  return {
    transactionRequest: {
      ...transactionRequest,
      transactions: transactionRequest.data,
    },
    vaultRequest: vaultRequest,
    navigate,
    params,
  };
};

export { useTransactionList };
