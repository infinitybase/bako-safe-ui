import { Vault } from 'bsafe';
import { useMemo } from 'react';

import { CookieName, CookiesConfig } from '@/config/cookies';
import { useQueryParams, UserTypes, useSocket } from '@/modules';
const { ACCESS_TOKEN, ADDRESS } = CookieName;

export const useTransactionSocket = () => {
  const { connect } = useSocket();
  const { sessionId, origin } = useQueryParams();
  const callbacks: { [key: string]: (data: any) => void } = {
    // eslint-disable-next-line prettier/prettier
    message: async (params: any) => {
      const { type, data } = params;
      const { address, transaction } = data;
      if (type === 'transactionSend') {
        console.log(address, !!transaction);
        const vault = await Vault.create({
          predicateAddress: address,
          token: CookiesConfig.getCookie(ACCESS_TOKEN)!,
          address: CookiesConfig.getCookie(ADDRESS)!,
        });
        console.log('vault', vault);
        const tx = await vault.BSAFEIncludeTransaction(transaction);
        console.log('tx', tx);
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

  const emitEvent = () => {
    // return emitMessage({
    //   event: SocketEvents.TRANSACTION_APPROVED,
    //   content: {
    //     sessionId: sessionId!,
    //     address: address!,
    //   },
    //   to: `${UserTypes.WALLET}${sessionId!}`,
    //   callback: () => {
    //     window.close();
    //   },
    // });
  };

  return { emitEvent };
};
