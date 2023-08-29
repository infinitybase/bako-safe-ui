import { extendBaseTheme, withDefaultColorScheme } from '@chakra-ui/react';
import chakraTheme from '@chakra-ui/theme';

const defaultTheme = extendBaseTheme({
  ...chakraTheme,
  fonts: {
    heading: `Inter, sans-serif`,
    body: `Inter, sans-serif`,
  },
  colors: {
    brand: {
      50: '#d5e8d6',
      100: '#b7efc7',
      200: '#98efb2',
      300: '#8aeea6',
      400: '#7cef9f',
      500: '#70F196',
      600: '#57d57d',
      700: '#369352',
      800: '#154623',
      900: '#0D3921',
    },
    dark: {
      100: '#23262D',
      200: '#21242a',
      500: '#191B20',
    },
    error: '#7b3636',
  },
  styles: {
    global: () => ({
      body: {
        bg: '#23262D',
        color: '#FFFFFF',
      },
    }),
  },
  ...withDefaultColorScheme({
    colorScheme: 'brand',
  }),
});

export { defaultTheme };
