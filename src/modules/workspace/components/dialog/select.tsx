import { Text, VStack } from '@chakra-ui/react';

import { Dialog, SquarePlusIcon } from '@/components';
import { Workspace } from '@/modules/core';

import { UseWorkspaceReturn } from '../../hooks';
import { WorkspaceCard } from '../card';

interface SelectWorkspaceDialogProps {
  // form: UseAddressBookReturn['form'];
  dialog: UseWorkspaceReturn['workspaceDialog'];
  // isLoading: boolean;
}

const workspaceMock: Workspace = {
  id: '7790ade1-7246-488a-bbdc-8735fec8d4f7',
  name: 'singleWorkspace[f93da2d1-c3a9-4e51-8851-eb7a8675320e]',
  avatar: 'https://app.bsafe.pro/icons/16965892194863.png',
  description: 'https://app.bsafe.pro/icons/16965892194863.png',
  permissions: {
    'f93da2d1-c3a9-4e51-8851-eb7a8675320e': {
      OWNER: ['*'],
      ADMIN: ['*'],
      MANAGER: ['*'],
      SIGNER: ['*'],
      VIEWER: ['*'],
    },
  },
  single: true,
};

const SelectWorkspaceDialog = ({ dialog }: SelectWorkspaceDialogProps) => {
  return (
    <Dialog.Modal
      onClose={dialog.onClose}
      hideCloseButton={true}
      isOpen={dialog.isOpen}
      closeOnOverlayClick={false}
    >
      <Dialog.Body maxW={420}>
        <VStack spacing={0}>
          <VStack spacing={0}>
            <Text fontSize="3xl" fontWeight="bold" color="brand.500">
              Select your workspace
            </Text>
            <Text fontSize="sm" fontWeight="bold">
              {`We're thrilled to have you here.`}
            </Text>
          </VStack>

          <VStack bg="dark.900" w="full" h={320} my={6}>
            {Array(5)
              .fill(workspaceMock)
              .map((w) => (
                <WorkspaceCard key={w.id} workspace={w} />
              ))}
          </VStack>

          <Dialog.PrimaryAction
            type="submit"
            leftIcon={<SquarePlusIcon />}
            onClick={() => alert('Create workspace')}
            // isDisabled={isLoading}
            // isLoading={isLoading}
          >
            {'Create workspace'}
          </Dialog.PrimaryAction>
        </VStack>
      </Dialog.Body>
    </Dialog.Modal>
  );
};

export { SelectWorkspaceDialog };
