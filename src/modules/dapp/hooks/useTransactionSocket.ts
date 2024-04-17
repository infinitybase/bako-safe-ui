import { BSafe, Vault } from 'bsafe';
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
  const [bakoSafeVault, setBakoSafeVault] = useState<Vault>();

  const { connect, socket } = useSocket();
  const { sessionId } = useQueryParams();
  const confirmTxMutate = useConfirmTx();

  const summary = useTransactionSummary();

  useEffect(() => {
    connect(sessionId!);
  });

  useEffect(() => {
    socket.on('message', (data) => {
      console.log(data);
      setVault(data.data.content.vault);
      setPending(data.data.content.tx_blocked);
      setValidAt(data.data.content.validAt);
      setCode(data.data.content.code);
      setTx(data.data.content.transaction);
      _setVault(
        data.data.content.user_address,
        data.data.content.code,
        data.data.content.vault.address,
      );
      summary.getTransactionSummary({
        transactionLike: data.data.content.transaction,
        providerUrl: data.data.content.provider,
      });
    });
  }, [socket]);

  const _setVault = async (
    address: string,
    code: string,
    vaultAddress: string,
  ) => {
    try {
      BSafe.setup({
        API_URL: 'http://localhost:3333',
      });
      console.log('[ADDRESS]', address);
      const vault = await Vault.create({
        predicateAddress: vaultAddress,
        address,
        token: code,
      });
      console.log('[VAULT]', vault);
      setBakoSafeVault(vault);
    } catch (e) {
      console.log(e);
    }
  };

  const sendTransaction = async () => {
    console.log('[SEND_TX]', { sessionId, vault, tx, bakoSafeVault });
    if (!sessionId || !vault || !tx || !bakoSafeVault) return;
    console.log('[BEFORE_IF]');
    await confirmTxMutate.mutate(
      {
        vault: bakoSafeVault,
        tx: tx,
      },
      {
        onSuccess: (data) => {
          console.log('[SUCCESS]', data);
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
