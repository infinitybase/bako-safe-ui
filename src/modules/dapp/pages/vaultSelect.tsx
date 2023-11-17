import { Box } from '@chakra-ui/react';

import { VaultConnector } from './VaultConnector';

const VaultSelect = () => {
  return (
    <Box display="flex" justifyContent="center" h="100vh" w="full">
      <VaultConnector />
    </Box>
  );
};

export { VaultSelect };
