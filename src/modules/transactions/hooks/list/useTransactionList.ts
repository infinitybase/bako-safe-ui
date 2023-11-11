import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate, useParams } from 'react-router-dom';

import {
  useFuelAccount,
  useTransactionListPaginationRequest,
  useVaultAssets,
  useVaultDetailsRequest,
} from '@/modules';
import { TransactionStatus } from '@/modules/core';

export enum StatusFilter {
  ALL = '',
  PENDING = TransactionStatus.AWAIT,
  COMPLETED = TransactionStatus.DONE,
  DECLINED = TransactionStatus.REJECTED,
}

const useTransactionList = (allFromUser = false) => {
  const params = useParams<{ vaultId: string }>();
  const navigate = useNavigate();
  const inView = useInView();
  const { account } = useFuelAccount();

  const [filter, setFilter] = useState<StatusFilter>(StatusFilter.ALL);

  const vaultRequest = useVaultDetailsRequest(params.vaultId!);
  const vaultAssets = useVaultAssets(vaultRequest.predicate?.predicateInstance);
  const transactionRequest = useTransactionListPaginationRequest({
    predicateId: params.vaultId ? [params.vaultId] : undefined,
    ...(allFromUser ? { allOfUser: true } : {}),
    /* TODO: Change logic this */
    status: filter ? [filter] : undefined,
  });

  useEffect(() => {
    if (inView.inView && !transactionRequest.isFetching) {
      transactionRequest.fetchNextPage();
    }
  }, [inView.inView]);

  return {
    transactionRequest,
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
  };
};

export { useTransactionList };
