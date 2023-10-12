import { extendTheme } from '@chakra-ui/react';

import { colors } from '@/themes/colors';
import { components } from '@/themes/components';
import { fonts } from '@/themes/fonts';

const defaultTheme = extendTheme({
  fonts,
  colors,
  components: {
    ...components,
  },
  styles: {
    global: () => ({
      body: {
        bg: 'dark.500',
        color: '#FFFFFF',
      },
    }),
  },
});

export { defaultTheme };
