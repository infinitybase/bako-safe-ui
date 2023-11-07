import { useMemo } from 'react';

import { SocketChannel, useQueryParams, useSocket } from '@/modules';

export enum AuthEventType {
  VAULT_SECTED = 'VAULT_SECTED',
}

export type AuthSocketEvent = {
  channel: SocketChannel.POPUP_AUTH;
  type: AuthEventType;
  sessionId: string;
  address: string;
  to: string;
};
export const useAuthSocket = () => {
  const { connect, emitMessage } = useSocket();
  const { sessionId, address } = useQueryParams();

  useMemo(() => {
    connect(sessionId!, SocketChannel.POPUP_AUTH);
  }, [connect, sessionId]);

  const emitEvent = (content: { [key: string]: string }) => {
    console.log(address);
    return emitMessage(
      sessionId!,
      {
        channel: SocketChannel.POPUP_AUTH,
        type: AuthEventType.VAULT_SECTED,
        sessionId: sessionId!,
        address: address!,
        to: `${SocketChannel.WALLET}${address!}`,
        ...content,
      },
      () => {
        console.log('execute_callback');
        window.close();
      },
    );
  };

  return { emitEvent };
};
