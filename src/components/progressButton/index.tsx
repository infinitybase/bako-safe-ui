import { Box, Button, ButtonProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

import { createGTMCustomEvent } from '@/utils';

interface ProgressButtonProps
  extends Omit<ButtonProps, 'children' | 'position' | 'overflow'> {
  children: ReactNode;
  progress: number;
  progressColor?: string;
}

const ProgressButton = ({
  children,
  progress,
  progressColor,
  onClick,
  ...rest
}: ProgressButtonProps) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    createGTMCustomEvent({
      eventName: `${children} button click`,
      buttonId: `${children} button click`,
    });

    onClick?.(e);
  };

  return (
    <Button
      position="relative"
      overflow="hidden"
      onClick={handleClick}
      {...rest}
    >
      <Box zIndex={1}>{children}</Box>

      <Box
        position="absolute"
        top={0}
        left={0}
        h="full"
        w={`${progress}%`}
        bg={progressColor || 'grey.50'}
        transition="width 0.5s ease"
        borderTopRightRadius={8}
        borderBottomRadius={8}
      />
    </Button>
  );
};

export { ProgressButton };
