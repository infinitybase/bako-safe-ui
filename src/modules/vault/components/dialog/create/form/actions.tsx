import { Button, Divider, HStack } from '@chakra-ui/react';
import React from 'react';

import { SquarePlusIcon } from '@/components';

export interface VaultFormActionsProps {
  onCancel: () => void;
  closeText: string;
  onContinue: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  hideContinue?: boolean;
}

const VaultFormActions = (props: VaultFormActionsProps) => (
  <>
    <Divider borderColor="dark.100" my={9} />
    <HStack spacing={4} justifyContent="center">
      <Button
        onClick={props.onCancel}
        variant="secondary"
        bgColor="dark.100"
        border="none"
      >
        {props.closeText}
      </Button>
      <Button
        hidden={props.hideContinue}
        variant="primary"
        onClick={props.onContinue}
        leftIcon={<SquarePlusIcon />}
        isDisabled={props.isDisabled}
        isLoading={props.isLoading}
      >
        Continue
      </Button>
    </HStack>
  </>
);

export { VaultFormActions };
