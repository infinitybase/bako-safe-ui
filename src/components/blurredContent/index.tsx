import { Box } from 'bako-ui';
import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode } from 'react';

interface BlurredContentProps {
  isBlurred: boolean;
  children: ReactNode;
  inline?: boolean;
}

const MotionBox = motion(Box);

export const BlurredContent = ({
  isBlurred,
  children,
  inline = false,
}: BlurredContentProps) => {
  return (
    <Box
      position="relative"
      display={inline ? 'inline-flex' : 'block'}
      alignItems="center"
      justifyContent="center"
      width={inline ? 'fit-content' : '100%'}
    >
      <Box
        style={{
          filter: isBlurred ? 'blur(6px)' : 'blur(0px)',
          transition: 'filter 0.25s ease',
          display: inline ? 'inline-flex' : 'block',
        }}
      >
        {children}
      </Box>

      <AnimatePresence>
        {isBlurred && (
          <MotionBox
            position="absolute"
            inset="-18px"
            background="transparent"
            filter="blur(32px)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            pointerEvents="none"
          />
        )}
      </AnimatePresence>
    </Box>
  );
};
