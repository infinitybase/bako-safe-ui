import { HStack, Text, VStack } from '@chakra-ui/react';

import { Dialog, SquarePlusIcon } from '@/components';
import { useAuth } from '@/modules/auth/hooks';
import { Workspace } from '@/modules/core';

import { UseWorkspaceReturn } from '../../hooks';
import { SelectionEmptyState } from '../';
import { WorkspaceCard } from '../card';

interface SelectWorkspaceDialogProps {
  dialog: UseWorkspaceReturn['workspaceDialog'];
  userWorkspaces: Workspace[];
  onSelect: (workspace: string) => void;
  onCreate: () => void;
  isLoading?: boolean;
}

const SelectWorkspaceDialog = ({
  dialog,
  onSelect,
  userWorkspaces,
  onCreate,
}: SelectWorkspaceDialogProps) => {
  const { workspaces } = useAuth();
  const listIsEmpty = userWorkspaces.length === 0;

  const loggedWorkspace = workspaces.current;

  return (
    <Dialog.Modal
      size={!listIsEmpty ? 'xl' : '2xl'}
      onClose={dialog.onClose}
      hideCloseButton={listIsEmpty ? true : false}
      isOpen={dialog.isOpen}
      closeOnOverlayClick={false}
    >
      <Dialog.Body position="relative" justifyItems="center" maxW={480}>
        <VStack spacing={2}>
          {!listIsEmpty && (
            <VStack
              w="full"
              h={24}
              align="flex-start"
              position="absolute"
              overflow="visible"
              justifyContent="space-evenly"
              top={-10}
              spacing={0}
            >
              <Text fontSize="2xl" fontWeight="bold" color="white">
                Select your workspace
              </Text>
              <Text fontSize="md" variant="description" fontWeight="normal">
                {`We're thrilled. Select your workspace to have you here. `}
              </Text>
            </VStack>
          )}

          <VStack
            spacing={5}
            w="full"
            minH={300}
            maxH={380}
            overflowY="scroll"
            marginTop={16}
            py={4}
            pr={4}
            borderTop="1px solid"
            borderBottom="1px solid"
            borderColor="grey.100"
            sx={{
              '&::-webkit-scrollbar': {
                width: '5px',
                maxHeight: '330px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#2C2C2C',
                borderRadius: '30px',
                height: '10px' /* Adjust the height of the scrollbar thumb */,
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
                    w.id !== loggedWorkspace
                      ? onSelect(w.id)
                      : dialog.onClose();
                  }}
                />
              ))
            )}
          </VStack>
          <HStack
            w={!listIsEmpty ? 'full' : 'fit-content'}
            spacing={4}
            mt={4}
            h={12}
          >
            {listIsEmpty && (
              <Dialog.SecondaryAction
                h="full"
                size="lg"
                bgColor="transparent"
                outlineColor="white"
                outline="1px solid"
                onClick={dialog.onClose}
                _hover={{
                  outlineColor: 'brand.500',
                  color: 'brand.500',
                }}
              >
                Cancel
              </Dialog.SecondaryAction>
            )}
            <Dialog.PrimaryAction
              h="full"
              w="full"
              type="submit"
              leftIcon={<SquarePlusIcon fontSize={18} />}
              onClick={onCreate}
              _hover={{
                opacity: 0.8,
              }}
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
