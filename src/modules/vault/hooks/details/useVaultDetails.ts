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

  const ordinateOwner = (list: { address: string; owner: boolean }[]) => {
    const owner = list.filter((item) => item.owner);
    const notOwner = list.filter((item) => !item.owner);
    return [...owner, ...notOwner];
  };

  const isValidConfigurable = !!predicate?.configurable;
  const configurable =
    isValidConfigurable && JSON.parse(predicate?.configurable);

  const minSigners = configurable && configurable.SIGNATURES_COUNT;
  const signers =
    configurable &&
    ordinateOwner(
      predicate.addresses.map((item) => {
        return {
          address: item,
          isOwner: predicate.owner === item,
        };
      }),
    );

  return {
    vault: {
      ...predicate,
      configurable: configurable,
      minSigners,
      signers,
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
