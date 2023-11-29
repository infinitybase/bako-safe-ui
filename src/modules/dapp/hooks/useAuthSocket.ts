import { useMemo } from 'react';

import {
  useQueryParams,
  UserTypes,
  useSocket,
  WalletEnumEvents,
} from '@/modules';

export interface AuthSocketEvent {
  sessionId: string;
  address: string;
}

export const useAuthSocket = () => {
  const { connect, emitMessage } = useSocket();
  const { sessionId, address, origin } = useQueryParams();

  useMemo(() => {
    connect({
      username: sessionId!,
      param: UserTypes.POPUP_AUTH,
      sessionId: sessionId!,
      origin: origin!,
    });
  }, [connect, sessionId]);

  const emitEvent = (vaultId: string) => {
    return emitMessage({
      event: WalletEnumEvents.AUTH_CONFIRMED,
      content: {
        vaultId,
        sessionId: sessionId!,
        address: address!,
        origin: origin!,
      },
      to: `${UserTypes.WALLET}${sessionId!}`,
      callback: () => {
        window.close();
      },
    });
  };

  return { emitEvent };
};
