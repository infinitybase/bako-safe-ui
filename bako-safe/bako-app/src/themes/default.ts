import { extendTheme } from '@chakra-ui/react';

import NewHomeBackgroundHd from '@/assets/new-home-bg.jpg';
import { colors } from '@/themes/colors';
import { components } from '@/themes/components';
import { fonts } from '@/themes/fonts';

const breakpoints = {
  mxs: '30', //480px
  xs: '37.5em', //600px
  sm: '52em', //832px
  md: '62em', // 992px
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
        bg: 'dark.950',
        mx: 'auto',
        backgroundImage: `url(${NewHomeBackgroundHd})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        color: '#FFFFFF',
        fontSize: {
          base: 'sm',
          sm: 'md',
        },
      },
      html: {
        bg: 'transparent',
      },

      '#chakra-toast-manager-top-right': {
        mt: 20,
      },
    }),
  },
});

export { defaultTheme };
