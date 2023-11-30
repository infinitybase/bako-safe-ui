import { useMemo, useState } from 'react';

import { SocketEvents, useQueryParams, UserTypes, useSocket } from '@/modules';

import { useGetCurrentVaultRequest } from './useGetCurrentVaultRequest';

export interface AuthSocketEvent {
  sessionId: string;
  address: string;
}

export const useAuthSocket = () => {
  const { connect, emitMessage } = useSocket();
  const { sessionId, address, origin } = useQueryParams();
  const [selectedVaultId, setSelectedVaultId] = useState('');
  const [emittingEvent, setEmittingEvent] = useState(false);

  const getCurrentVaultRequest = useGetCurrentVaultRequest(sessionId!);

  useMemo(() => {
    connect({
      username: sessionId!,
      param: UserTypes.POPUP_AUTH,
      sessionId: sessionId!,
      origin: origin!,
    });
  }, [connect, sessionId]);

  const emitEvent = (vaultId: string) => {
    setEmittingEvent(true);

    return emitMessage({
      event: SocketEvents.AUTH_CONFIRMED,
      content: {
        vaultId,
        sessionId: sessionId!,
        address: address!,
        origin: origin!,
      },
      to: `${UserTypes.WALLET}${sessionId!}`,
      callback: () => {
        window.close();
        setEmittingEvent(false);
      },
    });
  };

  return {
    emitEvent,
    selectedVaultId,
    setSelectedVaultId,
    currentVault: getCurrentVaultRequest?.data,
    emittingEvent,
  };
};
