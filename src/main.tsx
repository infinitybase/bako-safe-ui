import { ChakraProvider } from '@chakra-ui/react';
import { defaultConnectors } from '@fuels/connectors';
import { FuelProvider } from '@fuels/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BakoSafe } from 'bakosafe';
import React from 'react';
import ReactDOM from 'react-dom/client';
import TagManager from 'react-gtm-module';

import App from '@/App';
import { BakoSafeQueryClientProvider } from '@/config';
import { TransactionSendProvider } from '@/modules/transactions';
import { defaultTheme } from '@/themes';

import { SocketProvider } from './config/socket';
import WorkspaceProvider from './modules/workspace/WorkspaceProvider';

BakoSafe.setProviders({
  SERVER_URL: import.meta.env.VITE_API_URL,
  CLIENT_URL: window.location.origin,
  CHAIN_URL: import.meta.env.VITE_NETWORK,
});
BakoSafe.setGasConfig({ BASE_FEE: 0.001 });

const gtmId = import.meta.env.VITE_GTM_ID;

const tagManagerArgs = {
  gtmId,
};

const fuelConnectorsQueryClient = new QueryClient();
TagManager.initialize(tagManagerArgs);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={defaultTheme}>
      <QueryClientProvider client={fuelConnectorsQueryClient}>
        <FuelProvider
          fuelConfig={{
            connectors: defaultConnectors() as any,
          }}
        >
          <WorkspaceProvider>
            <SocketProvider>
              <BakoSafeQueryClientProvider>
                <TransactionSendProvider>
                  <App />
                </TransactionSendProvider>
              </BakoSafeQueryClientProvider>
            </SocketProvider>
          </WorkspaceProvider>
        </FuelProvider>
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>,
);
