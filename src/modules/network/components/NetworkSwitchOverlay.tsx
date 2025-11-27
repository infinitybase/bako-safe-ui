import { Box, Loader, Text, VStack } from 'bako-ui';

import { useNetworkSwitch } from '../providers/NetworkSwitchProvider';

export const NetworkSwitchOverlay = () => {
  const { isSwitchingNetwork } = useNetworkSwitch();

  if (!isSwitchingNetwork) return null;

  return (
    <Box
      position="fixed"
      inset={0}
      bg="rgba(13, 13, 12, 0.8)"
      zIndex={9999}
      display="flex"
      alignItems="center"
      justifyContent="center"
      style={{ backdropFilter: 'blur(4px)' }}
    >
      <VStack gap={4}>
        <Loader
          borderWidth="3px"
          css={{ '--spinner-track-color': 'colors.yellow.100' }}
          w="40px"
          h="40px"
        />
        <Text color="grey.75" fontSize="sm">
          Switching network...
        </Text>
      </VStack>
    </Box>
  );
};
