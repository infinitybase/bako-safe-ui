import { useEffect, useState } from 'react';

import { queryClient, setupAxiosInterceptors } from '@/config';
import {
  useAddressBook,
  useAuthUrlParams,
  useGetParams,
  useGetWorkspaceRequest,
  useScreenSize,
  useUserVaults,
  useVaultAssets,
  useVaultByIdRequest,
} from '@/modules';
import { useAuth } from '@/modules/auth';
import { useTokensUSDAmountRequest } from '@/modules/home/hooks/useTokensUSDAmountRequest';
import { useTransactionsContext } from '@/modules/transactions/providers/TransactionsProvider';

import { useGifLoadingRequest } from '../useGifLoadingRequest';
import { useIsWorkspaceReady } from '../useIsWorkspaceReady';
import { useWorkspace } from '../useWorkspace';

const useWorkspaceDetails = () => {
  const [isTokenExpired, setIsTokenExpired] = useState(false);
  const screenSizes = useScreenSize();

  const authDetails = useAuth();
  const { isTxFromDapp } = useAuthUrlParams();
  const {
    vaultPageParams: { vaultId },
  } = useGetParams();

  const {
    resetAllTransactionsTypeFilters,
    pendingSignerTransactions: { refetch: refetchPendingSingerTransactions },
    transactionsPageList: {
      request: { refetch: refetchTransactions },
    },
  } = useTransactionsContext();

  const {
    isLoading: isGifAnimationLoading,
    refetch: invalidateGifAnimationRequest,
  } = useGifLoadingRequest();

  useEffect(() => {
    setupAxiosInterceptors({
      isTxFromDapp,
      isTokenExpired,
      setIsTokenExpired,
      logout: authDetails.handlers.logout,
    });
  }, []);

  const {
    handlers: { hasPermission, ...handlersData },
    requests: { workspaceBalance, latestPredicates, ...requestsData },
    ...rest
  } = useWorkspace(
    authDetails.userInfos,
    invalidateGifAnimationRequest,
    resetAllTransactionsTypeFilters,
    refetchPendingSingerTransactions,
  );

  const { workspace: currentWorkspace, ...currentWorkspaceData } =
    useGetWorkspaceRequest(authDetails.userInfos.workspace?.id);

  const tokensUSD = useTokensUSDAmountRequest();
  const userVaults = useUserVaults(authDetails.userInfos.address);
  const addressBookInfos = useAddressBook(authDetails, hasPermission);
  const vaultRequest = useVaultByIdRequest(vaultId ?? '');
  const vaultAssets = useVaultAssets(
    authDetails.userInfos.workspace?.id,
    vaultId ?? '',
  );

  const resetHomeRequests = () => {
    // invalidateGifAnimationRequest();
    // refetchPendingSingerTransactions();
    // resetAllTransactionsTypeFilters();
    // refetchTransactions();
    // addressBookInfos.requests.listContactsRequest.refetch();
    // tokensUSD.refetch();
    // latestPredicates.refetch();
    // authDetails.userInfos.refetch();
    // userVaults.request.refetch();
    queryClient.clear();
  };

  const { isWorkspaceReady, isFilteringInProgress } = useIsWorkspaceReady({
    isUserVaultsLoading: userVaults.request.isLoading,
    isAddressbookInfosLoading:
      addressBookInfos.requests.listContactsRequest.isLoading,
    isGifAnimationLoading,
    isLatestsPredicatesLoading: latestPredicates.isLoading,
    isUserInfosLoading: authDetails.userInfos.isLoading,
    isVaultAssetsLoading: vaultAssets.isLoading,
    isVaultRequestLoading: vaultRequest.isLoading,
    isWorkspaceBalanceLoading: workspaceBalance.isLoading,
    isTokenExpired,
  });

  return {
    isWorkspaceReady,
    isFilteringInProgress,
    authDetails,
    workspaceInfos: {
      currentWorkspaceRequest: {
        currentWorkspace,
        ...currentWorkspaceData,
      },
      handlers: { hasPermission, ...handlersData },
      requests: { workspaceBalance, latestPredicates, ...requestsData },
      ...rest,
    },
    vaultDetails: {
      vaultRequest,
      assets: vaultAssets,
    },
    userVaults,
    addressBookInfos,
    tokensUSD,
    invalidateGifAnimationRequest,
    screenSizes,
    resetHomeRequests,
  };
};

export { useWorkspaceDetails };
