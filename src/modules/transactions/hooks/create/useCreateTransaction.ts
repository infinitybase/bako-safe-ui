import { useNavigate, useParams } from 'react-router-dom';

import { useVaultAssets, useVaultDetailsRequest } from '@/modules/vault';

import { useCreateTransactionForm } from './useCreateTransactionForm';
import { useCreateTransactionRequest } from './useCreateTransactionRequest.ts';

const useCreateTransaction = () => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { transactionsFields, form } = useCreateTransactionForm();
  const transactionRequest = useCreateTransactionRequest({
    onSuccess: console.log,
  });

  // Vault
  const vaultDetails = useVaultDetailsRequest(params.id);
  const vaultAssets = useVaultAssets(vaultDetails.predicate?.predicateInstance);

  const handleCreateTransaction = form.handleSubmit((data) => {
    console.log(data);
  });

  return {
    transactionsFields,
    transactionRequest,
    form: {
      ...form,
      handleCreateTransaction,
    },
    vault: vaultDetails,
    assets: vaultAssets,
    navigate,
  };
};

export { useCreateTransaction };
