export type IUseIsFilteringInProgress = {
  isGifAnimationLoading: boolean;
  isTransactionsPageListFetching: boolean;
  isVaultTransactionsFetching: boolean;
};

export const useIsFilteringInProgress = ({
  isGifAnimationLoading,
  isTransactionsPageListFetching,
  isVaultTransactionsFetching,
}: IUseIsFilteringInProgress) => {
  const isSomeTxListFetching =
    isTransactionsPageListFetching || isVaultTransactionsFetching;

  const isFilteringInProgress = isSomeTxListFetching && !isGifAnimationLoading;

  return isFilteringInProgress;
};
