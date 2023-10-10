import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate, useParams } from 'react-router-dom';

import {
  useTransactionListPaginationRequest,
  useVaultAssets,
  useVaultDetailsRequest,
} from '@/modules';
import { TransactionStatus } from '@/modules/core';

export enum StatusFilter {
  ALL = 'ALL',
  COMPLETED = TransactionStatus.DONE,
  DECLINED = 'DECLINE',
  PENDING = TransactionStatus.AWAIT,
}

const useTransactionList = () => {
  const params = useParams<{ vaultId: string }>();
  const navigate = useNavigate();
  const inView = useInView();

  const [filter, setFilter] = useState<StatusFilter>(StatusFilter.ALL);

  const transactionRequest = useTransactionListPaginationRequest({
    predicateId: params.vaultId,
    /* TODO: Change logic this */
    status: [filter],
  });
  const vaultRequest = useVaultDetailsRequest(params.vaultId!);
  const vaultAssets = useVaultAssets(vaultRequest.predicate?.predicateInstance);

  useEffect(() => {
    if (inView.inView) {
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
  };
};

export { useTransactionList };
