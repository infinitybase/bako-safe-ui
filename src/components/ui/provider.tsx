import { ThemeProvider } from 'bako-ui';

import theme from '@/themes';

import { ColorModeProvider, ColorModeProviderProps } from './color-mode';
import { Toaster } from './toaster';

export function Provider(props: ColorModeProviderProps) {
  return (
    <ThemeProvider value={theme}>
      <ColorModeProvider {...props} />
      <Toaster />
    </ThemeProvider>
  );
}
