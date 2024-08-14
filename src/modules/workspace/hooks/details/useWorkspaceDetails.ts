import { useAuth } from '@/modules/auth';
import { useWorkspace } from '../useWorkspace';
import { useAddressBook } from '@/modules';
import { useTokensUSDAmountRequest } from '@/modules/home/hooks/useTokensUSDAmountRequest';
import { currentPath } from '@/utils';
import { useTransactionsContext } from '@/modules/transactions/providers/TransactionsProvider';
import { useGitLoadingRequest } from '../useGifLoadingRequest';

const useWorkspaceDetails = () => {
  const { isSignInpage } = currentPath();

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
  } = useTransactionsContext();

  const {
    isLoading: isGifAnimationLoading,
    refetch: invalidateGifAnimationRequest,
  } = useGitLoadingRequest();
  const tokensUSD = useTokensUSDAmountRequest();
  const authDetails = useAuth();
  const {
    handlers: { hasPermission, ...handlersData },
    requests: { workspaceBalance, latestPredicates, ...requestsData },
    ...rest
  } = useWorkspace(
    authDetails.userInfos,
    invalidateGifAnimationRequest,
    invalidateAllTransactionsTypeFilters,
  );
  const addressBookInfos = useAddressBook(authDetails, hasPermission);

  const isFilteringInProgress =
    (isHomeFetching || isTransactionsPageListFetching) &&
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
        !authDetails.userInfos.isLoading) || isFilteringInProgress;

  return {
    isWorkspaceReady,
    isFilteringInProgress,
    authDetails,
    workspaceInfos: {
      handlers: { hasPermission, ...handlersData },
      requests: { workspaceBalance, latestPredicates, ...requestsData },
      ...rest,
    },
    addressBookInfos,
    tokensUSD,
    invalidateGifAnimationRequest,
  };
};

export { useWorkspaceDetails };
