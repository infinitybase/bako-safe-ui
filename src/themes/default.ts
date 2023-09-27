import { extendTheme } from '@chakra-ui/react';

const defaultTheme = extendTheme({
  fonts: {
    heading: `Inter, sans-serif`,
    body: `Inter, sans-serif`,
  },
  colors: {
    brand: {
      500: '#49F8AE',
      600: '#1CF593',
    },
    grey: {
      200: '#C0C0C0',
      500: '#696B65',
    },
    dark: {
      100: '#2C2C2C',
      200: '#1B1A1A',
      300: '#121212',
      500: '#0F0F0F',
    },
    error: {
      500: '#EF9B8F',
      900: 'rgba(248,73,73,0.1)',
    },
    warning: {
      500: '#F59E1C',
      800: 'rgba(245,158,28,0.04)',
      900: 'rgba(245,158,28,0.1)',
    },
    success: {
      500: '#49F8AE',
      900: 'rgba(73,248,174,0.1)',
    },
  },
  styles: {
    global: () => ({
      body: {
        bg: 'dark.500',
        color: '#FFFFFF',
      },
    }),
  },
  components: {
    Text: {
      variants: {
        description: {
          fontSize: 'sm',
          color: 'grey.500',
        },
        subtitle: {
          fontSize: 'md',
          color: 'grey.200',
          fontWeight: 'semibold',
        },
      },
    },
    Heading: {
      variants: {
        'title-xl': {
          fontSize: 'xl',
          fontWeight: 'bold',
          color: 'white',
        },
        'title-md': {
          fontSize: 'md',
          fontWeight: 'bold',
          color: 'white',
        },
      },
    },
    Button: {
      baseStyle: {
        borderRadius: 8,
        fontWeight: 'semibold',
        fontSize: 'md',
        span: {
          marginRight: 4,
        },
      },
      variants: {
        primary: {
          bgColor: 'brand.500',
          color: 'dark.300',
        },
        secondary: {
          bgColor: 'initial',
          borderWidth: 1,
          borderColor: 'grey.500',
          color: 'grey.200',
        },
        icon: {
          bgColor: 'dark.100',
          color: 'grey.200',
          fontSize: 'xl',
        },
      },
    },
    Badge: {
      baseStyle: {
        fontSize: 'xs',
        textTransform: 'initial',
        borderWidth: 1,
        padding: 1.5,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        borderRadius: 8,
      },
      variants: {
        success: {
          bgColor: 'success.900',
          color: 'success.500',
          borderColor: 'success.900',
        },
        error: {
          bgColor: 'error.900',
          color: 'error.500',
          borderColor: 'error.900',
        },
        warning: {
          bgColor: 'warning.900',
          color: 'warning.500',
          borderColor: 'warning.900',
        },
      },
    },
    Avatar: {
      baseStyle: {
        container: {
          borderRadius: 8,
          img: {
            borderRadius: 8,
          },
        },
        excessLabel: {
          borderRadius: 8,
          width: '40px',
          height: '40px',
          bgColor: 'dark.200',
          borderWidth: 2,
          borderColor: 'dark.100',
        },
        badge: {
          borderRadius: 8,
        },
        group: {
          '.chakra-avatar': {
            borderColor: 'brand.600',
            borderWidth: 2,
            width: '40px',
            height: '40px',
            img: {
              borderRadius: 5,
            },
          },
        },
      },
    },
    Link: {
      baseStyle: {
        textDecoration: 'underline',
        fontWeight: 'semibold',
      },
    },
  },
});

export { defaultTheme };
