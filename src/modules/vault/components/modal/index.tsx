import {
  Box,
  Button,
  DrawerProps,
  FormControl,
  FormLabel,
  Input,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';

import { CustomSkeleton, Dialog } from '@/components';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { CreateVaultDialog } from '../dialog';
import { VaultItemBox } from './box';
import { useVaultDrawer } from './hook';

interface VaultListModalProps extends Omit<DrawerProps, 'children'> {
  vaultId: string;
  onSelect?: (vaultId: string) => void;
  onCloseAll?: () => void;
}

const VaultListModal = ({
  vaultId,
  onCloseAll,
  ...props
}: VaultListModalProps) => {
  const {
    screenSizes: { isMobile, isSmall },
  } = useWorkspaceContext();
  const {
    drawer,
    search,
    request: { vaults, isSuccess, isLoading, isFetching },
    inView,
  } = useVaultDrawer({
    onClose: props.onClose,
    isOpen: props.isOpen,
    onCloseAll,
  });

  const {
    isOpen: isCreateVaultModalOpen,
    onClose: createVaultModalOnClose,
    onOpen: createVaultModalOnOpen,
  } = useDisclosure();

  const isLoadingVaults = inView.inView
    ? !isLoading
    : !isLoading && !isFetching;
  return (
    <>
      <CreateVaultDialog
        isOpen={isCreateVaultModalOpen}
        onClose={createVaultModalOnClose}
        onCreate={onCloseAll}
      />

      <Dialog.Modal
        autoFocus={false}
        onClose={drawer.onClose}
        isOpen={isCreateVaultModalOpen ? false : props.isOpen}
        modalContentProps={{
          px: 10,
          py: 10,
          maxHeight: '$100vh',
        }}
      >
        <Dialog.Body>
          <Dialog.Header
            mt={0}
            mb={0}
            onClose={drawer.onClose}
            w="full"
            maxW={{ base: 480, xs: 'unset' }}
            title="Select vault"
            description="Select the vault or create new one"
            descriptionFontSize="12px"
            titleSxProps={{
              fontSize: '16px',
              fontWeight: 700,
              lineHeight: '19.36px',
            }}
          />

          <Box
            w="100%"
            mt={6}
            pb={6}
            borderBottomWidth={1}
            borderColor="grey.425"
          >
            <FormControl>
              <Input
                placeholder=" "
                bg="transparent"
                colorScheme="dark"
                onChange={search.handler}
              />
              <FormLabel>Search</FormLabel>
              {/* It is important that the Label comes after the Control due to css selectors */}
            </FormControl>
          </Box>

          <VStack
            w="full"
            minH={300}
            maxH={{ base: 605, xs: 555, sm: 380, md: 500 }}
            overflowY="scroll"
            sx={{
              '&::-webkit-scrollbar': {
                display: 'none',
              },
              '&::-webkit-scrollbar-thumb': {
                display: 'none',
              },
            }}
          >
            {isSuccess && !vaults.length && (
              <Text variant="variant">
                We {"couldn't"} find any results for <b>“{search.value}”</b> in
                the vault.
              </Text>
            )}

            <VStack spacing={4} w="full">
              {!vaults.length && isFetching && (
                <CustomSkeleton h="90px" w="full" />
              )}
              <CustomSkeleton isLoaded={isLoadingVaults}>
                {vaults?.map((vault) => {
                  return (
                    <VaultItemBox
                      key={vault.id}
                      mt={4}
                      name={vault.name}
                      address={vault.predicateAddress}
                      root={vault.root}
                      // workspace={vault.workspace}
                      isActive={vaultId === vault.id}
                      members={vault.members?.length}
                      onClick={() => drawer.onSelectVault(vault)}
                      // isSingleWorkspace={vault.workspace.single}
                    />
                  );
                })}
              </CustomSkeleton>
              <Box ref={inView.ref} />
            </VStack>
          </VStack>

          <Dialog.Actions
            position={isMobile ? 'absolute' : 'relative'}
            bottom={0}
            pb={isMobile && !isSmall ? 10 : 'unset'}
            borderRadius={isMobile && !isSmall ? '20px' : 'unset'}
            left={0}
            right={0}
            px={isMobile ? 10 : 'unset'}
            bg={isMobile ? 'dark.950' : 'unset'}
            sx={{
              '&>hr': {
                marginTop: '0',
              },
            }}
          >
            <Button
              fontSize="14px"
              lineHeight="15.85px"
              fontWeight="normal"
              letterSpacing=".5px"
              variant="outline"
              color="grey.75"
              borderColor="grey.75"
              w="full"
              _hover={{
                bg: '#f5f5f513',
              }}
              onClick={createVaultModalOnOpen}
            >
              Create new vault
            </Button>
          </Dialog.Actions>
        </Dialog.Body>
      </Dialog.Modal>
    </>
  );
};

export { VaultListModal };
