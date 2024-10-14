import { TransactionRequestLike } from 'fuels';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useQueryParams } from '@/modules/auth/hooks';
import {
  IEventTX_CONFIRM,
  SocketEvents,
  SocketUsernames,
  useSocket,
} from '@/modules/core/hooks';

// import { useSignTransaction } from './useSignTransaction'; [CONNECTOR SIGNATURE]
import { useTransactionSummary } from './useTransactionSummary';

interface IVaultEvent {
  name: string;
  address: string;
  description: string;
  provider: string;
  pending_tx: boolean;
  configurable: string;
  version: string;
}

export type UseTransactionSocket = ReturnType<typeof useTransactionSocket>;

export const useTransactionSocket = () => {
  const [vault, setVault] = useState<IVaultEvent | undefined>({
    name: '',
    address: '',
    description: '',
    provider: '',
    pending_tx: true,
    configurable: '',
    version: '',
  });
  const [validAt, setValidAt] = useState<string | undefined>(undefined);
  const [tx, setTx] = useState<TransactionRequestLike>();
  const [sending, setSending] = useState(false);
  //const [signing, setSigning] = useState(false); [CONNECTOR SIGNATURE]

  const navigate = useNavigate(); // do not remove, makes socket connection work
  const { connect, socket } = useSocket();
  const { sessionId, request_id } = useQueryParams();

  const summary = useTransactionSummary();
  // const { confirmSignTransaction } = useSignTransaction(); [CONNECTOR SIGNATURE]

  //const { isSafariBrowser } = useVerifyBrowserType(); [CONNECTOR SIGNATURE]

  //[CONNECTOR SIGNATURE]
  // const openSignTab = (url: string) => {
  //   const newTab = window.open(`${window.origin}${url}`, '_blank');

  //   if (newTab) {
  //     setTimeout(() => {
  //       window.close();
  //     }, 600);
  //   }
  // };

  //[CONNECTOR SIGNATURE]
  // const handleRedirectToSign = (data: any) => {
  //   console.log('HANDLE_REDIRECT_TO_SIGN');
  //   const queryParams = `${window.location.search}&transaction_id=${data.id}&transaction_hash=${data.hash}`;
  //   const url = `${Pages.dappTransactionSign()}${queryParams}`;

  //   if (isSafariBrowser) {
  //     openSignTab(url);
  //   } else {
  //     navigate(url);
  //   }
  // };

  const handleGetSummary = (data: any) => {
    console.log('GETTING_SUMMARY');
    const { data: content } = data;
    const { vault, tx, validAt } = content;

    setVault(vault);
    setTx(tx);
    setValidAt(validAt);
    summary.getTransactionSummary({
      transactionLike: tx,
      providerUrl: vault.provider,
      configurable: vault.configurable,
    });
  };

  const handleSocketEvent = useCallback((data: any) => {
    console.log('SOCKET EVENT DATA:', data);
    if (data.to !== SocketUsernames.UI) return;

    switch (data.type) {
      // [CONNECTOR SIGNATURE]
      // case SocketEvents.TX_CONFIRM:
      //   handleRedirectToSign(data);
      //   break;
      case SocketEvents.TX_REQUEST:
        handleGetSummary(data);
        break;
      default:
        break;
    }
  }, []);

  const emitCreateTransactionEvent = (
    event: SocketEvents,
    data: IEventTX_CONFIRM,
  ) => {
    if (!data.tx) return;
    setSending(true);

    console.log('[EMITTING CREATE TRANSACTION]');
    socket.emit(event, data);
  };

  const sendTransaction = async () => {
    emitCreateTransactionEvent(SocketEvents.TX_CONFIRM, {
      operations: summary.transactionSummary,
      tx,
    });
  };

  const emitSignedMessage = (message: string) => {
    socket.emit(SocketEvents.DEFAULT, {
      username: SocketUsernames.UI,
      sessionId,
      to: SocketUsernames.CONNECTOR,
      type: SocketEvents.SIGN_CONFIRMED,
      request_id,
      data: {
        signedMessage: message,
      },
    });
  };

  // [CONNECTOR SIGNATURE]
  // const sendTransactionAndRedirectToSign = async () => {
  //   emitCreateTransactionEvent(SocketEvents.TX_CONFIRM, {
  //     operations: summary.transactionSummary,
  //     tx,
  //     sign: true,
  //   });
  // };

  // emmit message to the server and close window
  const cancelSendTransaction = () => {
    socket.emit(SocketEvents.DEFAULT, {
      username: SocketUsernames.UI,
      sessionId,
      to: SocketUsernames.CONNECTOR,
      type: SocketEvents.DISCONNECTED,
      request_id,
      data: {},
    });
  };

  // [CONNECTOR SIGNATURE]
  // const signTransaction = (transacionId: string, transactionHash: string) => {
  //   confirmSignTransaction(transactionHash, (signedMessage: string) => {
  //     setSigning(true);
  //     socket.emit(SocketEvents.TX_SIGN, {
  //       id: transacionId,
  //       hash: transactionHash,
  //       signedMessage,
  //     });
  //   });
  // };

  // [CONNECTOR SIGNATURE]
  // const cancelSignTransaction = () => {
  //   cancelSendTransaction();
  //   isSafariBrowser && window.close();
  // };

  useEffect(() => {
    console.log('SOCKET_CONNECTED:', socket.connected);
    if (!socket.connected) {
      console.log('CONNECTING_SOCKET');
      connect(sessionId!);
      return;
    }

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
    vault,
    summary,
    validAt,
    pendingSignerTransactions: vault?.pending_tx ?? true,
    socket,
    send: {
      isLoading: sending,
      handler: sendTransaction,
      //redirectHandler: sendTransactionAndRedirectToSign, [CONNECTOR SIGNATURE]
      cancel: cancelSendTransaction,
    },
    signMessage: {
      emitSignedMessage,
    },
    // [CONNECTOR SIGNATURE]
    // sign: {
    //   isLoading: signing,
    //   handler: signTransaction,
    //   cancel: cancelSignTransaction,
    // },
  };
};
