export type IUseIsFilteringInProgress = {
  isGifAnimationLoading: boolean;
  isHomeFetching: boolean;
  isTransactionsPageListFetching: boolean;
  isVaultTransactionsFetching: boolean;
};

export const useIsFilteringInProgress = ({
  isGifAnimationLoading,
  isHomeFetching,
  isTransactionsPageListFetching,
  isVaultTransactionsFetching,
}: IUseIsFilteringInProgress) => {
  const isSomeTxListFetching =
    isHomeFetching ||
    isTransactionsPageListFetching ||
    isVaultTransactionsFetching;

  const isFilteringInProgress = isSomeTxListFetching && !isGifAnimationLoading;

  return isFilteringInProgress;
};
