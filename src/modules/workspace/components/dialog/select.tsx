import { Divider, HStack, VStack } from '@chakra-ui/react';

import { Dialog, SquarePlusIcon } from '@/components';
import { DialogActions } from '@/components/dialog/actions';
import { useAuth } from '@/modules/auth/hooks';
import { useScreenSize, Workspace } from '@/modules/core';

import { UseWorkspaceReturn } from '../../hooks';
import { SelectionEmptyState } from '../';
import { WorkspaceCard } from '../card';

interface SelectWorkspaceDialogProps {
  dialog: UseWorkspaceReturn['workspaceDialog'];
  userWorkspaces: Workspace[];
  onSelect: (workspace: string) => void;
  onCreate: () => void;
  isLoading?: boolean;
  isCreatingWorkspace?: boolean;
}

const SelectWorkspaceDialog = ({
  dialog,
  onSelect,
  userWorkspaces,
  onCreate,
  isCreatingWorkspace,
}: SelectWorkspaceDialogProps) => {
  const { workspaces } = useAuth();
  const listIsEmpty = userWorkspaces.length === 0;
  const { isMobile, isExtraSmallDevice } = useScreenSize();

  const openDialog = dialog.isOpen && !isCreatingWorkspace;

  const loggedWorkspace = workspaces.current;

  return (
    <Dialog.Modal
      size={{ base: 'full', sm: !listIsEmpty ? 'xl' : '2xl' }}
      onClose={dialog.onClose}
      isOpen={openDialog}
      closeOnOverlayClick={false}
      blockScrollOnMount={isMobile}
    >
      {!listIsEmpty ? (
        <Dialog.Header
          hideCloseButton={false}
          onClose={dialog.onClose}
          maxW={450}
          position="relative"
          h={20}
          mt={0}
          mb={-12}
          title="Select your workspace"
          description={`We're thrilled. Select your workspace to have you here. `}
        />
      ) : (
        <Dialog.Header
          zIndex={10}
          hideCloseButton={false}
          onClose={dialog.onClose}
          maxW={450}
          position="relative"
          h={6}
          mt={0}
          mb={-5}
          title=""
          description=""
        />
      )}

      <Dialog.Body
        position="relative"
        justifyItems="center"
        alignItems="center"
        maxH="full"
        maxW={480}
      >
        <VStack>
          <VStack
            h={isExtraSmallDevice ? 400 : isMobile ? '100vh' : 'unset'}
            maxH={560}
            minH={300}
            spacing={5}
            w="full"
            overflowY="scroll"
            marginTop={listIsEmpty ? 4 : 16}
            py={4}
            gap={4}
            borderColor="grey.100"
            sx={{
              '&::-webkit-scrollbar': {
                display: 'none',
                width: '5px',
                maxHeight: '330px',
                backgroundColor: '#2B2927',
              },
              '&::-webkit-scrollbar-thumb': {
                display: 'none',
                backgroundColor: 'grey.250',
                borderRadius: '30px',
                height: '10px' /* Adjust the height of the scrollbar thumb */,
              },
            }}
          >
            {listIsEmpty ? (
              <SelectionEmptyState />
            ) : (
              <>
                {userWorkspaces.map((w) => (
                  <WorkspaceCard
                    key={w.id}
                    workspace={w}
                    counter={{
                      members: w.members.length,
                      vaults: w.predicates,
                    }}
                    onClick={() => {
                      w.id !== loggedWorkspace
                        ? onSelect(w.id)
                        : dialog.onClose();
                    }}
                  />
                ))}
                <Divider position="absolute" top={16} w="full" left={0} />
              </>
            )}
          </VStack>
        </VStack>
      </Dialog.Body>
      <DialogActions
        mt={isExtraSmallDevice ? 0 : 'auto'}
        maxW={480}
        hideDivider={listIsEmpty}
        sx={{
          '& > hr': {
            marginTop: '0',
          },
        }}
      >
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
