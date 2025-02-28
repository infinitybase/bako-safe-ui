import { Button, styled } from '@chakra-ui/react';

import { shakeAnimationY } from '@/modules/core';

export const StyledButton = styled(Button, {
  baseStyle: {
    _hover: {
      span: {
        animation: `${shakeAnimationY} 0.5s ease-in-out;`,
      },
    },
  },
});
