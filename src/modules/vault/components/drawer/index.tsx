import { DrawerProps } from '@chakra-ui/react';

import { Dialog } from '@/components';

import { useVaultDrawer } from './hook';

interface VaultDrawerProps extends Omit<DrawerProps, 'children'> {
  vaultId: string;
  onSelect?: (vaultId: string) => void;
}

const VaultDrawer = ({ vaultId, ...props }: VaultDrawerProps) => {
  const {
    drawer,
    search,
    request: { vaults, isSuccess, isLoading, isFetching },
    inView,
  } = useVaultDrawer({
    onClose: props.onClose,
    isOpen: props.isOpen,
  });

  const isLoadingVaults = inView.inView
    ? !isLoading
    : !isLoading && !isFetching;
  return (
    <Dialog.Modal onClose={drawer.onClose} isOpen={props.isOpen}>
      <Dialog.Body>
        <Dialog.Header
          onClose={drawer.onClose}
          w="full"
          maxW={{ base: 480, xs: 'unset' }}
          mt={0}
          title="Select vault"
          description="Select the vault or create new one"
          descriptionFontSize="12px"
          titleSxProps={{
            fontSize: '16px',
            fontWeight: 700,
            lineHeight: '19.36px',
          }}
          pb={6}
          borderBottomWidth={1}
          borderColor="grey.425"
        />
      </Dialog.Body>

      <Dialog.Actions
        mt="auto"
        sx={{
          '&>hr': {
            marginTop: '0',
          },
        }}
      ></Dialog.Actions>
    </Dialog.Modal>
  );
};

export { VaultDrawer };

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
