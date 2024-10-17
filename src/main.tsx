import { ChakraProvider } from '@chakra-ui/react';
import {
  defaultConnectors,
  FueletWalletConnector,
  FuelWalletConnector,
} from '@fuels/connectors';
import { FuelProvider } from '@fuels/react';
import * as Sentry from '@sentry/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import TagManager from 'react-gtm-module';
import { BrowserRouter } from 'react-router-dom';

import App from '@/App';
import { BakoSafeQueryClientProvider } from '@/config';
import { defaultTheme } from '@/themes';

import { SocketProvider } from './config/socket';
import TransactionsProvider from './modules/transactions/providers/TransactionsProvider';
import WorkspaceProvider from './modules/workspace/WorkspaceProvider';
import { getEnvironment } from './utils/enviroment';

const { VITE_SENTRY_DNS } = import.meta.env;

if (VITE_SENTRY_DNS !== '') {
  Sentry.init({
    dsn: VITE_SENTRY_DNS,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.browserProfilingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 1.0,
    tracePropagationTargets: [
      'localhost',
      'https://stg-api.bako.global/',
      'https://hmg-api.bako.global/',
      'https://api.bako.global/',
    ],
    profilesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
  Sentry.setTag('bako.env', getEnvironment());
}

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
          uiConfig={{ suggestBridge: false }}
          fuelConfig={{
            connectors: [
              new FuelWalletConnector(),
              new FueletWalletConnector(),
            ],
          }}
        >
          <SocketProvider>
            <BakoSafeQueryClientProvider>
              <BrowserRouter>
                <TransactionsProvider>
                  <WorkspaceProvider>
                    <App />
                  </WorkspaceProvider>
                </TransactionsProvider>
              </BrowserRouter>
            </BakoSafeQueryClientProvider>
          </SocketProvider>
        </FuelProvider>
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>,
);
