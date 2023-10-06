import { Button, HStack } from '@chakra-ui/react';
import React from 'react';

import { SquarePlusIcon } from '@/components';

export interface VaultFormActionsProps {
  onCancel: () => void;
  onContinue: () => void;
  isDisabled?: boolean;
}

const VaultFormActions = (props: VaultFormActionsProps) => (
  <HStack spacing={4} justifyContent="center">
    <Button
      onClick={props.onCancel}
      variant="secondary"
      bgColor="dark.100"
      border="none"
    >
      Cancel
    </Button>
    <Button
      variant="primary"
      onClick={props.onContinue}
      leftIcon={<SquarePlusIcon />}
      isDisabled={props.isDisabled}
    >
      Continue
    </Button>
  </HStack>
);

export { VaultFormActions };
