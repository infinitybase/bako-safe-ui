import { Divider, HStack, Text, VStack } from '@chakra-ui/react';

import { Dialog, SquarePlusIcon } from '@/components';
import { Workspace } from '@/modules/core';

import { UseWorkspaceReturn } from '../../hooks';
import { WorkspaceCard } from '../card';
import { SelectionEmptyState } from '../emptyState';

interface SelectWorkspaceDialogProps {
  dialog: UseWorkspaceReturn['workspaceDialog'];
  userWorkspaces: Workspace[];
  onSelect: (workspace: Workspace) => void;
  onCreate: () => void;
}

const SelectWorkspaceDialog = ({
  dialog,
  onSelect,
  userWorkspaces,
  onCreate,
}: SelectWorkspaceDialogProps) => {
  const listIsEmpty = userWorkspaces.length === 0;

  return (
    <Dialog.Modal
      onClose={dialog.onClose}
      hideCloseButton={true}
      isOpen={dialog.isOpen}
      closeOnOverlayClick={false}
    >
      <Dialog.Body maxW={480}>
        <VStack spacing={2}>
          {!listIsEmpty && (
            <VStack spacing={0}>
              <Text fontSize="3xl" fontWeight="bold" color="brand.500">
                Select your workspace
              </Text>
              <Text fontSize="sm" fontWeight="bold">
                {`We're thrilled to have you here.`}
              </Text>
            </VStack>
          )}

          <VStack
            spacing={8}
            w="full"
            maxH={478}
            my={6}
            overflow="scroll"
            css={{
              '&::-webkit-scrollbar': { width: '0' },
              scrollbarWidth: 'none',
            }}
          >
            {listIsEmpty ? (
              <SelectionEmptyState />
            ) : (
              userWorkspaces.map((w) => (
                <WorkspaceCard
                  key={w.id}
                  workspace={w}
                  counter={{ members: w.members.length, vaults: w.predicates }}
                  onClick={() => onSelect(w)}
                />
              ))
            )}
          </VStack>

          {listIsEmpty && <Divider borderColor="dark.100" mt={0} mb={6} />}

          <HStack spacing={4} h={10}>
            <Dialog.SecondaryAction
              h="full"
              size="lg"
              borderColor={'transparent'}
              outline={'none'}
              onClick={dialog.onClose}
            >
              Cancel
            </Dialog.SecondaryAction>
            <Dialog.PrimaryAction
              h="full"
              type="submit"
              leftIcon={<SquarePlusIcon fontSize={18} />}
              onClick={onCreate}
            >
              Create workspace
            </Dialog.PrimaryAction>
          </HStack>
        </VStack>
      </Dialog.Body>
    </Dialog.Modal>
  );
};

export { SelectWorkspaceDialog };
