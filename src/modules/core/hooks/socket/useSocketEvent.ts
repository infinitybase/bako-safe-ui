import { useEffect, useCallback } from 'react';
import { useSocket } from '@/modules/core';

export const useSocketEvent = (
  event: string,
  callback: (data: any) => void,
) => {
  const { socket } = useSocket();

  const handleSocketEvent = useCallback(
    (data: any) => {
      callback(data);
    },
    [callback],
  );

  useEffect(() => {
    // console.log("✅ Socket conectado. Registrando eventos...");
    socket.on(event, handleSocketEvent);

    return () => {
      // console.log("🗑️ Removendo listeners ao desmontar...");
      socket.off(event, handleSocketEvent);
    };
  }, [socket?.connected, handleSocketEvent]);
};
