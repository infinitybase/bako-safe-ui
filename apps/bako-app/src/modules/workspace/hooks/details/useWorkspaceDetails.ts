import { BakoProvider } from 'bakosafe';
import { useMemo } from 'react';

import { queryClient } from '@/config';
import {
  assetsMapFromFormattedFn,
  useAddressBook,
  useGetParams,
  useGetWorkspaceRequest,
  useScreenSize,
  useUserVaults,
  useVaultAssets,
  useVaultByIdRequest,
} from '@/modules';
import { useAuthContext } from '@/modules/auth/AuthProvider';
import { useTokensUSDAmountRequest } from '@/modules/home/hooks/useTokensUSDAmountRequest';
import { useNetworks } from '@/modules/network/hooks';

import { ProviderInstance } from '../../utils/provider';
import { useGetFuelsTokensListRequest } from '../useGetFuelsTokensListRequest';
import { useGifLoadingRequest } from '../useGifLoadingRequest';
import { useIsWorkspaceReady } from '../useIsWorkspaceReady';
import { useWorkspace } from '../useWorkspace';

const useWorkspaceDetails = () => {
  const { fuelsTokens, isLoading: isFuelTokensLoading } =
    useGetFuelsTokensListRequest();

  const authDetails = useAuthContext();

  const assetsMap = assetsMapFromFormattedFn(fuelsTokens);

  const screenSizes = useScreenSize();

  const {
    vaultPageParams: { vaultId },
  } = useGetParams();

  const { currentNetwork } = useNetworks();

  const providerInstance = useMemo<Promise<BakoProvider>>(async () => {
    const provider = await ProviderInstance.create(currentNetwork.url);

    return provider.instance;
  }, [currentNetwork]);

  // const {
  //   resetAllTransactionsTypeFilters,
  //   pendingSignerTransactions: { refetch: refetchPendingSingerTransactions },
  // } = useTransactionsContext();

  const {
    isLoading: isGifAnimationLoading,
    refetch: invalidateGifAnimationRequest,
  } = useGifLoadingRequest();

  const {
    handlers: { hasPermission, ...handlersData },
    requests: { workspaceBalance, latestPredicates, ...requestsData },
    ...rest
  } = useWorkspace(
    authDetails.userInfos,
    assetsMap,
    invalidateGifAnimationRequest,
    // resetAllTransactionsTypeFilters,
    // refetchPendingSingerTransactions,
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
    assetsMap,
  );

  const resetHomeRequests = () => {
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
    isTokenExpired: authDetails.handlers.isTokenExpired,
    isFuelTokensLoading,
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
    providerInstance,
    userVaults,
    addressBookInfos,
    tokensUSD,
    fuelsTokens,
    assetsMap,
    invalidateGifAnimationRequest,
    screenSizes,
    resetHomeRequests,
  };
};

export { useWorkspaceDetails };
