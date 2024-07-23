import { useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { useAuthStore } from '@/modules/auth/store';
import { useTransactionsSignaturePending } from '@/modules/transactions/hooks/list';

import { useVaultAssets } from '../assets';
import { useVaultDetailsRequest } from '../details';
import { useVaultTransactionsRequest } from './useVaultTransactionsRequest';
import { useGetParams } from '@/modules/core';
import { useFilterTxType } from '@/modules/transactions/hooks/filter';

const useVaultDetails = () => {
  const [byMonth, setByMonth] = useState(false);

  const { txFilterType, handleIncomingAction, handleOutgoingAction } =
    useFilterTxType();
  const {
    vaultPageParams: { vaultId },
  } = useGetParams();
  const { account } = useAuthStore();

  const { predicateInstance, ...rest } = useVaultDetailsRequest(vaultId!);
  const pendingSignerTransactions = useTransactionsSignaturePending([vaultId!]);
  const vaultTransactionsRequest = useVaultTransactionsRequest(
    predicateInstance!,
    byMonth,
    txFilterType,
  );

  const assets = useVaultAssets(predicateInstance);

  return {
    vault: {
      predicateInstance,
      ...rest,
    },
    transactions: {
      ...vaultTransactionsRequest,
      byMonth,
      setByMonth,
      txFilterType,
      handleIncomingAction,
      handleOutgoingAction,
    },
    assets,
    account,
    inView: useInView(),
    pendingSignerTransactions,
    isPendingSigner:
      pendingSignerTransactions.data?.transactionsBlocked ?? false,
  };
};

export type UseVaultDetailsReturn = ReturnType<typeof useVaultDetails>;

export { useVaultDetails };
