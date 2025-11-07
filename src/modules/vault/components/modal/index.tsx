import {
  Box,
  Button,
  DrawerRootProps,
  Field,
  floatingStyles,
  Input,
  Loader,
  Text,
  VStack,
} from 'bako-ui';

import { CustomSkeleton, Dialog } from '@/components';
import { useDisclosure } from '@/modules/core/hooks/useDisclosure';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

import { CreateVaultDialog } from '../dialog';
import { useVaultDrawer } from './hook';
import { VaultList } from './VaultList';

interface VaultListModalProps extends Omit<DrawerRootProps, 'children'> {
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
    onClose: () => props.onOpenChange?.({ open: false }),
    isOpen: props.open,
    onCloseAll,
  });

  const {
    isOpen: isCreateVaultModalOpen,
    onOpen: createVaultModalOnOpen,
    onOpenChange: createVaultModalOnOpenChange,
  } = useDisclosure();

  return (
    <>
      <CreateVaultDialog
        open={isCreateVaultModalOpen}
        onOpenChange={createVaultModalOnOpenChange}
        onCreate={onCloseAll}
      />

      <Dialog.Modal
        onOpenChange={(e) => (e.open ? undefined : drawer.onClose())}
        open={props.open}
        size="md"
        modalContentProps={{
          px: 10,
          py: 10,
          maxHeight: '100vh',
        }}
        modalBodyProps={{
          overflow: 'visible',
        }}
      >
        <Dialog.Body display={isCreateVaultModalOpen ? 'none' : 'block'}>
          <Dialog.Header
            mt={0}
            mb={0}
            onClose={drawer.onClose}
            w="full"
            maxW={{ base: 480, sm: 'unset' }}
            title="Select account"
            description="Select the account or create new one"
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
            borderColor="gray.550"
          >
            <Field.Root>
              <Box position="relative" w="full">
                <Input
                  placeholder=" "
                  bg="transparent"
                  onChange={search.handler}
                  pt={2}
                  px={3}
                />
                <Field.Label
                  css={floatingStyles({
                    hasValue: !!search.value,
                  })}
                >
                  Search
                </Field.Label>
              </Box>
            </Field.Root>
          </Box>

          <VStack
            w="full"
            minH={300}
            maxH={{ base: `calc(100vh - 350px)`, sm: 555, md: 500 }}
            overflowY="scroll"
            css={{
              '&::-webkit-scrollbar': { display: 'none' },
              '&::-webkit-scrollbar-thumb': { display: 'none' },
            }}
          >
            {isSuccess && !vaults.length && (
              <Text>
                We {"couldn't"} find any results for <b>“{search.value}”</b> in
                the vault.
              </Text>
            )}

            <VStack marginBottom={4} w="full">
              {isLoading && vaults.length === 0 && (
                <VStack gap={4} w="full" pt={4}>
                  <Loader size="md" borderWidth="4px" color="brand.500" />
                </VStack>
              )}
              <CustomSkeleton loading={isLoading}>
                <VaultList
                  vaults={vaults}
                  currentVaultId={vaultId}
                  onSelectVault={drawer.onSelectVault}
                />
              </CustomSkeleton>
              <Box ref={inView.ref} />
              {isFetching && vaults.length > 0 && (
                <Box py={4}>
                  <Loader size="sm" borderWidth="3px" color="brand.500" />
                </Box>
              )}
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
            css={{
              '&>hr': {
                marginTop: '0',
              },
            }}
            hideDivider
          >
            <Button
              fontWeight="normal"
              letterSpacing=".5px"
              variant="subtle"
              w="full"
              onClick={createVaultModalOnOpen}
              aria-label="Create new account"
            >
              Create new account
            </Button>
          </Dialog.Actions>
        </Dialog.Body>
      </Dialog.Modal>
    </>
  );
};

export { VaultListModal };
