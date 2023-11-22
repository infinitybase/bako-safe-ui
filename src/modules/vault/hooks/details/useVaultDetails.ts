import { useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate, useParams } from 'react-router-dom';

import { useFuelAccount } from '@/modules';
import { useVaultState } from '@/modules/vault/states';

import { useVaultAssets } from '../assets';
import { useVaultDetailsRequest } from '../details';
import { useVaultTransactionsRequest } from './useVaultTransactionsRequest';

const useVaultDetails = () => {
  const navigate = useNavigate();
  const params = useParams<{ vaultId: string }>();
  const { account } = useFuelAccount();
  const store = useVaultState();
  const inView = useInView();

  const { predicate, predicateInstance, isLoading, isFetching } =
    useVaultDetailsRequest(params.vaultId!);
  const vaultTransactionsRequest = useVaultTransactionsRequest(
    predicateInstance!,
  );

  const {
    assets,
    ethBalance,
    isFetching: isLoadingAssets,
    hasBalance,
    hasAssets,
  } = useVaultAssets(predicateInstance);

  const configurable = useMemo(
    () => predicateInstance?.getConfigurable(),
    [predicateInstance],
  );

  const signersOrdination = useMemo(() => {
    if (!predicate) return [];

    return (
      predicate.addresses
        ?.map((address) => ({
          address,
          isOwner: address === predicate.owner.address,
        }))
        .sort((address) => (address.isOwner ? -1 : 0)) ?? []
    );
  }, [predicate]);

  const completeSignersOrdination = useMemo(() => {
    if (!predicate) return [];

    return (
      predicate.members
        ?.map((address) => ({
          address,
          isOwner: address.address === predicate.owner.address,
        }))
        .sort((address) => (address.isOwner ? -1 : 0)) ?? []
    );
  }, [predicate]);

  return {
    vault: {
      ...predicate,
      configurable,
      signers: signersOrdination,
      completeSigners: completeSignersOrdination,
      isLoading,
      isFetching,
      hasBalance,
      transactions: {
        ...vaultTransactionsRequest,
        vaultTransactions: vaultTransactionsRequest.transactions,
        loadingVaultTransactions: vaultTransactionsRequest.isLoading,
      },
    },
    assets: {
      hasAssets,
      isLoadingAssets,
      ethBalance,
      value: assets,
    },
    inView,
    navigate,
    account,
    store,
  };
};

export type UseVaultDetailsReturn = ReturnType<typeof useVaultDetails>;

export { useVaultDetails };
