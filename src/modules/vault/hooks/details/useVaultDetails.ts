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

  const { predicate, isLoading, isFetching } = useVaultDetailsRequest(
    params.vaultId!,
  );
  const vaultTransactionsRequest = useVaultTransactionsRequest(params.vaultId!);

  const {
    assets,
    ethBalance,
    isFetching: isLoadingAssets,
    hasBalance,
    hasAssets,
  } = useVaultAssets(predicate?.predicateInstance);

  const configurable = useMemo(() => {
    const configurableJSON = predicate?.configurable;

    if (!configurableJSON) return null;

    return JSON.parse(configurableJSON);
  }, [predicate?.configurable]);

  const signersOrdination = useMemo(() => {
    if (!predicate) return [];

    return predicate.members
      ?.map((member) => ({
        ...member,
        isOwner: member.address === predicate.owner.address,
      }))
      .sort((member) => (member.isOwner ? -1 : 0));
  }, [predicate]);

  const completeSignersOrdination = useMemo(() => {
    if (!predicate) return [];

    return predicate.members
      ?.map((member) => ({
        ...member,
        isOwner: member.address === predicate.owner.address,
      }))
      .sort((member) => (member.isOwner ? -1 : 0));
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
        vaultTransactions: vaultTransactionsRequest.data,
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
