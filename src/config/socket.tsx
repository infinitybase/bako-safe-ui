import React, { createContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

import { SocketUsernames, useQueryParams } from '@/modules';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

const { VITE_SOCKET_URL, DEV } = import.meta.env;

// Create socket instance outside component to persist across renders
const socket = io(VITE_SOCKET_URL, {
  autoConnect: false, // Connect manually after auth is prepared
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 10000,
});

// Debug events
socket.onAny((event, ...args) => {
  if (!DEV) return;
  console.log(`[SOCKET] Event: ${event}`, ...args);
});

export const SocketContext = createContext<{
  socket: Socket;
  isConnected?: boolean;
}>({ socket, isConnected: false });

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const {
    authDetails: { userInfos },
  } = useWorkspaceContext();
  const { request_id, sessionId } = useQueryParams();
  const connectionAttemptedRef = React.useRef(false);

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
    };

    const onDisconnect = (reason: string) => {
      console.log(`[SOCKET] Disconnected: ${reason}`);
      setIsConnected(false);
    };

    const onConnectError = (err: Error) => {
      console.error('[SOCKET] Connection error:', err.message);
      if (err.message === 'invalid username') {
        console.log(
          '[SOCKET] Invalid username, will retry with different auth',
        );
      }
    };

    // Register event listeners
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);

    const hasId = userInfos.id || sessionId;

    if (hasId && !socket.connected && !connectionAttemptedRef.current) {
      socket.auth = {
        username: SocketUsernames.UI,
        data: new Date(),
        sessionId: sessionId || userInfos.id,
        origin,
        request_id: request_id ?? '',
      };

      console.log('[SOCKET] Attempting to connect with auth:', socket.auth);

      connectionAttemptedRef.current = true;
      socket.connect();
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
    };
  }, [userInfos, sessionId, request_id]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
