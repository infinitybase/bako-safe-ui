import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';

import { useUserVaultRequest } from '..';

const useUserVaults = (userAddress: string) => {
  const navigate = useNavigate();
  const [hidden, sethidden] = useState(false);
  const inView = useInView({ delay: 300 });
  const vaultsRequest = useUserVaultRequest(userAddress, {
    perPage: 8,
    hidden,
  });

  useEffect(() => {
    if (
      inView.inView &&
      vaultsRequest.hasNextPage &&
      !vaultsRequest.isFetching
    ) {
      vaultsRequest.fetchNextPage();
    }
  }, [
    inView.inView,
    vaultsRequest.isFetching,
    vaultsRequest.fetchNextPage,
    vaultsRequest.hasNextPage,
    vaultsRequest,
  ]);

  return {
    filter: { value: hidden, change: sethidden },
    inView,
    request: {
      ...vaultsRequest,
      vaults: vaultsRequest.vaults,
    },
    handlers: {
      navigate,
    },
  };
};

export { useUserVaults };
