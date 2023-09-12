import { useNavigate, useParams } from 'react-router-dom';

import { useToast } from '@/modules';
import { useVaultAssets, useVaultDetailsRequest } from '@/modules/vault';

import { useCreateTransactionForm } from './useCreateTransactionForm';
import { useCreateTransactionRequest } from './useCreateTransactionRequest';

const useCreateTransaction = () => {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const toast = useToast();

  // Vault
  const vaultDetails = useVaultDetailsRequest(params.id!);
  const vaultAssets = useVaultAssets(vaultDetails.predicate?.predicateInstance);

  const { transactionsFields, form } = useCreateTransactionForm({
    assets: vaultAssets.assets,
    getCoinAmount: (asset) => vaultAssets.getCoinAmount(asset),
    validateBalance: (asset, amount) =>
      vaultAssets.hasAssetBalance(asset, amount),
  });
  const transactionRequest = useCreateTransactionRequest({
    onSuccess: () => {
      toast.show({
        status: 'success',
        title: 'Transaction created',
        position: 'bottom',
        isClosable: true,
      });
      navigate(-1);
    },
    onError: () => {
      toast.show({
        status: 'error',
        title: 'Error on create transaction.',
        position: 'bottom',
        isClosable: true,
      });
    },
  });

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
