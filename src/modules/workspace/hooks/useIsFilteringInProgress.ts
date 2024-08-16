import { useTransactionsContext } from '@/modules/transactions/providers/TransactionsProvider';

export type IUseIsFilteringInProgress = {
  isGifAnimationLoading: boolean;
};

export const useIsFilteringInProgress = ({
  isGifAnimationLoading,
}: IUseIsFilteringInProgress) => {
  const {
    homeTransactions: {
      request: { isFetching: isHomeFetching },
    },
    transactionsPageList: {
      request: { isFetching: isTransactionsPageListFetching },
    },
    vaultTransactions: {
      request: { isFetching: isVaultTransactionsFetching },
    },
  } = useTransactionsContext();

  const isFilteringInProgress =
    (isHomeFetching ||
      isTransactionsPageListFetching ||
      isVaultTransactionsFetching) &&
    !isGifAnimationLoading;

  return isFilteringInProgress;
};
