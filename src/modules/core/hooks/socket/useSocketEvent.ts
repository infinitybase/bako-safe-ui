import { useEffect, useCallback, useRef, useMemo } from 'react';
import { useSocket } from '@/modules/core';

export const useSocketEvent = <T>(
  event: string,
  callbacks: ((data: T) => void)[],
) => {
  const { socket } = useSocket();
  const callbacksRef = useRef<((data: T) => void)[]>([]);
  const stableCallbacks = useMemo(() => callbacks, [callbacks]);

  useEffect(() => {
    callbacksRef.current = stableCallbacks;
  }, [stableCallbacks]);

  const handleSocketEvent = useCallback((data: T) => {
    callbacksRef.current.forEach((callback) => callback(data));
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on(event, handleSocketEvent);

    return () => {
      socket.off(event, handleSocketEvent);
    };
  }, [socket, event, handleSocketEvent]);
};
