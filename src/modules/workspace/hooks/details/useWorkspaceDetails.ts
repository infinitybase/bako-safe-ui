import { useAuth } from '@/modules/auth';
import { useWorkspace } from '../useWorkspace';
import { useAddressBook } from '@/modules';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTokensUSDAmountRequest } from '@/modules/home/hooks/useTokensUSDAmountRequest';

const useWorkspaceDetails = () => {
  const [showWorkspace, setShowWorkspace] = useState(true);
  const { pathname } = useLocation();
  const isSignInpage = pathname === '/';

  const tokensUSD = useTokensUSDAmountRequest();
  const authDetails = useAuth();
  const workspaceInfos = useWorkspace(authDetails);
  const addressBookInfos = useAddressBook(
    authDetails,
    workspaceInfos.hasPermission,
  );

  useEffect(() => {
    const gifDuration = 2900;
    const timer = setTimeout(() => {
      setShowWorkspace(true);
    }, gifDuration);

    return () => clearTimeout(timer);
  }, [authDetails.userInfos.isLoading]);

  const isWorkspaceReady =
    !addressBookInfos.requests.listContactsRequest.isLoading &&
    authDetails &&
    !workspaceInfos.latestPredicates.isLoading &&
    !workspaceInfos.worksapceBalance.isLoading &&
    showWorkspace;

  return {
    isWorkspaceReady,
    authDetails,
    workspaceInfos,
    addressBookInfos,
    isSignInpage,
    tokensUSD,
  };
};

export { useWorkspaceDetails };
