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
    homeTransactions: {
      request: { isLoading: isHomeRequestLoading },
    },
    meTransactions: {
      request: { isLoading: isMeTransactionsLoading },
    },
    transactionsPageList: {
      request: { isLoading: isTransactionsPageListLoading },
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
  } = useWorkspace(authDetails.userInfos, invalidateGifAnimationRequest);
  const addressBookInfos = useAddressBook(authDetails, hasPermission);

  const isWorkspaceReady = isSignInpage
    ? true
    : !latestPredicates.isLoading &&
      !worksapceBalance.isLoading &&
      !addressBookInfos.requests.listContactsRequest.isLoading &&
      // The transactions laoding is commented out because it's trigged when use the filters
      !isHomeRequestLoading &&
      !isMeTransactionsLoading &&
      !isTransactionsPageListLoading &&
      !isGifAnimationLoading &&
      !authDetails.userInfos.isLoading;

  return {
    isWorkspaceReady,
    authDetails,
    workspaceInfos: {
      handlers: { hasPermission, ...handlersData },
      requests: { worksapceBalance, latestPredicates, ...requestsData },
      ...rest,
    },
    addressBookInfos,
    tokensUSD,
  };
};

export { useWorkspaceDetails };
