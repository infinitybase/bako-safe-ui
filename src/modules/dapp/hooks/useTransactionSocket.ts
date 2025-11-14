import { TransactionRequestLike } from 'fuels';
import { useCallback, useEffect, useRef, useState } from 'react';

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
  id: string;
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
    id: '',
    name: '',
    address: '',
    description: '',
    provider: '',
    pending_tx: true,
    configurable: '',
    version: '',
  });
  const [validAt, setValidAt] = useState<string | undefined>(undefined);
  const [startTime] = useState(Date.now());
  const [tx, setTx] = useState<TransactionRequestLike>();
  const [hash, setHash] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isSigning, setIsSigning] = useState<boolean>(false);

  // const navigate = useNavigate(); // do not remove, makes socket connection work
  const { socket, isConnected } = useSocket();
  const { sessionId, request_id } = useQueryParams();
  const { warningToast, errorToast } = useContactToast();
  const connectionAttemptedRef = useRef(false);

  const summary = useTransactionSummary();

  const tabs = useTab({
    tabs: EnumUtils.toNumberArray(TabState),
    defaultTab: TabState.CREATE,
  });

  const showSignErrorToast = useCallback(
    () =>
      warningToast({
        title: 'Signature failed',
        description: 'Please try again!',
      }),
    [warningToast],
  );

  const signMessageRequest = useWalletSignMessage({
    onSuccess: (signedMessage, { message }) => {
      emitSignTransactionEvent(message, signedMessage);
    },
    onError: () => {
      showSignErrorToast();
      setIsSigning(false);
    },
  });

  const signTransaction = useCallback(
    (_hash?: string, predicateVersion?: string) => {
      setIsSigning(true);
      signMessageRequest.mutateAsync({
        message: _hash || hash,
        predicateVersion,
      });
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
        version: vault.version,
      });
    },
    [summary],
  );

  const handleCreatedTransaction = useCallback(
    (data: any) => {
      setIsSending(false);

      const { data: content } = data;
      const { hash: _hash, sign, status, predicateVersion } = content;

      if (status === IEventTX_STATUS.ERROR) {
        errorToast({
          title: 'Transaction creation failed',
          description: 'Please try again!',
        });
        return;
      }

      setHash(_hash);

      if (_hash && sign) {
        tabs.set(TabState.SIGN);
        signTransaction(_hash, predicateVersion);
        return;
      }

      tabs.set(TabState.PENDING_SIGN);
    },
    [tabs],
  );

  const checkIfMultisig = useCallback((configurable?: string) => {
    const config = JSON.parse(configurable || '{}');
    const minSigners = config.SIGNATURES_COUNT || 1;
    return minSigners > 1;
  }, []);

  const handleSignedTransaction = useCallback(
    (data: any) => {
      const { data: content } = data;
      const { status } = content;

      if (status === IEventTX_STATUS.ERROR) {
        showSignErrorToast();
        setIsSigning(false);
        return;
      }

      const isMultiSig = checkIfMultisig(vaultRef.current?.configurable);

      isMultiSig ? tabs.set(TabState.PENDING_OTHERS_SIGN) : window.close();
    },
    [checkIfMultisig, showSignErrorToast, tabs],
  );

  const handleSocketEvent = useCallback(
    (data: any) => {
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

  // force commit
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
    if (!isConnected) return;

    if (!connectionAttemptedRef.current) {
      socket.emit(SocketEvents.DEFAULT, {
        sessionId,
        to: SocketUsernames.CONNECTOR,
        request_id,
        type: SocketEvents.CONNECTED,
        data: {},
      });
      socket.on(SocketEvents.DEFAULT, handleSocketEvent);
      connectionAttemptedRef.current = true;
    }
    return () => {
      socket.off(SocketEvents.DEFAULT, handleSocketEvent);
    };
  }, [socket, isConnected]);

  return {
    vault: vaultRef.current,
    summary,
    tx,
    startTime,
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
