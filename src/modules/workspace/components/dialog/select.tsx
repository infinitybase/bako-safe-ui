import { Divider, HStack, Text, VStack } from '@chakra-ui/react';

import { Dialog, SquarePlusIcon } from '@/components';
import { CookieName, CookiesConfig } from '@/config/cookies';
import { Workspace } from '@/modules/core';

import { UseWorkspaceReturn } from '../../hooks';
import { SelectionEmptyState } from '../';
import { WorkspaceCard } from '../card';

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

  const loggedWorkspace = JSON.parse(
    CookiesConfig.getCookie(CookieName.WORKSPACE)!,
  ).id;

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
            <VStack overflow="visible" spacing={0}>
              <Text fontSize="3xl" fontWeight="bold" color="brand.500">
                Select your workspace
              </Text>
              <Text fontSize="sm" fontWeight="bold">
                {`We're thrilled to have you here.`}
              </Text>
            </VStack>
          )}

          <VStack
            spacing={7}
            w="full"
            maxH={340}
            overflowY="scroll"
            paddingRight={6}
            css={{
              '&::-webkit-scrollbar': {
                width: '5px',
                height: '5px' /* Adjust the height of the scrollbar */,
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#2C2C2C',
                borderRadius: '20px',
                height: '20px' /* Adjust the height of the scrollbar thumb */,
              },
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
                  onClick={() => {
                    w.id !== loggedWorkspace ? onSelect(w) : dialog.onClose();
                  }}
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
