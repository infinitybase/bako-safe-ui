import { TransactionRequestLike } from 'fuels';
import { useEffect, useState } from 'react';

import { useQueryParams } from '@/modules/auth/hooks';
import { useSocket } from '@/modules/core/hooks';

import { useConfirmTx } from './useConfirmTx';
import { useTransactionSummary } from './useTransactionSummary';

interface IVaultSk {
  name: string;
  address: string;
  description: string;
}

export const useTransactionSocket = () => {
  const [vault, setVault] = useState<IVaultSk | undefined>(undefined);
  const [pending, setPending] = useState(false);
  const [code, setCode] = useState<string>('');
  const [validAt, setValidAt] = useState<number>(10000000);
  const [tx, setTx] = useState<TransactionRequestLike>();

  const { connect, socket } = useSocket();
  const { sessionId } = useQueryParams();
  const confirmTxMutate = useConfirmTx();

  const summary = useTransactionSummary();

  useEffect(() => {
    connect(sessionId!);
  });

  useEffect(() => {
    socket.on('message', (data) => {
      setVault(data.data.content.vault);
      setPending(data.data.content.tx_blocked);
      setValidAt(data.data.content.validAt);
      setCode(data.data.content.code);
      setTx(data.data.content.transaction);
      summary.getTransactionSummary({
        transactionLike: data.data.content.transaction,
        providerUrl: data.data.content.provider,
      });
    });
  }, [socket]);

  const sendTransaction = () => {
    if (!sessionId || !vault || !tx) return;
    confirmTxMutate.mutate(
      {
        sessionId,
        vaultAddress: vault.address,
        code,
        tx,
      },
      {
        onSuccess: () => {
          socket.emit('message', {});
          window.close();
        },
        onError: () => {
          socket.emit('message', {});
          window.close();
        },
      },
    );
  };

  // emmit message to the server and close window
  const cancelTransaction = () => window.close();

  const init = () => {
    return;
  };

  return {
    init,
    code,
    vault,
    summary,
    validAt,
    connection: {
      name,
      origin,
    },
    cancelTransaction,
    send: sendTransaction,
    pendingSignerTransactions: pending,
    requestConfirm: confirmTxMutate,
  };
};
