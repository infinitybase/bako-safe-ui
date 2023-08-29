import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { ChakraBaseProvider } from '@chakra-ui/react';
import { defaultTheme } from './themes';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraBaseProvider theme={defaultTheme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ChakraBaseProvider>
  </React.StrictMode>,
);
