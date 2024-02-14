import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CookieName, CookiesConfig } from '@/config/cookies';
import { useListContactsRequest } from '@/modules/addressBook/hooks/useListContactsRequest';
import { useFuelAccount } from '@/modules/auth/store';
import { useTransactionsSignaturePending } from '@/modules/transactions/hooks/list';
import { useWorkspace } from '@/modules/workspace';

import { useHomeDataRequest } from './useHomeDataRequest';

const useHome = () => {
  const navigate = useNavigate();
  const { account } = useFuelAccount();
  const vaultsPerPage = 8;
  const homeDataRequest = useHomeDataRequest();
  const { workspaceHomeRequest } = useWorkspace();
  useListContactsRequest();

  const vaultsTotal = homeDataRequest?.data?.predicates.total ?? 0;
  const pendingSignerTransactions = useTransactionsSignaturePending();

  const [firstRender, setFirstRender] = useState<boolean>(true);
  const [hasSkeleton, setHasSkeleton] = useState<boolean>(false);

  useMemo(() => {
    const workspacesInCookie = JSON.parse(
      CookiesConfig.getCookie(CookieName.WORKSPACE)!,
    ).id;
    if (
      firstRender &&
      homeDataRequest.data?.workspace.id !== workspacesInCookie
    ) {
      setHasSkeleton(true);
      setFirstRender(false);
    }

    setTimeout(() => {
      if (
        (!firstRender &&
          homeDataRequest.data?.workspace.id === workspacesInCookie) ||
        (!firstRender &&
          workspaceHomeRequest.data?.workspace.id === workspacesInCookie)
      ) {
        setHasSkeleton(false);
      }
    }, 500);
  }, [
    homeDataRequest.data?.workspace.id,
    workspaceHomeRequest.data?.workspace.id,
  ]);

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
    setFirstRender,
    hasSkeleton,
    firstRender,
    pendingSignerTransactions,
  };
};

export { useHome };
