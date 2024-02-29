import { TransactionStatus } from 'bsafe';
import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate, useParams } from 'react-router-dom';

import { useAuthStore } from '@/modules/auth/store';
import { useVaultAssets, useVaultDetailsRequest } from '@/modules/vault/hooks';

import { useTransactionState } from '../../states';
import { useTransactionsSignaturePending } from './useTotalSignaturesPendingRequest';
import { useTransactionListPaginationRequest } from './useTransactionListPaginationRequest';

export enum StatusFilter {
  ALL = '',
  PENDING = TransactionStatus.AWAIT_REQUIREMENTS,
  COMPLETED = TransactionStatus.SUCCESS,
  DECLINED = TransactionStatus.DECLINED,
}

const useTransactionList = () => {
  const params = useParams<{ vaultId: string }>();
  const navigate = useNavigate();
  const inView = useInView();
  const { account } = useAuthStore();
  const [filter, setFilter] = useState<StatusFilter>(StatusFilter.ALL);
  const { selectedTransaction, setSelectedTransaction } = useTransactionState();

  const pendingSignerTransactions = useTransactionsSignaturePending([
    params.vaultId!,
  ]);
  const vaultRequest = useVaultDetailsRequest(params.vaultId!);
  const vaultAssets = useVaultAssets(vaultRequest.predicateInstance);
  const transactionRequest = useTransactionListPaginationRequest({
    predicateId: params.vaultId ? [params.vaultId] : undefined,
    ...(selectedTransaction?.id ? { id: selectedTransaction.id } : {}),
    /* TODO: Change logic this */
    status: filter ? [filter] : undefined,
  });
  // // const { homeRequest } = useHome();
  // const [firstRender, setFirstRender] = useState<boolean>(true);
  // const [hasSkeleton, setHasSkeleton] = useState<boolean>(false);

  // useMemo(() => {
  //   if (firstRender && transactionRequest.status === 'loading') {
  //     setHasSkeleton(true);
  //     setFirstRender(false);
  //   }

  //   if (!firstRender && transactionRequest.status === 'success') {
  //     setHasSkeleton(false);
  //   }
  // }, [transactionRequest.status]);

  // useEffect(() => {
  //   if (selectedTransaction.id) setFilter(undefined);

  //   if (
  //     inView.inView &&
  //     !transactionRequest.isFetching &&
  //     transactionRequest.hasNextPage
  //   ) {
  //     transactionRequest.fetchNextPage();
  //   }
  // }, [
  //   inView.inView,
  //   transactionRequest.isFetching,
  //   transactionRequest.hasNextPage,
  // ]);

  return {
    transactionRequest,
    selectedTransaction,
    setSelectedTransaction,
    vaultRequest: vaultRequest,
    vaultAssets,
    navigate,
    params,
    filter: {
      set: setFilter,
      value: filter,
    },
    inView,
    account,
    defaultIndex: selectedTransaction?.id ? [0] : [],
    pendingSignerTransactions,
    hasSkeleton: false,
  };
};

export { useTransactionList };
