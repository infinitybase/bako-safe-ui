import { TransactionRequestLike } from 'fuels';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useContactToast } from '@/modules/addressBook/hooks';
import { useQueryParams } from '@/modules/auth/hooks';
import {
  IEventTX_CREATE,
  SocketEvents,
  SocketUsernames,
  useSocket,
  useWalletSignMessage,
} from '@/modules/core/hooks';

import { useTransactionSummary } from './useTransactionSummary';

interface IVaultEvent {
  name: string;
  address: string;
  description: string;
  provider: string;
  pending_tx: boolean;
  configurable: string;
  version: string;
}

export interface ITransactionSuccess {
  show: boolean;
  title: string;
  description: string;
}

enum IEventTX_STATUS {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export type UseTransactionSocket = ReturnType<typeof useTransactionSocket>;

export const useTransactionSocket = () => {
  const vaultRef = useRef<IVaultEvent>({
    name: '',
    address: '',
    description: '',
    provider: '',
    pending_tx: true,
    configurable: '',
    version: '',
  });
  const [validAt, setValidAt] = useState<string | undefined>(undefined);
  const [tx, setTx] = useState<TransactionRequestLike>();
  const [sending, setSending] = useState(false);
  const [transactionSuccess, setTransactionSuccess] =
    useState<ITransactionSuccess>({
      show: false,
      title: '',
      description: '',
    });

  const navigate = useNavigate(); // do not remove, makes socket connection work
  const { connect, socket } = useSocket();
  const { sessionId, request_id } = useQueryParams();
  const { warningToast } = useContactToast();

  const summary = useTransactionSummary();

  const showSignErrorToast = () =>
    warningToast({
      title: 'Transaction sign failed',
      description: 'Please try again!',
    });

  const signMessageRequest = useWalletSignMessage({
    onSuccess: (signedMessage, hash) => {
      emitSignedMessage(hash, signedMessage);
    },
    onError: () => {
      showSignErrorToast();
    },
  });

  const handleGetSummary = useCallback(
    (data: any) => {
      console.log('GETTING_SUMMARY');
      const { data: content } = data;
      const { vault, tx, validAt } = content;

      vaultRef.current = vault;
      setTx(tx);
      setValidAt(validAt);
      summary.getTransactionSummary({
        transactionLike: tx,
        providerUrl: vault.provider,
        configurable: vault.configurable,
      });
    },
    [summary],
  );

  const handlePendingSign = useCallback(() => {
    setTransactionSuccess({
      show: true,
      title: 'Transaction created!',
      description:
        'Your transaction is pending to be signed. Sign at Bako Safe.',
    });
  }, []);

  const handleSingleSigner = useCallback(() => {
    setTransactionSuccess({
      show: false,
      title: '',
      description: '',
    });
    window.close();
  }, []);

  const handleMultipleSigners = useCallback(() => {
    setTransactionSuccess({
      show: true,
      title: 'Transaction created and signed!',
      description:
        'Your transaction is pending to be signed by others. You can check the transaction status at Bako Safe.',
    });
  }, []);

  const handleCreatedTransaction = useCallback(
    (data: any) => {
      const { data: content } = data;
      const { hash, sign } = content;

      hash && sign ? signMessageRequest.mutateAsync(hash) : handlePendingSign();
    },
    [handlePendingSign, signMessageRequest],
  );

  const handleSignedTransaction = useCallback(
    (data: any) => {
      const { data: content } = data;
      const { status } = content;

      if (status === IEventTX_STATUS.ERROR) {
        showSignErrorToast();
        return;
      }

      const configurable = JSON.parse(vaultRef.current?.configurable || '{}');
      const minSigners = configurable.SIGNATURES_COUNT || 1;

      minSigners > 1 ? handleMultipleSigners() : handleSingleSigner();
    },
    [handleMultipleSigners, handleSingleSigner, showSignErrorToast, vaultRef],
  );

  const handleSocketEvent = useCallback(
    (data: any) => {
      console.log('SOCKET EVENT DATA:', data);
      if (data.to !== SocketUsernames.UI) return;

      switch (data.type) {
        case SocketEvents.TX_REQUEST:
          handleGetSummary(data);
          break;
        case SocketEvents.TX_CREATE:
          handleCreatedTransaction(data);
          break;
        case SocketEvents.TX_SIGN:
          handleSignedTransaction(data);
          break;
        default:
          break;
      }
    },
    [handleCreatedTransaction, handleGetSummary, handleSignedTransaction],
  );

  const emitCreateTransactionEvent = (
    event: SocketEvents,
    data: IEventTX_CREATE,
  ) => {
    if (!data.tx) return;
    setSending(true);

    console.log('[EMITTING CREATE TRANSACTION]');
    socket.emit(event, data);
  };

  const sendTransaction = async () => {
    emitCreateTransactionEvent(SocketEvents.TX_CREATE, {
      operations: summary.transactionSummary,
      tx,
    });
  };

  const sendTransactionAndSign = async () => {
    emitCreateTransactionEvent(SocketEvents.TX_CREATE, {
      operations: summary.transactionSummary,
      tx,
      sign: true,
    });
  };

  // emmit message to the server and close window
  const cancelSendTransaction = () => {
    socket.emit(SocketEvents.DEFAULT, {
      username: SocketUsernames.UI,
      sessionId,
      to: SocketUsernames.CONNECTOR,
      type: SocketEvents.DISCONNECTED,
      request_id,
      data: {},
    });
  };

  const emitSignedMessage = (hash: string, signedMessage: string) => {
    console.log('[EMITTING SIGN TRANSACTION]');
    socket.emit(SocketEvents.TX_SIGN, {
      hash,
      signedMessage,
    });
  };

  const handleRedirectToBakoSafe = () => {
    window.close();
    setTransactionSuccess({
      show: false,
      title: '',
      description: '',
    });
    window.open(window.location.origin, '_BLANK');
  };

  useEffect(() => {
    console.log('SOCKET_CONNECTED:', socket.connected);
    if (!socket.connected) {
      console.log('CONNECTING_SOCKET');
      connect(sessionId!);
      return;
    }

    if (socket.connected) {
      console.log('[EMITTING SOCKET CONNECTED]');
      socket.emit(SocketEvents.DEFAULT, {
        sessionId,
        to: SocketUsernames.CONNECTOR,
        request_id,
        type: SocketEvents.CONNECTED,
        data: {},
      });

      socket.on(SocketEvents.DEFAULT, handleSocketEvent);
    }

    return () => {
      socket.off(SocketEvents.DEFAULT, handleSocketEvent);
    };
  }, [socket.connected]);

  return {
    vault: vaultRef.current,
    summary,
    validAt,
    pendingSignerTransactions: vaultRef.current?.pending_tx ?? true,
    socket,
    send: {
      isLoading: sending,
      handlers: {
        sendTransaction,
        sendTransactionAndSign,
      },
      cancel: cancelSendTransaction,
    },
    handleRedirectToBakoSafe,
    transactionSuccess,
    signMessage: {
      emitSignedMessage,
    },
  };
};
