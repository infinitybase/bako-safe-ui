import { useDisclosure } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate, useParams } from 'react-router-dom';

import { useAuthStore } from '@/modules/auth/store';
import { PredicateWithWorkspace } from '@/modules/core/models/predicate';
import { useTransactionsSignaturePending } from '@/modules/transactions/hooks/list';
import { useVaultState } from '@/modules/vault/states';

import { useVaultAssets } from '../assets';
import { useVaultDetailsRequest } from '../details';
import { useVaultTransactionsRequest } from './useVaultTransactionsRequest';
import { ITransactionsGroupedByMonth } from '@/modules/transactions/services';
import { IPagination } from '@/modules/core';
import { TransactionType } from 'bakosafe';

interface IUseVaultDetails {
  byMonth?: boolean;
  txFilterType?: TransactionType;
}

const useVaultDetails = ({
  byMonth = false,
  txFilterType,
}: IUseVaultDetails = {}) => {
  const navigate = useNavigate();
  const params = useParams<{ workspaceId: string; vaultId: string }>();
  const { account } = useAuthStore();
  const store = useVaultState();
  const inView = useInView();
  const menuDrawer = useDisclosure();

  const { predicate, predicateInstance, isLoading, isFetching } =
    useVaultDetailsRequest(params.vaultId!);
  const vaultTransactionsRequest = useVaultTransactionsRequest(
    predicateInstance!,
    byMonth,
    txFilterType,
  );

  const pendingSignerTransactions = useTransactionsSignaturePending([
    params.vaultId!,
  ]);

  useMemo(() => {
    pendingSignerTransactions.refetch();
  }, [predicate, params]);

  const {
    assets,
    ethBalance,
    isLoading: isLoadingAssets,
    hasBalance,
    hasAssets,
    refetch,
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
          vaultTransactionsRequest.transactions as unknown as IPagination<ITransactionsGroupedByMonth>,
        loadingVaultTransactions: vaultTransactionsRequest.isLoading,
        isPendingSigner:
          pendingSignerTransactions.data?.transactionsBlocked ?? false,
      },
    },
    assets: {
      hasAssets,
      isLoadingAssets,
      ethBalance,
      value: assets,
      refetchBalance: refetch,
    },
    inView,
    navigate,
    account,
    store,
    params,
    pendingSignerTransactions,
    menuDrawer,
  };
};

export type UseVaultDetailsReturn = ReturnType<typeof useVaultDetails>;

export { useVaultDetails };
