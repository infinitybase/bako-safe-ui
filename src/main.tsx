import { ChakraProvider } from '@chakra-ui/react';
import { BSafe } from 'bsafe';
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from '@/App';
import { BsafeQueryClientProvider } from '@/config';
import { TransactionSendProvider } from '@/modules/transactions';
import { defaultTheme } from '@/themes';

BSafe.setup({
  api_url: import.meta.env.VITE_API_URL,
  bsafe_url: import.meta.env.VERCEL_URL || window.location.origin,
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BsafeQueryClientProvider>
      <ChakraProvider theme={defaultTheme}>
        <TransactionSendProvider>
          <App />
        </TransactionSendProvider>
      </ChakraProvider>
    </BsafeQueryClientProvider>
  </React.StrictMode>,
);
