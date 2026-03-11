import { Box, Text } from 'bako-ui';
import { useEffect, useState } from 'react';

import { useNetworks } from '@/modules/network/hooks';
import { TESTNET_URL } from '@/modules/network/services';

const TestNetBanner = () => {
  const [fade, setFade] = useState(false);

  const { currentNetwork } = useNetworks();

  const isTestnet = currentNetwork?.url === TESTNET_URL;

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const nearCorner = e.clientX > window.innerWidth - 165 && e.clientY < 140;
      setFade(nearCorner);
    };

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  if (!currentNetwork || !isTestnet) {
    return null;
  }

  return (
    <Box
      position="fixed"
      top={10}
      right={-12}
      rotate="45deg"
      zIndex={1000}
      pointerEvents="none"
      bg="primary.main"
      px={10}
      py={1}
      css={{
        userSelect: 'none',
        transition: 'opacity 0.25s ease',
        opacity: fade ? 0 : 1,
        '@media (hover: none)': {
          display: 'none',
        },
      }}
      display={{ base: 'none', md: 'block' }}
    >
      <Text fontWeight="bold" fontSize="xs" color="white">
        YOU ARE ON TESTNET
      </Text>
    </Box>
  );
};

export { TestNetBanner };
