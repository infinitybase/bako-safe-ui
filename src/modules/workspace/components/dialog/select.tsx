import { HStack, Separator, VStack } from '@chakra-ui/react';

import { Dialog, SquarePlusIcon } from '@/components';
import { DialogActions } from '@/components/dialog/actions';
import { Workspace } from '@/modules/core';

import { UseWorkspaceReturn } from '../../hooks';
import { useWorkspaceContext } from '../../WorkspaceProvider';
import { WorkspaceCard } from '../card';
import { SelectionEmptyState } from '../index';

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
  const {
    authDetails: {
      userInfos: { workspace },
    },
  } = useWorkspaceContext();
  const listIsEmpty = userWorkspaces.length === 0;

  const openDialog = dialog.isOpen && !isCreatingWorkspace;

  const loggedWorkspace = workspace?.id;

  return (
    <Dialog.Modal
      size={{ base: 'full', sm: !listIsEmpty ? 'xl' : 'xl' }}
      onOpenChange={dialog.onOpenChange}
      open={openDialog}
      closeOnInteractOutside={false}
    >
      <VStack
        position={{ base: 'fixed', sm: 'unset' }}
        px={{ base: 6, sm: 'unset' }}
        justifyContent="center"
        w="full"
        py={0}
        m={0}
        zIndex={400}
        bg="dark.950"
        h={{ base: 24, sm: 'unset' }}
      >
        {!listIsEmpty ? (
          <>
            <Dialog.Header
              hideCloseButton={false}
              onClose={dialog.onClose}
              maxW={450}
              position="relative"
              mt={0}
              mb={0}
              h={16}
              title="Select your workspace"
              description={`We're thrilled. Select your workspace to have you here. `}
            />
          </>
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
      </VStack>

      <Dialog.Body
        justifyItems="center"
        alignItems="center"
        maxH="full"
        maxW={480}
        position="relative"
      >
        <VStack
          marginTop={{ base: 24, sm: 8 }}
          minH={300}
          maxH={{ base: 605, sm: 380 }}
          w="full"
          overflowY="scroll"
          py={4}
          gap={4}
          borderColor="grey.100"
          css={{
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
                    members: w.members?.length,
                    vaults: w.predicates,
                  }}
                  onClick={() => {
                    w.id !== loggedWorkspace
                      ? onSelect(w.id)
                      : dialog.onClose();
                  }}
                />
              ))}
              <Separator
                position="absolute"
                top={{ base: 24, sm: 8 }}
                w="full"
                left={0}
                zIndex={100}
              />
            </>
          )}
        </VStack>
      </Dialog.Body>
      <DialogActions
        position={{ base: 'absolute', sm: 'unset' }}
        bg="dark.950"
        bottom={{ base: 2, sm: 'unset' }}
        px={{ base: 6, sm: 'unset' }}
        mt={{ base: 'unset', sm: 'auto' }}
        maxW={480}
        hideDivider={listIsEmpty}
        css={{
          '& > hr': {
            marginTop: '0',
          },
        }}
      >
        <HStack w="full" gap={4} h={12} mt={listIsEmpty ? 9 : 'unset'}>
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
            onClick={onCreate}
            _hover={{
              opacity: 0.8,
            }}
          >
            <SquarePlusIcon w={5} />
            Create workspace
          </Dialog.PrimaryAction>
        </HStack>
      </DialogActions>
    </Dialog.Modal>
  );
};

export { SelectWorkspaceDialog };
