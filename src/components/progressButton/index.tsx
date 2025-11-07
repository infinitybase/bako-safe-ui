import { Box, Button, ButtonProps } from 'bako-ui';
import { ReactNode } from 'react';

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
  ...rest
}: ProgressButtonProps) => {
  return (
    <Button position="relative" overflow="hidden" {...rest}>
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
