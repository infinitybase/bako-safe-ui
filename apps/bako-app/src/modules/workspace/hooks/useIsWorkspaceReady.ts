import { useTransactionsContext } from '@/modules/transactions/providers/TransactionsProvider';
import { currentPath } from '@/utils';

import { useIsFilteringInProgress } from './useIsFilteringInProgress';

export type IUseIsWorkspaceReady = {
  isGifAnimationLoading: boolean;
  isUserInfosLoading: boolean;
  isVaultRequestLoading: boolean;
  isVaultAssetsLoading: boolean;
  isUserVaultsLoading: boolean;
  isAddressbookInfosLoading: boolean;
  isLatestsPredicatesLoading: boolean;
  isWorkspaceBalanceLoading: boolean;
  isTokenExpired: boolean;
  isFuelTokensLoading: boolean;
};

export const useIsWorkspaceReady = ({
  isUserVaultsLoading,
  isAddressbookInfosLoading,
  isGifAnimationLoading,
  isLatestsPredicatesLoading,
  isUserInfosLoading,
  isVaultAssetsLoading,
  isVaultRequestLoading,
  isTokenExpired,
  isFuelTokensLoading,
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
    isFuelTokensLoading,
    isUserVaultsLoading,
    isAddressbookInfosLoading,
    isGifAnimationLoading,
    isLatestsPredicatesLoading,
    isUserInfosLoading,
    isVaultAssetsLoading,
    isVaultRequestLoading,
    isHomeRequestLoading,
    isTransactionsPageListLoading,
    isVaultTransactionsLoading,
  ];

  const isWorkspaceReady = !loadingConditions.some((condition) => condition);

  return { isWorkspaceReady, isFilteringInProgress };
};
