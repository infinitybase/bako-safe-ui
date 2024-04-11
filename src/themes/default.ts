import { extendTheme } from '@chakra-ui/react';

import { colors } from '@/themes/colors';
import { components } from '@/themes/components';
import { fonts } from '@/themes/fonts';

const breakpoints = {
  // xs: '23em',
  sm: '62em', // 992px
  md: '62em',
  lg: '72em',
};

const defaultTheme = extendTheme({
  breakpoints,
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
        fontSize: {
          base: 'sm',
          sm: 'md',
        },
      },
      '#chakra-toast-manager-top-right': {
        mt: 20,
      },
    }),
  },
});

export { defaultTheme };
