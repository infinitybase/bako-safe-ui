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
    meTransactions: {
      request: {
        isLoading: isPredicateTransactionLoading,
        isFetching: isPredicateFetching,
      },
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
    requests: { worksapceBalance, latestPredicates, ...requestsData },
    ...rest
  } = useWorkspace(
    authDetails.userInfos,
    invalidateGifAnimationRequest,
    invalidateAllTransactionsTypeFilters,
  );
  const addressBookInfos = useAddressBook(authDetails, hasPermission);

  const isFilteringInProgress =
    (isHomeFetching || isPredicateFetching || isTransactionsPageListFetching) &&
    !isGifAnimationLoading;

  const isWorkspaceReady =
    (isSignInpage
      ? true
      : !latestPredicates.isLoading &&
        !worksapceBalance.isLoading &&
        !addressBookInfos.requests.listContactsRequest.isLoading &&
        !isHomeRequestLoading &&
        !isPredicateTransactionLoading &&
        !isTransactionsPageListLoading &&
        !isGifAnimationLoading &&
        !authDetails.userInfos.isLoading) || isFilteringInProgress;

  return {
    isWorkspaceReady,
    isFilteringInProgress,
    authDetails,
    workspaceInfos: {
      handlers: { hasPermission, ...handlersData },
      requests: { worksapceBalance, latestPredicates, ...requestsData },
      ...rest,
    },
    addressBookInfos,
    tokensUSD,
    invalidateGifAnimationRequest,
  };
};

export { useWorkspaceDetails };
