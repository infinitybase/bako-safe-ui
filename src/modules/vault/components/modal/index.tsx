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
        size={{ base: 'full', sm: 'md' }}
        modalContentProps={{
          maxH: '100vh',
          h: '780px',
        }}
      >
        <Dialog.Body display="flex" flexDirection="column" flex={1} minH={0}>
          <Dialog.Header
            mt={0}
            mb={0}
            onClose={drawer.onClose}
            w="full"
            title="Select account"
            description="Select the account or create new one."
            titleSxProps={{
              fontSize: 'sm',
              color: 'textPrimary',
              lineHeight: 'shorter',
            }}
            descriptionFontSize="xs"
            descriptionColor="textSecondary"
          />

          <Box
            w="100%"
            mt={{ base: 2, sm: 6 }}
            pb={6}
            px="1px"
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
                  className="peer"
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
            flex={1}
            minH={0}
            overflowY="scroll"
            css={{
              '&::-webkit-scrollbar': { display: 'none' },
              '&::-webkit-scrollbar-thumb': { display: 'none' },
            }}
          >
            {isSuccess && !vaults.length && (
              <Text my={4} fontSize="xs">
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
            pt={6}
            borderTopWidth={1}
            borderColor="gray.550"
            flexShrink={0}
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
