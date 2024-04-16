import { BSAFEConnectorEvents } from 'bsafe';
import { useContext } from 'react';

import { SocketContext } from '@/config/socket';

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
  event: BSAFEConnectorEvents;
  to: string;
  content: { [key: string]: unknown };
  callback?: () => void;
}

export const useSocket = () => {
  const socket = useContext(SocketContext); // Use o hook useContext para acessar o contexto

  const connect = (sessionId: string) => {
    /* 
    qualquer info que mandar daqui pelo auth vai ser validadno no middleware
    do servidor io.use
    */
    socket.auth = {
      username: `[UI]`,
      data: new Date(),
      sessionId,
      origin,
    };
    socket.connect();
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

  return { connect, emitMessage, socket };
};
