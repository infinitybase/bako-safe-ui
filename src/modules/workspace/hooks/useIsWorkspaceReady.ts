import { useTransactionsContext } from '@/modules/transactions/providers/TransactionsProvider';
import { currentPath } from '@/utils';

import { useIsFilteringInProgress } from './useIsFilteringInProgress';

export type IUseIsWorkspaceReady = {
  isGifAnimationLoading: boolean;
  isUserInfosLoading: boolean;
  isVaultRequestLoading: boolean;
  isVaultAssetsLoading: boolean;
  isAddressbookInfosLoading: boolean;
  isLatestsPredicatesLoading: boolean;
  isWorkspaceBalanceLoading: boolean;
  isTokenExpired: boolean;
};

export const useIsWorkspaceReady = ({
  isAddressbookInfosLoading,
  isGifAnimationLoading,
  isLatestsPredicatesLoading,
  isUserInfosLoading,
  isVaultAssetsLoading,
  isVaultRequestLoading,
  isWorkspaceBalanceLoading,
  isTokenExpired,
}: IUseIsWorkspaceReady) => {
  const { isSignInpage, isFromDapp } = currentPath();

  const {
    homeTransactions: {
      request: { isLoading: isHomeRequestLoading },
    },
    transactionsPageList: {
      request: {
        isLoading: isTransactionsPageListLoading,
        isFetching: isTransactionsPageListFetching,
      },
    },
    vaultTransactions: {
      request: {
        isLoading: isVaultTransactionsLoading,
        isFetching: isVaultTransactionsFetching,
      },
    },
  } = useTransactionsContext();

  const isFilteringInProgress = useIsFilteringInProgress({
    isGifAnimationLoading,
    isTransactionsPageListFetching,
    isVaultTransactionsFetching,
  });

  if (
    (isSignInpage && !isTokenExpired) ||
    (isFilteringInProgress && !isFromDapp)
  ) {
    return { isWorkspaceReady: true, isFilteringInProgress };
  }

  const loadingConditions = [
    isAddressbookInfosLoading,
    isGifAnimationLoading,
    isLatestsPredicatesLoading,
    isUserInfosLoading,
    isVaultAssetsLoading,
    isVaultRequestLoading,
    isWorkspaceBalanceLoading,
    isHomeRequestLoading,
    isTransactionsPageListLoading,
    isVaultTransactionsLoading,
  ];

  const isWorkspaceReady = !loadingConditions.some((condition) => condition);

  return { isWorkspaceReady, isFilteringInProgress };
};
