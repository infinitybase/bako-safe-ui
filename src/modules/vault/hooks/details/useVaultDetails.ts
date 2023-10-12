import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useFuelAccount } from '@/modules';
import { useVaultState } from '@/modules/vault/states';

import { useVaultAssets } from '../assets';
import { useVaultDetailsRequest } from '../details';

const useVaultDetails = () => {
  const navigate = useNavigate();
  const params = useParams<{ vaultId: string }>();
  const { account } = useFuelAccount();
  const store = useVaultState();

  const { predicate, isLoading } = useVaultDetailsRequest(params.vaultId!);
  const {
    assets,
    ethBalance,
    isLoading: isLoadingAssets,
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

    return predicate.addresses
      .map((address) => ({
        address,
        isOwner: address === predicate.owner,
      }))
      .sort((address) => (address.isOwner ? -1 : 0));
  }, [predicate]);

  const completeSignersOrdination = useMemo(() => {
    if (!predicate) return [];

    return predicate.completeAddress
      ?.map((address) => ({
        address,
        isOwner: address.address === predicate.owner,
      }))
      .sort((address) => (address.isOwner ? -1 : 0));
  }, [predicate]);

  return {
    vault: {
      ...predicate,
      configurable,
      signers: signersOrdination,
      completeSigners: completeSignersOrdination,
      isLoading,
      hasBalance,
    },
    assets: {
      hasAssets,
      isLoadingAssets,
      ethBalance,
      value: assets,
    },
    navigate,
    account,
    store,
  };
};

export type UseVaultDetailsReturn = ReturnType<typeof useVaultDetails>;

export { useVaultDetails };
