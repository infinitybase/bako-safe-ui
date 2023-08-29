import { ChakraBaseProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from 'react-query';

import App from '@/App.tsx';
import { queryClient } from '@/config';
import { defaultTheme } from '@/themes';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraBaseProvider theme={defaultTheme}>
        <App />
      </ChakraBaseProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
