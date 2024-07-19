import { useDisclosure } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/modules/auth/store';
import { PredicateWithWorkspace } from '@/modules/core/models/predicate';
import { useTransactionsSignaturePending } from '@/modules/transactions/hooks/list';

import { useVaultAssets } from '../assets';
import { useVaultDetailsRequest } from '../details';
import { useVaultTransactionsRequest } from './useVaultTransactionsRequest';
import { ITransactionsGroupedByMonth } from '@/modules/transactions/services';
import { IPagination } from '@/modules/core';
import { TransactionType } from 'bakosafe';

interface IUseVaultDetails {
  byMonth?: boolean;
  txFilterType?: TransactionType;
  vaultId: string;
  workspaceId: string;
}

const useVaultDetails = ({
  byMonth = false,
  txFilterType,
  vaultId,
  workspaceId,
}: IUseVaultDetails) => {
  const navigate = useNavigate();

  const params = {
    workspaceId,
    vaultId,
  };
  const { account } = useAuthStore();
  const inView = useInView();
  const menuDrawer = useDisclosure();

  const { predicate, predicateInstance, isLoading, isFetching } =
    useVaultDetailsRequest(vaultId);
  const vaultTransactionsRequest = useVaultTransactionsRequest(
    predicateInstance!,
    byMonth,
    txFilterType,
  );

  const pendingSignerTransactions = useTransactionsSignaturePending([vaultId]);

  // Foi comentando porque está causando infinite loop na requisição de pending. Tentei usando useEffect mas o resultado foi o mesmo

  // useMemo(() => {
  //   pendingSignerTransactions.refetch();
  // }, [predicate, params]);

  // useEffect(() => {
  //   if (predicate && params) {
  //     pendingSignerTransactions.refetch();
  //   }
  // }, [predicate, params, pendingSignerTransactions]);

  const {
    assets,
    ethBalance,
    isLoading: isLoadingAssets,
    hasBalance,
    hasAssets,
    refetch,
    balanceUSD,
    setVisibleBalance,
    visibleBalance,
    isFirstAssetsLoading,
    setIsFirstAssetsLoading,
    getCoinAmount,
    hasAssetBalance,
    getAssetInfo,
  } = useVaultAssets(predicateInstance);

  const configurable = useMemo(
    () => predicateInstance?.getConfigurable(),
    [predicateInstance],
  );

  const signersOrdination = useMemo(() => {
    if (!predicate) return [];

    return (
      predicate.addresses
        ?.map((address) => ({
          address,
          isOwner: address === predicate.owner.address,
        }))
        .sort((address) => (address.isOwner ? -1 : 0)) ?? []
    );
  }, [predicate]);

  return {
    vault: {
      ...(predicate as PredicateWithWorkspace),
      configurable,
      signers: signersOrdination,
      isLoading,
      isFetching,
      hasBalance,
      ethBalance,
      transactions: {
        ...vaultTransactionsRequest,
        vaultTransactions:
          vaultTransactionsRequest?.transactions as unknown as IPagination<ITransactionsGroupedByMonth>,
        loadingVaultTransactions: vaultTransactionsRequest?.isLoading,
        isPendingSigner:
          pendingSignerTransactions?.data?.transactionsBlocked ?? false,
      },
      predicateInstance,
    },
    assets: {
      hasAssets,
      isLoadingAssets,
      ethBalance,
      value: assets,
      refetchBalance: refetch,
      getCoinAmount,
      hasAssetBalance,
      getAssetInfo,
    },

    inView,
    navigate,
    account,
    store: {
      balanceUSD,
      setVisibleBalance,
      visibleBalance,
      isFirstAssetsLoading,
      setIsFirstAssetsLoading,
    },
    params,
    pendingSignerTransactions,
    menuDrawer,
  };
};

export type UseVaultDetailsReturn = ReturnType<typeof useVaultDetails>;

export { useVaultDetails };
