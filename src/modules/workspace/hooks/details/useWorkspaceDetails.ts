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

    return () => {
      clearTimeout(timer);
      setShowWorkspace(false);
    };
  }, [
    workspaceInfos.latestPredicates.isLoading,
    workspaceInfos.worksapceBalance.isLoading,
    addressBookInfos.requests.listContactsRequest.isLoading,
  ]);

  const isWorkspaceReady = isSignInpage
    ? true
    : !addressBookInfos.requests.listContactsRequest.isLoading &&
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
