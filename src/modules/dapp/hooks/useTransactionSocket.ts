import { useMemo } from 'react';

import { SocketEvents, useQueryParams, UserTypes, useSocket } from '@/modules';

export const useTransactionSocket = () => {
  const { connect, emitMessage } = useSocket();
  const { sessionId, address } = useQueryParams();
  const callbacks: { [key: string]: (data: any) => void } = {
    [SocketEvents.USER_CONNECTED]: (data: any) => {
      console.log('USER_CONNECTED', data);
    },
  };
  useMemo(() => {
    connect({
      username: sessionId!,
      param: UserTypes.POPUP_TRANSFER,
      sessionId: sessionId!,
      callbacks,
    });
  }, [connect, sessionId]);

  const emitEvent = () => {
    return emitMessage({
      event: SocketEvents.TRANSACTION_APPROVED,
      content: {
        sessionId: sessionId!,
        address: address!,
      },
      to: `${UserTypes.WALLET}${sessionId!}`,
      callback: () => {
        window.close();
      },
    });
  };

  return { emitEvent };
};
