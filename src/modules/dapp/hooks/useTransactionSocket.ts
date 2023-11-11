import { Vault } from 'bsafe';
import { TransactionRequestLike } from 'fuels';
import { useMemo, useState } from 'react';

import { CookieName, CookiesConfig } from '@/config/cookies';
import {
  useQueryParams,
  UserTypes,
  useSocket,
  WalletEnumEvents,
} from '@/modules';
const { ACCESS_TOKEN, ADDRESS } = CookieName;

export const useTransactionSocket = () => {
  const { connect, emitMessage } = useSocket();
  const { sessionId, origin } = useQueryParams();
  const [vault, setVault] = useState<Vault>();
  const [FUELTransaction, setFUELTransaction] =
    useState<TransactionRequestLike>();

  const callbacks: { [key: string]: (data: any) => void } = {
    // eslint-disable-next-line prettier/prettier
    message: async (params: any) => {
      const { type, data } = params;
      const { address, transaction } = data;
      if (type === WalletEnumEvents.TRANSACTION_SEND) {
        setVault(
          await Vault.create({
            predicateAddress: address,
            token: CookiesConfig.getCookie(ACCESS_TOKEN)!,
            address: CookiesConfig.getCookie(ADDRESS)!,
          }),
        );
        setFUELTransaction(transaction);
      }
    },
  };
  useMemo(() => {
    connect({
      username: sessionId!,
      param: UserTypes.POPUP_TRANSFER,
      sessionId: sessionId!,
      origin: origin!,
      callbacks,
    });
  }, [connect, sessionId]);

  const confirmTransaction = async () => {
    const tx = await vault?.BSAFEIncludeTransaction(FUELTransaction!);
    console.log('[TRANSACTION_TX]: ', tx);
    if (!tx) return;
    console.log('[enviando mensagem]');
    emitMessage({
      event: WalletEnumEvents.TRANSACTION_CREATED,
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

  const init = () => {
    return;
  };

  return { init, confirmTransaction, vault, FUELTransaction };
};
