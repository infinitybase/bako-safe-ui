import { extendBaseTheme } from '@chakra-ui/react';
import chakraTheme from '@chakra-ui/theme';

const defaultTheme = extendBaseTheme({
  ...chakraTheme,
});

export { defaultTheme };
