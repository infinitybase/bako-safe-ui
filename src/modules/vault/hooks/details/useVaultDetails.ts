import { useNavigate, useParams } from 'react-router-dom';

import { useFuelAccount } from '@/modules';

import { useVaultAssets } from '../assets';
import { useVaultDetailsRequest } from '../details';

const useVaultDetails = () => {
  const navigate = useNavigate();
  const params = useParams<{ vaultId: string }>();
  const { account } = useFuelAccount();

  const { predicate, isLoading } = useVaultDetailsRequest(params.vaultId!);
  const {
    assets,
    ethBalance,
    isLoading: isLoadingAssets,
    hasBalance,
    hasAssets,
  } = useVaultAssets(predicate?.predicateInstance);

  return {
    vault: {
      ...predicate,
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
  };
};

export { useVaultDetails };
