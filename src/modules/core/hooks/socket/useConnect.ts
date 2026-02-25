import { TransactionRequestLike } from 'fuels';
import { useContext } from 'react';

import { SocketContext } from '@/config/socket';

export enum SocketEvents {
  CONNECT = 'connection',
  DEFAULT = 'message',
  NOTIFICATION = 'notification',

  CONNECTED = '[CONNECTED]',
  DISCONNECTED = '[CLIENT_DISCONNECTED]',

  TX_CREATE = '[TX_EVENT_CREATED]',
  TX_SIGN = '[TX_EVENT_SIGNED]',
  TX_REQUEST = '[TX_EVENT_REQUESTED]',
  TX_DELETE = '[TX_EVENT_DELETED]',

  TRANSACTION = '[TRANSACTION]',
  TRANSACTION_CREATED = '[CREATED]',
  TRANSACTION_SIGNED = '[SIGNED]',
  TRANSACTION_CANCELLED = '[CANCELLED]',
  NEW_TRANSACTION = '[NEW_TRANSACTION]',

  BALANCE_OUTDATED_USER = '[BALANCE_OUTDATED_USER]',
  BALANCE_OUTDATED_PREDICATE = '[BALANCE_OUTDATED_PREDICATE]',

  CHANGE_NETWORK = '[CHANGE_NETWORK]',
  NETWORK_CHANGED = '[NETWORK_CHANGED]',

  SWITCH_NETWORK = '[SWITCH_NETWORK]',
}

export enum SocketRealTimeNotifications {
  VAULT = '[VAULT]',
  NEW_NOTIFICATION = '[NEW_NOTIFICATION]',
  TRANSACTION = '[TRANSACTION]',
}

export enum SocketUsernames {
  UI = '[UI]',
  CONNECTOR = '[CONNECTOR]',
  API = '[API]',
}

/**
 * Enum with names of connectors used by the Fuel Connector that are linked to Bako Safe.
 * Used to identify the connector type in the DApp sign-in flow.
 */
export enum EFuelConnectorsTypes {
  BAKO = 'Bako Safe',
  EVM = 'Ethereum Wallets',
  SOCIAL = 'Social Login',
}

export interface IEventTX_CREATE {
  tx?: TransactionRequestLike;
  operations: any;
  sign?: boolean;
  connectorType?: EFuelConnectorsTypes;
}

export interface IEventTX_SIGN {
  hash: string;
  signedMessage: string;
  connectorType?: EFuelConnectorsTypes;
}

export interface IDefaultMessage<D extends any> {
  username: string;
  room: string;
  to: SocketUsernames;
  type: SocketEvents;
  request_id: string;
  data: D;
}

export interface ISocketConnectParams {
  username: string;
  param: SocketUsernames;
  sessionId: string;
  origin: string;
  connectionAlert?: {
    event: string;
    content: { [key: string]: string };
  };
  callbacks?: { [key: string]: (data: any) => void };
}
export enum BakoSafeConnectors {
  ACCOUNTS = 'accounts',
  CURRENT_ACCOUNT = 'currentAccount',
  TRANSACTION_CREATED = '[TRANSACTION_CREATED]',
  TRANSACTION_SEND = '[TRANSACTION_SEND]',
  AUTH_CONFIRMED = '[AUTH_CONFIRMED]',
  AUTH_REJECTED = '[AUTH_REJECTED]',
  AUTH_DISCONECT_DAPP = '[AUTH_DISCONECT_DAPP]',
  AUTH_DISCONECT_CONFIRM = '[AUTH_DISCONECT_CONFIRM]',
  CONNECTION = 'connection',
  POPUP_TRANSFER = '[POPUP_TRANSFER]_connected',
  CONNECTED_NETWORK = '[CONNECTED_NETWORK]',
  DEFAULT = 'message',
}

export interface ISocketEmitMessageParams {
  event: BakoSafeConnectors;
  to: string;
  content: { [key: string]: unknown };
  callback?: () => void;
}

export const useSocket = () => {
  const { socket, isConnected } = useContext(SocketContext);
  // const { request_id, origin } = useQueryParams();

  // const socketState = useRef(socket.connected);

  // const connect = useCallback(
  //   (sessionId: string) => {
  //     /*
  //   qualquer info que mandar daqui pelo auth vai ser validadno no middleware
  //   do servidor io.use
  //   */
  //     console.log('socket.connected', socket.connected);
  //     if (socket.connected || socketState.current) return;
  //     socket.auth = {
  //       username: SocketUsernames.UI,
  //       data: new Date(),
  //       sessionId,
  //       origin,
  //       request_id: request_id ?? '',
  //     };

  //     socket.connect();
  //     socketState.current = true;
  //   },
  //   [socketState],
  // );

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

  return { emitMessage, socket, isConnected };
};
