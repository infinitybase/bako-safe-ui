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
  useTab,
  useWalletSignMessage,
} from '@/modules/core/hooks';
import { EnumUtils } from '@/modules/core/utils';

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

enum TabState {
  CREATE = 0,
  SIGN = 1,
  PENDING_SIGN = 2,
  PENDING_OTHERS_SIGN = 3,
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
  const [hash, setHash] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isSigning, setIsSigning] = useState<boolean>(false);

  const navigate = useNavigate(); // do not remove, makes socket connection work
  const { connect, socket } = useSocket();
  const { sessionId, request_id } = useQueryParams();
  const { warningToast } = useContactToast();

  const summary = useTransactionSummary();

  const tabs = useTab({
    tabs: EnumUtils.toNumberArray(TabState),
    defaultTab: TabState.CREATE,
  });

  const showSignErrorToast = useCallback(
    () =>
      warningToast({
        title: 'Transaction sign failed',
        description: 'Please try again!',
      }),
    [warningToast],
  );

  const signMessageRequest = useWalletSignMessage({
    onSuccess: (signedMessage, hash) => {
      emitSignTransactionEvent(hash, signedMessage);
    },
    onError: () => {
      showSignErrorToast();
      setIsSigning(false);
    },
  });

  const signTransaction = useCallback(
    (_hash?: string) => {
      setIsSigning(true);
      signMessageRequest.mutateAsync(_hash || hash);
    },
    [hash, signMessageRequest],
  );

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

  const handleCreatedTransaction = useCallback(
    (data: any) => {
      setIsSending(false);

      const { data: content } = data;
      const { hash: _hash, sign } = content;
      setHash(_hash);

      if (_hash && sign) {
        tabs.set(TabState.SIGN);
        signTransaction(_hash);
        return;
      }

      tabs.set(TabState.PENDING_SIGN);
    },
    [signTransaction, tabs],
  );

  const handleSignedTransaction = useCallback(
    (data: any) => {
      const { data: content } = data;
      const { status } = content;

      if (status === IEventTX_STATUS.ERROR) {
        showSignErrorToast();
        setIsSigning(false);
        return;
      }

      const configurable = JSON.parse(vaultRef.current?.configurable || '{}');
      const minSigners = configurable.SIGNATURES_COUNT || 1;
      const isMultiSig = minSigners > 1;

      isMultiSig ? tabs.set(TabState.PENDING_OTHERS_SIGN) : window.close();
    },
    [showSignErrorToast, tabs],
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
    setIsSending(true);

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

  const emitSignTransactionEvent = (hash: string, signedMessage: string) => {
    console.log('[EMITTING SIGN TRANSACTION]');
    socket.emit(SocketEvents.TX_SIGN, {
      hash,
      signedMessage,
    });
  };

  const cancelSignTransaction = () => {
    tabs.set(TabState.PENDING_SIGN);
  };

  const emitSignedMessage = (message: string) => {
    socket.emit(SocketEvents.DEFAULT, {
      username: SocketUsernames.UI,
      sessionId,
      to: SocketUsernames.CONNECTOR,
      type: SocketEvents.SIGN_CONFIRMED,
      request_id,
      data: {
        signedMessage: message,
      },
    });
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
    tabs,
    send: {
      isSending,
      sendTransaction,
      sendTransactionAndSign,
      cancelSendTransaction,
    },
    sign: {
      isSigning,
      signTransaction,
      cancelSignTransaction,
    },
    signMessage: {
      emitSignedMessage,
    },
  };
};
