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
};

export const useIsWorkspaceReady = ({
  isAddressbookInfosLoading,
  isGifAnimationLoading,
  isLatestsPredicatesLoading,
  isUserInfosLoading,
  isVaultAssetsLoading,
  isVaultRequestLoading,
  isWorkspaceBalanceLoading,
}: IUseIsWorkspaceReady) => {
  const { isSignInpage } = currentPath();

  const {
    homeTransactions: {
      request: { isLoading: isHomeRequestLoading },
    },
    transactionsPageList: {
      request: { isLoading: isTransactionsPageListLoading },
    },
    vaultTransactions: {
      request: { isLoading: isVaultTransactionsLoading },
    },
  } = useTransactionsContext();

  const isFilteringInProgress = useIsFilteringInProgress({
    isGifAnimationLoading,
  });

  const isWorkspaceReady =
    (isSignInpage
      ? true
      : !isLatestsPredicatesLoading &&
        !isWorkspaceBalanceLoading &&
        !isAddressbookInfosLoading &&
        !isHomeRequestLoading &&
        !isTransactionsPageListLoading &&
        !isGifAnimationLoading &&
        !isUserInfosLoading &&
        !isVaultRequestLoading &&
        !isVaultAssetsLoading &&
        !isVaultTransactionsLoading) || isFilteringInProgress;

  return { isWorkspaceReady, isFilteringInProgress };
};
