import { BSAFEConnectorEvents, Vault } from 'bsafe';
import { TransactionRequestLike } from 'fuels';
import { useState } from 'react';

import { CookieName, CookiesConfig } from '@/config/cookies';
import {
  useDidMountEffect,
  useQueryParams,
  UserTypes,
  useSocket,
} from '@/modules';
import { useTransactionSummary } from '@/modules/dapp/hooks/useTransactionSummary';
const { ACCESS_TOKEN, ADDRESS } = CookieName;

export const useTransactionSocket = () => {
  const { connect, emitMessage } = useSocket();
  const { sessionId, origin, name } = useQueryParams();
  const [vault, setVault] = useState<Vault>();
  const [FUELTransaction, setFUELTransaction] =
    useState<TransactionRequestLike>();
  const summary = useTransactionSummary();

  const callbacks: { [key: string]: (data: any) => void } = {
    // eslint-disable-next-line prettier/prettier
    message: async (params: any) => {
      const { type, data } = params;
      const { address, transaction } = data;
      console.log('[TRANSACTION_REQUESTED]: ', {
        data,
        type,
      });
      if (type === BSAFEConnectorEvents.TRANSACTION_SEND) {
        const bsafeVault = await Vault.create({
          predicateAddress: address,
          token: CookiesConfig.getCookie(ACCESS_TOKEN)!,
          address: CookiesConfig.getCookie(ADDRESS)!,
        });
        console.log('[VAULT]: ', bsafeVault);
        summary.getTransactionSummary({
          providerUrl: bsafeVault.provider.url,
          transactionLike: transaction,
        });
        console.log('[VAULT]: ', bsafeVault);
        setVault(bsafeVault);
        setFUELTransaction(transaction);
      }
    },
  };

  useDidMountEffect(() => {
    connect({
      username: sessionId!,
      param: UserTypes.POPUP_TRANSFER,
      sessionId: sessionId!,
      origin: origin!,
      callbacks,
    });
  }, [callbacks, connect, origin, sessionId]);

  const confirmTransaction = async () => {
    const tx = await vault?.BSAFEIncludeTransaction(FUELTransaction!);
    console.log('[CONFIRM_TRANSACTION]: ', FUELTransaction);
    console.log('[TRANSACTION_TX]: ', tx);
    if (!tx) return;
    console.log('[enviando mensagem]');
    emitMessage({
      event: BSAFEConnectorEvents.TRANSACTION_CREATED,
      content: {
        sessionId: sessionId!,
        address: CookiesConfig.getCookie(ADDRESS)!,
        origin: origin!,
        hash: tx.getHashTxId()!,
      },
      to: `${sessionId!}:${origin!}`,
      callback: () => {
        window.close();
      },
    });
    return;
  };

  const cancelTransaction = () => window.close();

  const init = () => {
    return;
  };

  return {
    init,
    vault,
    summary,
    FUELTransaction,
    confirmTransaction,
    cancelTransaction,
    connection: {
      name,
      origin,
    },
  };
};
