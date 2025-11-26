import { TransactionStatus } from 'bakosafe';
import { randomBytes } from 'ethers';
import { useState } from 'react';

import { queryClient } from '@/config';
import { CookieName, CookiesConfig } from '@/config/cookies';
import { useContactToast } from '@/modules/addressBook/hooks/useContactToast';
import { instantiateVault, jamMonitor, useWalletSignMessage } from '@/modules/core';
import { ITransaction } from '@/modules/core/hooks/bakosafe/utils/types';
import { VAULT_TRANSACTIONS_LIST_PAGINATION } from '@/modules/vault/hooks/list/useVaultTransactionsRequest';

import { useTransactionToast } from '../../providers/toast';
import { TransactionWithVault } from '../../services';
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
  pendingTransactions: IPendingTransactionsRecord;
  pendingSignerTransactionsRefetch: () => void;
  homeTransactionsRefetch: () => void;
  vaultBalanceRefetch: () => void;
}

const useSignTransaction = ({
  transactionList,
  pendingSignerTransactionsRefetch,
  homeTransactionsRefetch,
  pendingTransactions,
  vaultBalanceRefetch,
}: IUseSignTransactionProps) => {
  const {
    request: { refetch: transactionsPageRefetch },
  } = transactionList;
  const [selectedTransaction, setSelectedTransaction] =
    useState<IPendingTransactionDetails>();
  const [isSignConfirmed, setIsSignConfirmed] = useState(false);

  const toast = useTransactionToast();
  const { warningToast } = useContactToast();
  const { executeTransaction } = useSendTransaction({
    onTransactionSuccess: () => {
      transactionsPageRefetch();
      pendingSignerTransactionsRefetch();
      homeTransactionsRefetch();
      vaultBalanceRefetch();
      queryClient.invalidateQueries({
        queryKey: [VAULT_TRANSACTIONS_LIST_PAGINATION],
      });
      setIsSignConfirmed(false);
    },
  });

  const signMessageRequest = useWalletSignMessage({
    onError: (error) => {
      jamMonitor.walletSignError({
        error: error instanceof Error ? error.message : String(error),
      });
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
      jamMonitor.txSignError({
        error: { message: 'Invalid signature' },
      });
      toast.generalError(randomBytes.toString(), 'Invalid signature');
    },
  });

  const confirmTransaction = async (
    selectedTransactionId: string,
    callback?: () => void,
    transactionInformations?: TransactionWithVault,
  ) => {
    const timer = jamMonitor.startTimer();

    const transaction = transactionInformations
      ? {
          hash: transactionInformations?.hash,
          id: transactionInformations?.id,
          predicateAddress:
            transactionInformations?.predicate?.predicateAddress ?? '',
          name: transactionInformations?.name,
          predicateId: transactionInformations?.predicate?.id ?? '',
          resume: transactionInformations?.resume,
          status: transactionInformations?.status,
        }
      : pendingTransactions?.[selectedTransactionId];

    setSelectedTransaction(transaction);

    // Log sign start
    jamMonitor.txSignStart({
      transactionId: transaction?.id,
      transactionHash: transaction?.hash,
      predicateId: transaction?.predicateId,
      signers: transaction?.resume ? {
        total: transaction.resume.totalSigners,
        signed: transaction.resume.witnesses?.filter(w => w.status === 'DONE').length ?? 0,
        required: transaction.resume.requiredSigners,
      } : undefined,
    });

    let predicateVersion = undefined;

    if (
      transactionInformations?.predicate?.predicateAddress &&
      transactionInformations?.network.url
    ) {
      const vault = await instantiateVault({
        predicateAddress: transactionInformations.predicate.predicateAddress,
        providerUrl: transactionInformations.network.url,
      });
      predicateVersion = vault.predicateVersion;
    }

    // Log wallet sign message
    jamMonitor.walletSignMessage({
      action: 'sign_transaction',
    });

    const signedMessage = await signMessageRequest.mutateAsync({
      message: transaction?.hash,
      predicateVersion,
    });

    await request.mutateAsync(
      {
        account: CookiesConfig.getCookie(CookieName.ADDRESS),
        confirm: true,
        signer: signedMessage,
        hash: transaction?.hash,
      },
      {
        onSuccess: async () => {
          // Log sign success
          jamMonitor.txSignSuccess({
            transactionId: transaction?.id,
            transactionHash: transaction?.hash,
            predicateId: transaction?.predicateId,
            duration: timer(),
          });

          setIsSignConfirmed(true);
          executeTransaction(transaction);
          callback && callback();
        },
      },
    );
  };

  const declineTransaction = async (transactionHash: string) => {
    // Log decline start
    jamMonitor.txSignDecline({
      transactionHash,
    });

    await request.mutateAsync(
      {
        confirm: false,
        account: CookiesConfig.getCookie(CookieName.ADDRESS),
        hash: transactionHash,
      },
      {
        onSuccess: async () => {
          transactionsPageRefetch();
          pendingSignerTransactionsRefetch();
          homeTransactionsRefetch();
          vaultBalanceRefetch();
          queryClient.invalidateQueries({
            queryKey: [VAULT_TRANSACTIONS_LIST_PAGINATION],
          });
        },
      },
    );
  };

  return {
    confirmTransaction,
    declineTransaction,
    isLoading:
      isSignConfirmed ||
      request.isPending ||
      signMessageRequest.isPending ||
      selectedTransaction?.status === TransactionStatus.PROCESS_ON_CHAIN ||
      selectedTransaction?.status === TransactionStatus.PENDING_SENDER,
    isSuccess: request.isSuccess,
    selectedTransaction,
  };
};

export { useSignTransaction };
