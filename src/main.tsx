import { ChakraProvider } from '@chakra-ui/react';
import { defaultConnectors } from '@fuels/connectors';
import { FuelProvider } from '@fuels/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BakoSafe } from 'bakosafe';
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from '@/App';
import { BakoSafeQueryClientProvider } from '@/config';
import { TransactionSendProvider } from '@/modules/transactions';
import { defaultTheme } from '@/themes';

import { SocketProvider } from './config/socket';

BakoSafe.setProviders({
  SERVER_URL: import.meta.env.VITE_API_URL,
  CLIENT_URL: window.location.origin,
  CHAIN_URL: import.meta.env.VITE_NETWORK,
});
BakoSafe.setGasConfig({ BASE_FEE: 0.001 });

const fuelConnectorsQueryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={defaultTheme}>
      <QueryClientProvider client={fuelConnectorsQueryClient}>
        <FuelProvider
          fuelConfig={{
            connectors: defaultConnectors() as any,
          }}
        >
          <SocketProvider>
            <BakoSafeQueryClientProvider>
              <TransactionSendProvider>
                <App />
              </TransactionSendProvider>
            </BakoSafeQueryClientProvider>
          </SocketProvider>
        </FuelProvider>
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>,
);
