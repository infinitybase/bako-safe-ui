import socket from './useSocketConfig';

export enum SocketChannel {
  POPUP_AUTH = '[POPUP_AUTH]',
  POPUP_TRANSFER = '[POPUP_TRANSFER]',
  WALLET = '[WALLET]',
}

export const useSocket = () => {
  const connect = (username: string, param: SocketChannel) => {
    /* 
    qualquer info que mandar daqui pelo auth vai ser validadno no middleware
    do servidor io.use
    */
    console.log('[CONNECT]: connection caller');
    socket.auth = {
      username: `${param}${username}`,
      data: new Date(),
    };
    socket.connect();
  };

  /* 
    Existe em duas partes:
      - cliente emite uma mensagem
      - servidor repassa a mensagem para todos os clientes conectados
    do servidor io.use
    */
  const emitMessage = (
    destino: string,
    content: { [key: string]: string; channel: string; to: string },
    callback: () => void,
  ) => {
    console.log('[message]', destino, content);
    const { channel, to, ...rest } = content;
    socket.emit(
      channel,
      {
        content: rest,
        to,
      },
      setTimeout(callback, 1000),
    );
  };

  return { connect, emitMessage };
};
