import socket from './useSocketConfig';
export enum SocketEvents {
  //auth
  CONNECTION = 'connection',
  DISCONNECT = 'disconnect',
  USER_CONNECTED = '[USER_CONNECTED]',

  //popup transfer
  TRANSACTION_CREATED = '[TRANSACTION_CREATED]',
  TRANSACTION_SEND = '[TRANSACTION_SEND]',

  //popup auth
  AUTH_CONFIRMED = '[AUTH_CONFIRMED]',
  AUTH_REJECTED = '[AUTH_REJECTED]',
}
export enum UserTypes {
  WALLET = '[WALLET]',
  POPUP_AUTH = '[POPUP_AUTH]',
  POPUP_TRANSFER = '[POPUP_TRANSFER]',
}

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

export interface ISocketEmitMessageParams {
  event: SocketEvents;
  to: string;
  content: { [key: string]: string };
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
    console.log('CONNETION_CALLER');
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
      setTimeout(callback!, 1000),
    );
  };

  return { connect, emitMessage };
};
