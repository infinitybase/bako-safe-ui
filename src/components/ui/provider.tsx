import { ChakraProvider } from '@chakra-ui/react';

import { defaultTheme } from '@/themes';

import { ColorModeProvider, type ColorModeProviderProps } from './color-mode';
import { Toaster } from './toaster';

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={defaultTheme}>
      <ColorModeProvider {...props} />
      <Toaster />
    </ChakraProvider>
  );
}
