import { TransactionRequestLike } from '@fuel-ts/providers';
import { useEffect, useState } from 'react';

import { useQueryParams } from '@/modules/auth/hooks';
import { SocketEvents, SocketUsernames, useSocket } from '@/modules/core/hooks';

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

export type UseTransactionSocket = ReturnType<typeof useTransactionSocket>;

export const useTransactionSocket = () => {
  const [vault, setVault] = useState<IVaultEvent | undefined>({
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
  const [signing, setSigning] = useState(false);

  const { connect, socket } = useSocket();
  const { sessionId, request_id } = useQueryParams();

  const summary = useTransactionSummary();

  const handleSocketEvent = (data: any) => {
    const { to, type, data: content } = data;
    const { vault, tx, validAt } = content;
    const isValid =
      to === SocketUsernames.UI && type === SocketEvents.TX_REQUEST;

    if (!isValid) return;

    setVault(vault);
    setTx(tx);
    setValidAt(validAt);
    summary.getTransactionSummary({
      transactionLike: tx,
      providerUrl: vault.provider,
      configurable: vault.configurable,
      version: vault.version,
    });
  };

  const tryConnectSocket = () => {
    if (!socket.connected) {
      connect(sessionId!);
    }

    socket.on('connect', () => {
      console.log('SOCKET_CONNECTED:', socket.connected);
      console.log('SENDING_MESSAGE');
      socket.emit(SocketEvents.DEFAULT, {
        sessionId,
        to: SocketUsernames.CONNECTOR,
        request_id,
        type: SocketEvents.CONNECTED,
        data: {},
      });

      console.log('GETTING_SUMMARY');
      socket.on(SocketEvents.DEFAULT, handleSocketEvent);
    });

    socket.on('disconnect', () => {
      console.log('SOCKET_DISCONNECTED');
      tryConnectSocket();
    });
  };

  const openSignInTab = () => {
    window.open(
      `${window.origin}/dapp/transaction/sign/${window.location.search}`,
      '_blank',
    );
  };

  const sendTransaction = async () => {
    if (!tx) return;
    setSending(true);

    console.log('[EMITINDO TRANSACTION]');
    socket.emit(SocketEvents.TX_CONFIRM, {
      operations: summary.transactionSummary,
      tx,
    });
  };

  // TODO: check another way to redirect to sign page
  const sendTransactionAndRedirectToSign = async () => {
    sendTransaction();
    openSignInTab();
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

  // TODO: add logic to sign transaction
  const signTransaction = () => {
    setSigning(true);
    console.log('[ASSINANDO TRANSACTION]');
    setTimeout(() => {
      window.close();
    }, 2500);
  };

  const cancelSignTransaction = () => {
    cancelSendTransaction();
    window.close();
  };

  useEffect(() => {
    tryConnectSocket();

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off(SocketEvents.DEFAULT, handleSocketEvent);
    };
  }, []);

  return {
    vault,
    summary,
    validAt,
    pendingSignerTransactions: vault?.pending_tx ?? true,
    socket,
    send: {
      isLoading: sending,
      handler: sendTransaction,
      redirectHandler: sendTransactionAndRedirectToSign,
      cancel: cancelSignTransaction,
    },
    sign: {
      isLoading: signing,
      handler: signTransaction,
      cancel: cancelSignTransaction,
    },
  };
};
