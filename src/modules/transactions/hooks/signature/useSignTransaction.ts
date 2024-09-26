import { TransactionStatus } from 'bakosafe';
import { randomBytes } from 'ethers';
import { useState } from 'react';

import { queryClient } from '@/config';
import { CookieName, CookiesConfig } from '@/config/cookies';
import { useContactToast } from '@/modules/addressBook/hooks/useContactToast';
import { useWalletSignMessage } from '@/modules/core';
import { ITransaction } from '@/modules/core/hooks/bakosafe/utils/types';
import { VAULT_TRANSACTIONS_LIST_PAGINATION } from '@/modules/vault/hooks/list/useVaultTransactionsRequest';

import { useTransactionToast } from '../../providers/toast';
import {
  IPendingTransactionDetails,
  IPendingTransactionsRecord,
  IUseTransactionList,
} from '../list';
import { useSendTransaction } from '../send/useSendTransaction';
import { useSignTransactionRequest } from './useSignTransactionRequest';

export interface SignTransactionParams {
  txId: string;
  transactionID: string;
  predicateID: string;
}

export interface UseSignTransactionOptions {
  transaction: ITransaction;
}

interface IUseSignTransactionProps {
  transactionList: IUseTransactionList;
  pendingSignerTransactionsRefetch: () => void;
  homeTransactionsRefetch: () => void;
  pendingTransactions: IPendingTransactionsRecord;
}

const useSignTransaction = ({
  transactionList,
  pendingSignerTransactionsRefetch,
  homeTransactionsRefetch,
  pendingTransactions,
}: IUseSignTransactionProps) => {
  const {
    request: { refetch: transactionsPageRefetch },
  } = transactionList;
  const [selectedTransaction, setSelectedTransaction] =
    useState<IPendingTransactionDetails>();

  const toast = useTransactionToast();
  const { warningToast } = useContactToast();
  const { executeTransaction } = useSendTransaction({
    onTransactionSuccess: () => {
      transactionsPageRefetch();
      pendingSignerTransactionsRefetch();
      homeTransactionsRefetch();
      queryClient.invalidateQueries({
        queryKey: [VAULT_TRANSACTIONS_LIST_PAGINATION],
      });
    },
  });

  const signMessageRequest = useWalletSignMessage({
    onError: () => {
      warningToast({
        title: 'Signature failed',
        description: 'Please try again!',
      });
    },
  });

  const request = useSignTransactionRequest({
    onSuccess: async () => {
      transactionsPageRefetch();
      homeTransactionsRefetch();
      queryClient.invalidateQueries({
        queryKey: [VAULT_TRANSACTIONS_LIST_PAGINATION],
      });
    },
    onError: () => {
      toast.generalError(randomBytes.toString(), 'Invalid signature');
    },
  });

  const confirmTransaction = async (
    selectedTransactionId: string,
    callback?: () => void,
    transactionInformations?: IPendingTransactionDetails,
  ) => {
    const transaction = transactionInformations
      ? transactionInformations
      : pendingTransactions?.[selectedTransactionId];

    setSelectedTransaction(transaction);

    const signedMessage = await signMessageRequest.mutateAsync(
      transaction?.hash,
    );

    await request.mutateAsync(
      {
        account: CookiesConfig.getCookie(CookieName.ADDRESS),
        confirm: true,
        signer: signedMessage,
        id: transaction?.id,
      },
      {
        onSuccess: async () => {
          executeTransaction(transaction);
          callback && callback();
        },
      },
    );
  };

  const retryTransaction = async () => {
    return executeTransaction(selectedTransaction!);
  };

  const declineTransaction = async (transactionId: string) => {
    await request.mutateAsync({
      id: transactionId,
      confirm: false,
      account: CookiesConfig.getCookie(CookieName.ADDRESS),
    });
    transactionsPageRefetch();
    pendingSignerTransactionsRefetch();
    homeTransactionsRefetch();
    queryClient.invalidateQueries({
      queryKey: [VAULT_TRANSACTIONS_LIST_PAGINATION],
    });
  };

  return {
    confirmTransaction,
    retryTransaction,
    declineTransaction,
    isLoading:
      request.isPending ||
      signMessageRequest.isPending ||
      selectedTransaction?.status === TransactionStatus.PROCESS_ON_CHAIN ||
      selectedTransaction?.status === TransactionStatus.PENDING_SENDER,
    isSuccess: request.isSuccess,
    selectedTransaction,
  };
};

export { useSignTransaction };
