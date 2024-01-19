import React from 'react';

import { Dialog, SquarePlusIcon } from '@/components';

const voidFunction = () => {};

const CreateWorkspacePage = () => {
  return (
    /* TODO: Create a component for dialog and form */
    <Dialog.Modal isOpen onClose={voidFunction}>
      <Dialog.Header title="Hello" description="Hello" />

      <Dialog.Body>form here</Dialog.Body>

      <Dialog.Actions maxW={420}>
        <Dialog.SecondaryAction onClick={voidFunction}>
          Close
        </Dialog.SecondaryAction>
        <Dialog.PrimaryAction
          onClick={voidFunction}
          leftIcon={<SquarePlusIcon />}
          isDisabled={false}
          isLoading={false}
        >
          Continue
        </Dialog.PrimaryAction>
      </Dialog.Actions>
    </Dialog.Modal>
  );
};

export { CreateWorkspacePage };
