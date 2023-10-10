import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate, useParams } from 'react-router-dom';

import { useVaultAssets, useVaultDetailsRequest } from '@/modules';
import { TransactionStatus } from '@/modules/core';
import { useTransactionListRequest } from '@/modules/transactions/hooks';

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

  const transactionRequest = useTransactionListRequest(params.vaultId!);
  const vaultRequest = useVaultDetailsRequest(params.vaultId!);
  const vaultAssets = useVaultAssets(vaultRequest.predicate?.predicateInstance);

  return {
    transactionRequest: {
      ...transactionRequest,
      transactions: transactionRequest.data,
    },
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
