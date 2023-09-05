import { bn } from 'fuels';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useFuelAccount } from '@/modules';

import { useVaultAssets } from '../assets';
import { useVaultDetailsRequest } from '../details';

const useVaultDetails = () => {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const { account } = useFuelAccount();

  const { predicate, isLoading } = useVaultDetailsRequest(params.id);
  const {
    assets,
    ethBalance,
    isLoading: isLoadingAssets,
  } = useVaultAssets(predicate?.predicateInstance);

  const hasBalance = useMemo(() => {
    return assets?.some((asset) => bn(bn.parseUnits(asset.amount)).gt(0));
  }, [assets]);

  const hasAssets = !!assets?.length;

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
