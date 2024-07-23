import { useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { useAuthStore } from '@/modules/auth/store';
import { useTransactionsSignaturePending } from '@/modules/transactions/hooks/list';

import { useVaultAssets } from '../assets';
import { useSidebar, useVaultDetailsRequest } from '../details';
import { useVaultTransactionsRequest } from './useVaultTransactionsRequest';
import { useGetParams } from '@/modules/core';
import { useFilterTxType } from '@/modules/transactions/hooks/filter';

const useVaultDetails = () => {
  const [byMonth, setByMonth] = useState(false);

  const { txFilterType, handleIncomingAction, handleOutgoingAction } =
    useFilterTxType();
  const {
    vaultPageParams: { vaultId, workspaceId },
  } = useGetParams();
  const { account } = useAuthStore();

  const { predicateInstance, ...rest } = useVaultDetailsRequest(vaultId!);
  const pendingSignerTransactions = useTransactionsSignaturePending([vaultId!]);
  const vaultTransactionsRequest = useVaultTransactionsRequest(
    predicateInstance!,
    byMonth,
    txFilterType,
  );
  const sideBarDetails = useSidebar({
    params: { vaultId: vaultId ?? '', workspaceId: workspaceId ?? '' },
  });

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
    sideBarDetails,
    assets,
    account,
    inView: useInView(),
    pendingSignerTransactions,
    isPendingSigner:
      pendingSignerTransactions.data?.transactionsBlocked ?? false,
    pendingSignerTransactionsLength:
      pendingSignerTransactions.data?.ofUser || 0,
  };
};

export type UseVaultDetailsReturn = ReturnType<typeof useVaultDetails>;

export { useVaultDetails };
