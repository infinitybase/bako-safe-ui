import { useNavigate, useParams } from 'react-router-dom';

import { useVaultAssets, useVaultDetailsRequest } from '@/modules/vault';

import { useCreateTransactionForm } from './useCreateTransactionForm';
import { useCreateTransactionRequest } from './useCreateTransactionRequest';

const useCreateTransaction = () => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { transactionsFields, form } = useCreateTransactionForm();
  const transactionRequest = useCreateTransactionRequest({
    onSuccess: () => {
      navigate(-1);
    },
  });

  // Vault
  const vaultDetails = useVaultDetailsRequest(params.id);
  const vaultAssets = useVaultAssets(vaultDetails.predicate?.predicateInstance);

  const handleCreateTransaction = form.handleSubmit((data) => {
    transactionRequest.mutate({
      predicate: vaultDetails.predicate!.predicateInstance,
      transaction: {
        name: data.name,
        predicateID: params.id!,
        predicateAddress:
          vaultDetails.predicate!.predicateInstance.address.toString(),
        assets: data.transactions!.map((transaction) => ({
          assetId: transaction.asset,
          amount: transaction.amount,
          to: transaction.to,
        })),
        witnesses: [],
        to: '',
        hash: '',
        txData: '',
        status: 'PENDING',
        sendTime: '',
        gasUsed: '',
      },
      predicateID: params.id!,
    });
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
