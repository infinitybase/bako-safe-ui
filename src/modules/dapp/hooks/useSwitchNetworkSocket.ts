import { useCallback, useEffect, useRef } from 'react';

import { useQueryParams } from '@/modules/auth/hooks';
import { SocketEvents, SocketUsernames, useSocket } from '@/modules/core/hooks';

interface IVaultEvent {
  name: string;
  address: string;
  description: string;
  provider: string;
  pending_tx: boolean;
  configurable: string;
  version: string;
}

export type UseSwitchNetworkSocket = ReturnType<typeof useSwitchNetworkSocket>;

export const useSwitchNetworkSocket = () => {
  const vaultRef = useRef<IVaultEvent>({
    name: '',
    address: '',
    description: '',
    provider: '',
    pending_tx: true,
    configurable: '',
    version: '',
  });

  // const navigate = useNavigate(); // do not remove, makes socket connection work
  const { socket } = useSocket();
  const { sessionId, request_id } = useQueryParams();
  // const { warningToast, errorToast } = useContactToast();

  const handleGetSummary = useCallback((data: any) => {
    console.log('GETTING_SUMMARY');
    const { data: content } = data;
    const { vault } = content;

    vaultRef.current = vault;
  }, []);

  const handleSocketEvent = useCallback(
    (data: any) => {
      console.log('SOCKET EVENT DATA:', data);
      if (data.to !== SocketUsernames.UI) return;

      switch (data.type) {
        case SocketEvents.CHANGE_NETWORK:
          console.log('>>> data', data);
          handleGetSummary(data);
          break;
        // case SocketEvents.TX_CREATE:
        //   handleCreatedTransaction(data);
        //   break;
        // case SocketEvents.TX_SIGN:
        //   handleSignedTransaction(data);
        //   break;
        default:
          break;
      }
    },
    [handleGetSummary],
  );

  useEffect(() => {
    socket.emit(SocketEvents.DEFAULT, {
      sessionId,
      to: SocketUsernames.CONNECTOR,
      request_id,
      type: SocketEvents.CONNECTED,
      data: {},
    });

    socket.on(SocketEvents.DEFAULT, handleSocketEvent);
    return () => {
      socket.off(SocketEvents.DEFAULT, handleSocketEvent);
    };
  }, [socket.connected]);

  return {
    vault: vaultRef.current,
    socket,
  };
};
