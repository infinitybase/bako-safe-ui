import { useNavigate, useParams } from 'react-router-dom';

import { useVaultAssets, useVaultDetailsRequest } from '@/modules';
import { useTransactionListRequest } from '@/modules/transactions/hooks';

const useTransactionList = () => {
  const params = useParams<{ vaultId: string }>();
  const navigate = useNavigate();

  const transactionRequest = useTransactionListRequest(params.vaultId!);
  const vaultRequest = useVaultDetailsRequest(params.vaultId!);
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
