import { Box, Loader, Text, VStack } from 'bako-ui';
import { AnimatePresence, motion } from 'framer-motion';

import { useNetworkSwitch } from '../providers/NetworkSwitchProvider';

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);

export const NetworkSwitchOverlay = () => {
  const { isSwitchingNetwork } = useNetworkSwitch();

  return (
    <AnimatePresence>
      {isSwitchingNetwork && (
        <MotionBox
          position="fixed"
          inset={0}
          bg="rgba(13, 13, 12, 0.8)"
          zIndex={9999}
          display="flex"
          alignItems="center"
          justifyContent="center"
          style={{ backdropFilter: 'blur(4px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          <MotionVStack
            gap={4}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeOut', delay: 0.1 }}
          >
            <Loader
              borderWidth="3px"
              css={{ '--spinner-track-color': 'colors.yellow.100' }}
              w="40px"
              h="40px"
            />
            <Text color="grey.75" fontSize="sm">
              Switching network...
            </Text>
          </MotionVStack>
        </MotionBox>
      )}
    </AnimatePresence>
  );
};
