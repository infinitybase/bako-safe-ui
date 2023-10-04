import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

/* TODO: Wait design finish to set styles */
const baseStyle = defineStyle({
  field: {
    borderRadius: 10,
  },
});

const variantCustom = defineStyle((props) => {
  const { colorScheme: c } = props;
  return {
    field: {
      bg: `${c}.200`,
      color: 'grey.500',
      fontSize: 'lg',
      borderColor: `${c}.100`,
      py: 4,
      px: 5,
      _hover: {
        borderColor: `${c}.100`,
      },
      _focusVisible: {
        borderColor: `${c}.100`,
      },
      _placeholder: {
        color: 'grey.500',
        fontWeight: 'medium',
      },
    },
    addon: {},
    element: {},
  };
});

const Input = defineStyleConfig({
  baseStyle,
  variants: {
    custom: variantCustom,
  },
});

export { Input };
