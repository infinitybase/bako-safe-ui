import { TransactionStatus } from 'bsafe';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate, useParams } from 'react-router-dom';

import {
  useFuelAccount,
  useTransactionListPaginationRequest,
  useVaultAssets,
  useVaultDetailsRequest,
} from '@/modules';

import { useTransactionState } from '../../states';

export enum StatusFilter {
  ALL = '',
  PENDING = TransactionStatus.AWAIT_REQUIREMENTS,
  COMPLETED = TransactionStatus.SUCCESS,
  DECLINED = TransactionStatus.DECLINED,
}

const useTransactionList = (allFromUser = false) => {
  const params = useParams<{ vaultId: string }>();
  const navigate = useNavigate();
  const inView = useInView();
  const { account } = useFuelAccount();
  const [filter, setFilter] = useState<StatusFilter | undefined>(
    StatusFilter.ALL,
  );
  const { selectedTransaction, setSelectedTransaction } = useTransactionState();

  const vaultRequest = useVaultDetailsRequest(params.vaultId!);
  const vaultAssets = useVaultAssets(vaultRequest.predicateInstance);
  const transactionRequest = useTransactionListPaginationRequest({
    predicateId: params.vaultId ? [params.vaultId] : undefined,
    ...(allFromUser ? { allOfUser: true } : {}),
    ...(selectedTransaction?.id ? { id: selectedTransaction.id } : {}),
    /* TODO: Change logic this */
    status: filter ? [filter] : undefined,
  });

  useEffect(() => {
    if (selectedTransaction.id) setFilter(undefined);

    if (inView.inView && !transactionRequest.isFetching) {
      transactionRequest.fetchNextPage();
    }
  }, [inView.inView]);

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
  };
};

export { useTransactionList };
