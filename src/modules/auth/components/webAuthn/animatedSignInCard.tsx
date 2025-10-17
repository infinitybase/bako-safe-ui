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
    opacity: 0.5,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0.5,
  }),
};

const AnimatedSignInCard = ({ mode, children }: AnimatedSignInCardProps) => {
  const direction = mode === WebAuthnModeState.REGISTER ? 1 : -1;

  return (
    <Box position="relative" w="full" overflow="hidden">
      <AnimatePresence initial={false} mode="wait" custom={direction}>
        <MotionBox
          key={mode}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: {
              type: 'spring',
              stiffness: 350,
              damping: 26,
              mass: 0.8,
            },
            opacity: { duration: 0.25, ease: 'easeInOut' },
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
