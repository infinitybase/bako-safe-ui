import { FueletWalletConnector, FuelWalletConnector } from '@fuels/connectors';
import { FuelProvider } from '@fuels/react';
import { PrivyProvider } from '@privy-io/react-auth';
import * as Sentry from '@sentry/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import TagManager from 'react-gtm-module';
import { BrowserRouter } from 'react-router-dom';

import App from '@/App';
import { Provider } from '@/components/ui/provider';
import { BakoSafeQueryClientProvider } from '@/config';

import { SocketProvider } from './config/socket';
import { NetworkSwitchOverlay } from './modules/network/components/NetworkSwitchOverlay';
import { NetworkSwitchProvider } from './modules/network/providers/NetworkSwitchProvider';
import TransactionsProvider from './modules/transactions/providers/TransactionsProvider';
import { WorkspaceProvider } from './modules/workspace/WorkspaceProvider';
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
const privyAppId = import.meta.env.VITE_PRIVY_APP_ID;
const privyClientId = import.meta.env.VITE_PRIVY_CLIENT_ID;

const tagManagerArgs = {
  gtmId,
};

const fuelConnectorsQueryClient = new QueryClient();
TagManager.initialize(tagManagerArgs);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider>
      <QueryClientProvider client={fuelConnectorsQueryClient}>
        <FuelProvider
          uiConfig={{ suggestBridge: false }}
          networks={[]}
          fuelConfig={{
            connectors: [
              new FuelWalletConnector(),
              new FueletWalletConnector(),
            ],
          }}
        >
          <PrivyProvider
            appId={privyAppId}
            clientId={privyClientId}
            config={{
              loginMethods: ['google', 'email'],
              embeddedWallets: {
                ethereum: {
                  createOnLogin: 'users-without-wallets', // Create a wallet for users who do not have a wallet on login.
                },
              },
              appearance: {
                theme: 'dark',
              },
            }}
          >
            <BakoSafeQueryClientProvider>
              <BrowserRouter>
                <NetworkSwitchProvider>
                  <TransactionsProvider>
                    <WorkspaceProvider>
                      <SocketProvider>
                        <NetworkSwitchOverlay />
                        <App />
                      </SocketProvider>
                    </WorkspaceProvider>
                  </TransactionsProvider>
                </NetworkSwitchProvider>
              </BrowserRouter>
            </BakoSafeQueryClientProvider>
          </PrivyProvider>
        </FuelProvider>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>,
);
