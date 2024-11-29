import { SocketUsernames, useQueryParams } from '@/modules';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';
import React, { createContext, useEffect } from 'react';
import { io } from 'socket.io-client';

const { VITE_SOCKET_URL } = import.meta.env;

const URL = VITE_SOCKET_URL;
const socket = io(URL, { autoConnect: true, reconnection: true });

// socket debbug events
socket.onAny((event, ...args) => {
  console.log(`Evento recebido: ${event}`, ...args);
});

socket.on('connect_error', (err) => {
  if (err.message === 'invalid username') {
    console.log('Usuário inválido');
  }
});

export const SocketContext = createContext(socket);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    authDetails: { userInfos },
  } = useWorkspaceContext();
  const { request_id, sessionId } = useQueryParams();

  useEffect(() => {
    if (!socket.connected) {
      console.log('[SOCKET_PROVIDER] Attempting to connect');
      socket.auth = {
        username: SocketUsernames.UI,
        data: new Date(),
        sessionId: sessionId || userInfos.id,
        origin,
        request_id: request_id ?? '',
      };
      socket.connect();
    }

    // Cleanup to avoid memory leaks
    return () => {
      socket.off(); // Remove event listeners
      socket.disconnect(); // Gracefully close connection
    };
  }, [userInfos, sessionId, request_id]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

// force action
