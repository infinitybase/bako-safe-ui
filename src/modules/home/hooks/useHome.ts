import { useTimeout } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CookieName, CookiesConfig } from '@/config/cookies';
import { useListContactsRequest } from '@/modules/addressBook/hooks/useListContactsRequest';
import { useFuelAccount } from '@/modules/auth/store';
import { HomeQueryKey, invalidateQueries, Pages } from '@/modules/core';
import { useTransactionsSignaturePending } from '@/modules/transactions/hooks/list';

import { useHomeDataRequest } from './useHomeDataRequest';

const useHome = () => {
  const navigate = useNavigate();
  const { account } = useFuelAccount();
  const vaultsPerPage = 8;
  const homeDataRequest = useHomeDataRequest();
  useListContactsRequest();

  const vaultsTotal = homeDataRequest?.data?.predicates.total ?? 0;
  const pendingSignerTransactions = useTransactionsSignaturePending();

  const [firstRender, setFirstRender] = useState<boolean>(true);
  const [hasSkeleton, setHasSkeleton] = useState<boolean>(true);

  useTimeout(() => {
    setHasSkeleton(false), setFirstRender(false);
  }, 5000);

  useMemo(() => {
    const workspacesInCookie = JSON.parse(
      CookiesConfig.getCookie(CookieName.SINGLE_WORKSPACE)!,
    ).id;
    if (
      firstRender &&
      homeDataRequest.data?.workspace.id !== workspacesInCookie
    ) {
      setHasSkeleton(true);
      setFirstRender(false);
    }

    if (
      !firstRender &&
      homeDataRequest.data?.workspace.id === workspacesInCookie
    ) {
      setHasSkeleton(false);
      setFirstRender(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    homeDataRequest.isLoading,
    homeDataRequest.isFetching,
    homeDataRequest.isSuccess,
    homeDataRequest.data,
  ]);

  const goHome = () => {
    invalidateQueries(HomeQueryKey.FULL_DATA());
    navigate(Pages.home());
  };

  useEffect(() => {
    document.getElementById('top')?.scrollIntoView();
  }, []);

  return {
    account,
    vaultsRequest: {
      ...homeDataRequest,
      vaults: {
        recentVaults: homeDataRequest.data?.predicates?.data,
        vaultsMax: vaultsPerPage,
        extraCount:
          vaultsTotal <= vaultsPerPage ? 0 : vaultsTotal - vaultsPerPage,
      },
      loadingRecentVaults: homeDataRequest.isLoading,
      refetchVaults: homeDataRequest.refetch,
    },
    transactionsRequest: {
      ...homeDataRequest,
      transactions: homeDataRequest.data?.transactions?.data,
      loadingTransactions: homeDataRequest.isLoading,
    },
    homeRequest: homeDataRequest,
    navigate,
    goHome,
    hasSkeleton,
    pendingSignerTransactions,
  };
};

export { useHome };
