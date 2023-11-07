import { Box, Card } from '@chakra-ui/react';

import { VaultDrawer } from '@/modules/vault';

import { useAuthSocket } from '../hooks';

const DappPage = () => {
  const { emitEvent } = useAuthSocket();

  return (
    <Box display="flex" alignItems="center" justifyContent="center" h="100vh">
      <Card
        w="full"
        maxW={{ base: 'xs', md: 'md' }}
        p={20}
        bgColor="dark.300"
        display="flex"
        justifyContent="center"
        flexDirection="column"
        alignItems="center"
      >
        <VaultDrawer
          isOpen={true}
          onClose={() => {
            window.close();
          }}
          onSelect={(id: string) => {
            emitEvent({
              vaultId: id,
            });
          }}
          vaultId={undefined!}
        />
      </Card>
    </Box>
  );
};

export { DappPage };
