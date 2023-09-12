import { useNavigate, useParams } from 'react-router-dom';

import { useVaultAssets, useVaultDetailsRequest } from '@/modules';
import { useTransactionListRequest } from '@/modules/transactions/hooks';

const useTransactionList = () => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();

  const transactionRequest = useTransactionListRequest(params.id!);
  const vaultRequest = useVaultDetailsRequest(params.id!);
  const vaultAssets = useVaultAssets(vaultRequest.predicate?.predicateInstance);

  return {
    transactionRequest: {
      ...transactionRequest,
      transactions: transactionRequest.data,
    },
    vaultRequest: vaultRequest,
    vaultAssets,
    navigate,
    params,
  };
};

export { useTransactionList };
