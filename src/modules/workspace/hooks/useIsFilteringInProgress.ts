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
  const isFilteringInProgress =
    (isHomeFetching ||
      isTransactionsPageListFetching ||
      isVaultTransactionsFetching) &&
    !isGifAnimationLoading;

  return isFilteringInProgress;
};
