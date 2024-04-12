import { atom, useSetAtom } from 'jotai';
import {
  JSONRPCClient,
  JSONRPCServer,
  JSONRPCServerAndClient,
} from 'json-rpc-2.0';
import { createContext, useContext, useEffect } from 'react';

export const connectPayload = atom({}, (get, set, payload) => {
  set(connectPayload, payload);
});
export const txPayload = atom({});

const serverAndClient = new JSONRPCServerAndClient(
  new JSONRPCServer(),
  new JSONRPCClient((request) => {
    console.log('[DAPP]Send request -->>>', request);
    window.parent.postMessage(request, '*');
  }),
);

window.addEventListener('message', (event) => {
  console.log('[DAPP]Recive event -->>>', event);
  // if (event.source !== window.parent) return;
  if (event.data) {
    serverAndClient.receiveAndSend(event.data);
  }
});

const rpcContext = createContext({ rpc: serverAndClient });

export const RPCMethods = () => {
  const setConnectPayload = useSetAtom(connectPayload);
  const setTxPayload = useSetAtom(txPayload);
  const { rpc } = useRPC();

  useEffect(() => {
    rpc.notify('ready', {});
  }, [rpc]);

  useEffect(() => {
    serverAndClient.addMethod('connect', async (payload) => {
      setConnectPayload(payload);
      return { message: 'CONNECTED' };
    });
    serverAndClient.addMethod('tx_request', (payload) => {
      setTxPayload(payload);
    });
    return () => {
      serverAndClient.removeMethod('connect');
    };
  }, [setConnectPayload, setTxPayload]);

  return null;
};

export const RPCProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <rpcContext.Provider value={{ rpc: serverAndClient }}>
      <RPCMethods />
      {children}
    </rpcContext.Provider>
  );
};

export const useRPC = () => {
  return useContext(rpcContext);
};
