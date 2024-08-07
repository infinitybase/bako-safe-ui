import { useAuth } from '@/modules/auth';
import { useWorkspace } from '../useWorkspace';
import { useAddressBook } from '@/modules';
import { useEffect, useState } from 'react';
import { useTokensUSDAmountRequest } from '@/modules/home/hooks/useTokensUSDAmountRequest';
import { currentPath } from '@/utils';

const useWorkspaceDetails = () => {
  const [showWorkspace, setShowWorkspace] = useState(false);
  const { isSignInpage } = currentPath();

  const tokensUSD = useTokensUSDAmountRequest();
  const authDetails = useAuth();
  const {
    handlers: { hasPermission, ...handlersData },
    requests: { worksapceBalance, latestPredicates, ...requestsData },
    ...rest
  } = useWorkspace(authDetails.userInfos);
  const addressBookInfos = useAddressBook(authDetails, hasPermission);

  useEffect(() => {
    const gifDuration = 2900;
    const timer = setTimeout(() => {
      setShowWorkspace(true);
    }, gifDuration);

    return () => {
      clearTimeout(timer);
      setShowWorkspace(false);
    };
  }, [
    latestPredicates.isLoading,
    worksapceBalance.isLoading,
    addressBookInfos.requests.listContactsRequest.isLoading,
  ]);

  const isWorkspaceReady = isSignInpage
    ? true
    : !addressBookInfos.requests.listContactsRequest.isLoading &&
      authDetails &&
      !latestPredicates.isLoading &&
      !worksapceBalance.isLoading &&
      showWorkspace;

  return {
    isWorkspaceReady,
    authDetails,
    workspaceInfos: {
      handlers: { hasPermission, ...handlersData },
      requests: { worksapceBalance, latestPredicates, ...requestsData },
      ...rest,
    },
    addressBookInfos,
    isSignInpage,
    tokensUSD,
  };
};

export { useWorkspaceDetails };
