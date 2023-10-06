import { ChakraBaseProvider } from '@chakra-ui/react';
import { DevSupport } from '@react-buddy/ide-toolbox';
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from '@/App';
import { BsafeQueryClientProvider } from '@/config';
import { ComponentPreviews, useInitial } from '@/dev';
import { defaultTheme } from '@/themes';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BsafeQueryClientProvider>
      <ChakraBaseProvider theme={defaultTheme}>
        <DevSupport
          ComponentPreviews={ComponentPreviews}
          useInitialHook={useInitial}
        >
          <App />
        </DevSupport>
      </ChakraBaseProvider>
    </BsafeQueryClientProvider>
  </React.StrictMode>,
);
