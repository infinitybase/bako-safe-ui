import { ChakraBaseProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from '@/App.tsx';
import { defaultTheme } from '@/themes';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraBaseProvider theme={defaultTheme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ChakraBaseProvider>
  </React.StrictMode>,
);
