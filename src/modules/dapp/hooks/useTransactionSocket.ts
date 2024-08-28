import { TransactionRequestLike } from 'fuels';
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
}

interface IDappEvent {
  name: string;
  description: string;
  origin: string;
}

export const useTransactionSocket = () => {
  const [vault, setVault] = useState<IVaultEvent | undefined>({
    name: '',
    address: '',
    description: '',
    provider: '',
    pending_tx: true,
  });
  const [dapp, setDapp] = useState<IDappEvent | undefined>(undefined);
  const [validAt, setValidAt] = useState<string | undefined>(undefined);
  const [tx, setTx] = useState<TransactionRequestLike>();
  const [sending, setSending] = useState(false);

  const { connect, socket } = useSocket();
  const { sessionId, request_id } = useQueryParams();

  const summary = useTransactionSummary();

  useEffect(() => {
    console.log('FIRST_EFFECT_CONNECTED?', socket.connected);
    if (!socket.connected) {
      connect(sessionId!);
    }
  }, [summary.isPending, summary.isSuccess, request_id, socket.connected]);

  useEffect(() => {
    console.log('[SOCKET_CONN]: ', socket.connected);
    if (socket.connected) {
      console.log('[ENVIANDO MENSAGEM]');
      socket.emit(SocketEvents.DEFAULT, {
        sessionId,
        to: SocketUsernames.CONNECTOR,
        request_id,
        type: SocketEvents.CONNECTED,
        data: {},
      });
    }
  }, [socket.connected, request_id]);

  useEffect(() => {
    //todo: default typing of the events
    socket.on(SocketEvents.DEFAULT, (data) => {
      const { to, type, data: content } = data;
      const { dapp, vault, tx, validAt } = content;
      const isValid =
        to === SocketUsernames.UI && type === SocketEvents.TX_REQUEST;

      if (!isValid) return;

      setDapp(dapp);
      setVault(vault);
      setTx(tx);
      setValidAt(validAt);
      summary.getTransactionSummary({
        providerUrl: vault.provider,
        transactionLike: tx,
        from: vault.address,
      });
    });
  }, [socket]);

  const sendTransaction = async () => {
    if (!tx) return;
    setSending(true);

    console.log('[EMITINDO TRNSACTION]');

    socket.emit(SocketEvents.TX_CONFIRM, {
      operations: summary.transactionSummary,
      tx,
    });
  };

  // emmit message to the server and close window
  const cancelTransaction = () => {
    socket.emit(SocketEvents.DEFAULT, {
      username: SocketUsernames.UI,
      sessionId,
      to: SocketUsernames.CONNECTOR,
      type: SocketEvents.DISCONNECTED,
      request_id,
      data: {},
    });
  };

  return {
    vault,
    summary,
    validAt,
    connection: dapp,
    cancelTransaction: () => {
      cancelTransaction();
    },
    send: sendTransaction,
    pendingSignerTransactions: vault?.pending_tx ?? true,
    isLoading: sending,
    socket,
  };
};
