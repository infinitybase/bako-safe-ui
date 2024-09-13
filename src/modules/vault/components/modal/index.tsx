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
}

const VaultListModal = ({ vaultId, ...props }: VaultListModalProps) => {
  const {
    screenSizes: { isMobile },
  } = useWorkspaceContext();
  const {
    drawer,
    search,
    request: { vaults, isSuccess, isLoading, isFetching },
    inView,
  } = useVaultDrawer({
    onClose: props.onClose,
    isOpen: props.isOpen,
  });

  const { isOpen, onClose, onOpen } = useDisclosure();

  const isLoadingVaults = inView.inView
    ? !isLoading
    : !isLoading && !isFetching;
  return (
    <>
      <CreateVaultDialog isOpen={isOpen} onClose={onClose} />

      <Dialog.Modal
        onClose={drawer.onClose}
        isOpen={props.isOpen}
        modalContentProps={{
          px: 10,
          py: 10,
        }}
      >
        <Dialog.Body display={isOpen ? 'none' : 'block'}>
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
                // variant="custom"
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
                      name={vault.name}
                      address={vault.predicateAddress}
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
              onClick={onOpen}
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

// return (
//   <Drawer
//     {...props}
//     size="sm"
//     onClose={drawer.onClose}
//     variant="solid-dark"
//     placement="left"
//   >
//     <DrawerOverlay />
//     <DrawerContent>
//       <DrawerHeader mb={10} bg="pink">
//         <VStack alignItems="flex-start" spacing={5}>
//           <HStack w="full" justifyContent="space-between">
//             <Heading fontSize="xl" fontWeight="semibold" color="grey.200">
//               Vault
//             </Heading>
//             <LineCloseIcon
//               fontSize="24px"
//               aria-label="Close window"
//               cursor="pointer"
//               onClick={drawer.onClose}
//             />
//           </HStack>
//           <Text maxWidth={300} variant="description">
//             Select a vault to go to the home page. You can search for a
//             specific vault by name.
//           </Text>
//         </VStack>
//       </DrawerHeader>

//       <Box w="100%" mb={8}>
//         <FormControl>
//           <Input
//             placeholder=" "
//             variant="custom"
//             colorScheme="dark"
//             onChange={search.handler}
//           />
//           <FormLabel>Search</FormLabel>
//           {/* It is important that the Label comes after the Control due to css selectors */}
//         </FormControl>
//       </Box>

//       <DrawerBody
//         py={8}
//         borderTop="1px"
//         borderTopColor="dark.100"
//         css={{ '::-webkit-scrollbar': { width: 0 }, scrollbarWidth: 'none' }}
//       >
//         {isSuccess && !vaults.length && (
//           <Text variant="variant">
//             We {"couldn't"} find any results for <b>“{search.value}”</b> in
//             the vault.
//           </Text>
//         )}

//         <VStack spacing={4}>
//           {!vaults.length && isFetching && (
//             <CustomSkeleton h="90px" w="full" />
//           )}
//           <CustomSkeleton isLoaded={isLoadingVaults}>
//             {vaults?.map((vault) => {
//               return (
//                 <VaultDrawerBox
//                   mt={4}
//                   name={vault.name}
//                   address={vault.predicateAddress}
//                   workspace={vault.workspace}
//                   isActive={vaultId === vault.id}
//                   description={vault.description}
//                   isSingleWorkspace={vault.workspace.single}
//                   onClick={() => drawer.onSelectVault(vault)}
//                 />
//               );
//             })}
//           </CustomSkeleton>
//           <Box ref={inView.ref} />
//         </VStack>
//       </DrawerBody>
//     </DrawerContent>
//   </Drawer>
// );
