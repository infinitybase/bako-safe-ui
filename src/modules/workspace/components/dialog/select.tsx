import { HStack, Text, VStack } from '@chakra-ui/react';

import { Dialog, SquarePlusIcon } from '@/components';
import { DialogActions } from '@/components/dialog/actions';
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
      size={{ base: 'full', sm: !listIsEmpty ? 'xl' : '2xl' }}
      onClose={dialog.onClose}
      hideCloseButton={false}
      isOpen={dialog.isOpen}
      closeOnOverlayClick={false}
    >
      <Dialog.Body
        position="relative"
        justifyItems="center"
        alignItems="center"
        maxH="full"
        maxW={480}
      >
        <VStack>
          {!listIsEmpty && (
            <VStack
              w="full"
              h={24}
              align="flex-start"
              position="absolute"
              overflow="visible"
              justifyContent="space-evenly"
              top={[-8, -10]}
              spacing={0}
            >
              <Text fontSize={['lg', '2xl']} fontWeight="bold" color="white">
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
            marginTop={listIsEmpty ? 4 : 16}
            py={4}
            pr={4}
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
        </VStack>
      </Dialog.Body>
      <DialogActions mt="auto" maxW={480} hideDivider={listIsEmpty}>
        <HStack w="full" spacing={4} h={12} mt={listIsEmpty ? 9 : 'unset'}>
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
      </DialogActions>
    </Dialog.Modal>
  );
};

export { SelectWorkspaceDialog };
