import { Box, Button, HStack, Text } from '@chakra-ui/react';

import { Dialog } from '@/components';

export function ModalLiquidStake() {
  return (
    <Dialog.Modal
      isOpen={true}
      onClose={() => ({})}
      closeOnOverlayClick={false}
    >
      <Dialog.Body>
        <Dialog.Header
          position={{ base: 'static', sm: 'relative' }}
          title="Stake to validator"
          mb={0}
          mt={0}
          titleSxProps={{fontSize: 16}}
        />

        <HStack marginY={{ base: 10 }}></HStack>

        <Dialog.Actions hideDivider={true}>
          <Button variant="primary" width="full">
            Stake
          </Button>
        </Dialog.Actions>
      </Dialog.Body>
    </Dialog.Modal>
  );
}
