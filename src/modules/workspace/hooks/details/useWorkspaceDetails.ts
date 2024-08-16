import { useAuth } from '@/modules/auth';
import { useWorkspace } from '../useWorkspace';
import {
  useAddressBook,
  useGetParams,
  useVaultAssets,
  useVaultByIdRequest,
} from '@/modules';
import { useTokensUSDAmountRequest } from '@/modules/home/hooks/useTokensUSDAmountRequest';
import { currentPath } from '@/utils';
import { useTransactionsContext } from '@/modules/transactions/providers/TransactionsProvider';
import { useGitLoadingRequest } from '../useGifLoadingRequest';

const useWorkspaceDetails = () => {
  const authDetails = useAuth();
  const { isSignInpage } = currentPath();
  const {
    vaultPageParams: { vaultId },
  } = useGetParams();

  const vaultRequest = useVaultByIdRequest(vaultId ?? '');
  const vaultAssets = useVaultAssets(
    authDetails.userInfos.workspace?.id,
    vaultId ?? '',
  );

  const {
    invalidateAllTransactionsTypeFilters,
    homeTransactions: {
      request: { isLoading: isHomeRequestLoading, isFetching: isHomeFetching },
    },
    transactionsPageList: {
      request: {
        isLoading: isTransactionsPageListLoading,
        isFetching: isTransactionsPageListFetching,
      },
    },
    pendingSignerTransactions: { refetch: refetchPendingSingerTransactions },
    vaultTransactions: {
      request: {
        isLoading: isVaultTransactionsLoading,
        isFetching: isVaultTransactionsFetching,
      },
    },
  } = useTransactionsContext();

  const {
    isLoading: isGifAnimationLoading,
    refetch: invalidateGifAnimationRequest,
  } = useGitLoadingRequest();

  const tokensUSD = useTokensUSDAmountRequest();

  const {
    handlers: { hasPermission, ...handlersData },
    requests: { workspaceBalance, latestPredicates, ...requestsData },
    ...rest
  } = useWorkspace(
    authDetails.userInfos,
    invalidateGifAnimationRequest,
    invalidateAllTransactionsTypeFilters,
    refetchPendingSingerTransactions,
  );

  const addressBookInfos = useAddressBook(authDetails, hasPermission);

  const isFilteringInProgress =
    (isHomeFetching ||
      isTransactionsPageListFetching ||
      isVaultTransactionsFetching) &&
    !isGifAnimationLoading;

  const isWorkspaceReady =
    (isSignInpage
      ? true
      : !latestPredicates.isLoading &&
        !workspaceBalance.isLoading &&
        !addressBookInfos.requests.listContactsRequest.isLoading &&
        !isHomeRequestLoading &&
        !isTransactionsPageListLoading &&
        !isGifAnimationLoading &&
        !authDetails.userInfos.isLoading &&
        !vaultRequest.isLoading &&
        !vaultAssets.isLoading &&
        !isVaultTransactionsLoading) || isFilteringInProgress;

  return {
    isWorkspaceReady,
    isFilteringInProgress,
    authDetails,
    workspaceInfos: {
      handlers: { hasPermission, ...handlersData },
      requests: { workspaceBalance, latestPredicates, ...requestsData },
      ...rest,
    },
    vaultDetails: {
      vaultRequest,
      assets: vaultAssets,
    },
    addressBookInfos,
    tokensUSD,
    invalidateGifAnimationRequest,
  };
};

export { useWorkspaceDetails };
