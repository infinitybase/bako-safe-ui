import { Box } from 'bako-ui';
import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode } from 'react';

import { WebAuthnModeState } from '../../hooks';

interface AnimatedSignInCardProps {
  mode: WebAuthnModeState;
  children: ReactNode;
}

const MotionBox = motion(Box);

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    position: 'absolute' as const,
  }),
  center: {
    x: 0,
    opacity: 1,
    position: 'relative' as const,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    position: 'absolute' as const,
  }),
};

const AnimatedSignInCard = ({ mode, children }: AnimatedSignInCardProps) => {
  const direction = mode === WebAuthnModeState.REGISTER ? 1 : -1;

  return (
    <Box position="relative" w="full" overflow="hidden" minH="200px">
      <AnimatePresence initial={false} mode="popLayout" custom={direction}>
        <MotionBox
          key={mode}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          inset={0}
          transition={{
            x: {
              type: 'spring',
              stiffness: 280,
              damping: 20,
              mass: 0.9,
            },
            opacity: {
              duration: 0.3,
              ease: 'easeInOut',
            },
            position: {
              delay: 0.3,
            },
          }}
          w="full"
        >
          {children}
        </MotionBox>
      </AnimatePresence>
    </Box>
  );
};

export { AnimatedSignInCard };
