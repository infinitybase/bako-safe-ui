import type { ITransaction, TransactionWithVault } from '@bako-safe/services';
import { CookieName, CookiesConfig } from '@/modules/core/utils';
import { useWalletSignMessage } from '@bako-safe/wallet';
import { TransactionStatus } from 'bakosafe';
import { randomBytes } from 'ethers';
import { useState } from 'react';

import { queryClient } from '@/config';
import { useContactToast } from '@/modules/addressBook/hooks/useContactToast';
import { useAuthContext } from '@/modules/auth/AuthProvider';
import { VAULT_TRANSACTIONS_LIST_PAGINATION } from '@/modules/vault/hooks/list/useVaultTransactionsRequest';

import { useTransactionToast } from '../../providers/toast';
import type {
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
  const {
    userInfos: { type, webauthn, address },
  } = useAuthContext();

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

  const signMessageRequest = useWalletSignMessage(
    address,
    type,
    webauthn?.id,
    webauthn?.publicKey,
    {
      onError: () => {
        warningToast({
          title: 'Signature failed',
          description: 'Please try again!',
        });
      },
    },
  );

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
    transactionInformations?: TransactionWithVault,
  ) => {
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

    const signedMessage = await signMessageRequest.mutateAsync(
      transaction?.hash,
    );

    await request.mutateAsync(
      {
        account: CookiesConfig.getCookie(CookieName.ADDRESS),
        confirm: true,
        signer: signedMessage,
        hash: transaction?.hash,
      },
      {
        onSuccess: async () => {
          setIsSignConfirmed(true);
          executeTransaction(transaction);
          callback && callback();
        },
      },
    );
  };

  const declineTransaction = async (transactionHash: string) => {
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
