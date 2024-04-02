import { BakoSafeConnectors } from 'bakosafe';

import socket from './useSocketConfig';

export interface ISocketConnectParams {
  username: string;
  param: UserTypes;
  sessionId: string;
  origin: string;
  connectionAlert?: {
    event: string;
    content: { [key: string]: string };
  };
  callbacks?: { [key: string]: (data: any) => void };
}
export enum UserTypes {
  WALLET = '[WALLET]',
  POPUP_AUTH = '[POPUP_AUTH]',
  POPUP_TRANSFER = '[POPUP_TRANSFER]',
}

export interface ISocketEmitMessageParams {
  event: BakoSafeConnectors;
  to: string;
  content: { [key: string]: unknown };
  callback?: () => void;
}

export const useSocket = () => {
  const connect = ({
    param,
    callbacks,
    sessionId,
    origin,
  }: ISocketConnectParams) => {
    /* 
    qualquer info que mandar daqui pelo auth vai ser validadno no middleware
    do servidor io.use
    */
    socket.auth = {
      username: `${param}`,
      data: new Date(),
      sessionId,
      origin,
    };
    socket.connect();

    if (callbacks) {
      Object.keys(callbacks).forEach((key) => {
        socket.on(key, callbacks[key]);
      });
    }
  };

  /* 
    Existe em duas partes:
      - cliente emite uma mensagem
      - servidor repassa a mensagem para todos os clientes conectados
    do servidor io.use
    */
  const emitMessage = ({
    to,
    event,
    content,
    callback,
  }: ISocketEmitMessageParams) => {
    socket.emit(
      event,
      {
        content,
        to,
      },
      setTimeout(callback!, 3000),
    );
  };

  return { connect, emitMessage };
};
