import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from '@/App';
import { BsafeQueryClientProvider } from '@/config';
import { TransactionSendProvider } from '@/modules';
import { defaultTheme } from '@/themes';

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
