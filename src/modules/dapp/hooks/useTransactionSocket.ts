import { TransactionRequestLike } from 'fuels';
import { useEffect, useState } from 'react';

import { useQueryParams } from '@/modules/auth/hooks';
import { useSocket } from '@/modules/core/hooks';

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

// interface IEventTX_EVENT_REQUEST {
//   vault: IVaultEvent;
//   tx: TransactionRequestLike;
//   dapp: IDappEvent;
// }

export const useTransactionSocket = () => {
  const [vault, setVault] = useState<IVaultEvent | undefined>(undefined);
  const [dapp, setDapp] = useState<IDappEvent | undefined>(undefined);
  const [validAt, setValidAt] = useState<number>(10000000);
  const [tx, setTx] = useState<TransactionRequestLike>();
  const [sending, setSending] = useState(false);

  const { connect, socket } = useSocket();
  const { sessionId } = useQueryParams();

  const summary = useTransactionSummary();

  useEffect(() => {
    connect(sessionId!);
  });

  useEffect(() => {
    //todo: default typing of the events
    socket.on('message', ({ data }) => {
      const { to, type, data: content } = data;
      const isValid = to === '[UI]' && type === '[TX_EVENT_REQUESTED]';
      if (!isValid) return;
      const { dapp, vault, tx, validAt } = content;

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
    socket.emit('[TX_EVENT_CONFIRM]', {
      operations: summary.transactionSummary,
      tx,
    });
  };

  // emmit message to the server and close window
  const cancelTransaction = () => window.close();

  const init = () => {
    return;
  };

  return {
    init,
    vault,
    summary,
    validAt,
    connection: dapp,
    cancelTransaction,
    send: sendTransaction,
    pendingSignerTransactions: vault?.pending_tx,
    isLoading: sending,
  };
};
