import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Grid,
  GridItem,
  HStack,
  Icon,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FaRegPlusSquare } from 'react-icons/fa';
import { IoChevronBack } from 'react-icons/io5';

import { CustomSkeleton, HomeIcon, VaultIcon } from '@/components';
import { AddressBookIcon } from '@/components/icons/address-book';
import { TransactionsIcon } from '@/components/icons/transactions';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { Pages, PermissionRoles, useScreenSize } from '@/modules/core';
import { ActionCard } from '@/modules/home/components/ActionCard';
import { useHome } from '@/modules/home/hooks/useHome';
import { useGetCurrentWorkspace } from '@/modules/workspace/hooks/useGetWorkspaceRequest';
import { useWorkspace } from '@/modules/workspace/hooks/useWorkspace';

import {
  AddressBookEmptyState,
  ContactCard,
  CreateContactDialog,
  DeleteContactDialog,
} from '../../components';
import { useAddressBook } from '../../hooks';

const { ADMIN, MANAGER, OWNER } = PermissionRoles;

const AddressBookPage = () => {
  const {
    workspaces: { current, single },
    isSingleWorkspace,
  } = useAuth();
  const {
    form,
    navigate,
    contactDialog,
    contactToEdit,
    contactToDelete,
    handleOpenDialog,
    setContactToDelete,
    listContactsRequest,
    handleDeleteContact,
    deleteContactDialog,
    deleteContactRequest,
    updateContactRequest,
    createContactRequest,
  } = useAddressBook(isSingleWorkspace);

  const { isExtraSmall } = useScreenSize();

  const { data: contacts } = listContactsRequest;

  const { hasPermission, goWorkspace } = useWorkspace();

  const { workspace } = useGetCurrentWorkspace();

  const { goHome } = useHome();

  const hasContacts = !!contacts?.length;
  const workspaceId = current ?? '';

  return (
    <>
      <CreateContactDialog
        form={form}
        dialog={contactDialog}
        isLoading={
          createContactRequest.isLoading || updateContactRequest.isLoading
        }
        isEdit={!!contactToEdit?.id}
      />

      {hasContacts && contactToDelete.nickname && (
        <DeleteContactDialog
          contactToDelete={contactToDelete}
          dialog={deleteContactDialog}
          handleDelete={handleDeleteContact}
          isLoading={deleteContactRequest.isLoading}
        />
      )}

      <VStack
        w="full"
        spacing={6}
        p={{ base: 1, sm: 1 }}
        px={{ base: 'auto', sm: 8 }}
      >
        <Box
          w="full"
          h={{ base: '20', sm: '10' }}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexDir={isExtraSmall ? 'column' : 'row'}
          my={2}
          rowGap={6}
          mb={isExtraSmall ? 6 : 'unset'}
        >
          <HStack w={isExtraSmall ? 'full' : 'unset'}>
            <Button
              w={isExtraSmall ? 'full' : 'unset'}
              variant="primary"
              fontWeight="semibold"
              fontSize={15}
              leftIcon={
                <Box mr={-1}>
                  <IoChevronBack size={22} />
                </Box>
              }
              px={3}
              bg="dark.100"
              color="grey.200"
              onClick={() => (single ? goHome() : goWorkspace(workspaceId))}
            >
              Back home
            </Button>

            <Breadcrumb display={{ base: 'none', sm: 'initial' }} ml={8}>
              <BreadcrumbItem>
                <Icon
                  mr={2}
                  mt={1}
                  as={HomeIcon}
                  fontSize="sm"
                  color="grey.200"
                />
                <BreadcrumbLink
                  fontSize="sm"
                  color="grey.200"
                  fontWeight="semibold"
                  onClick={() => goHome()}
                >
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbItem hidden={isSingleWorkspace}>
                {current && (
                  <BreadcrumbLink
                    fontSize="sm"
                    color="grey.200"
                    fontWeight="semibold"
                    onClick={() => goWorkspace(current)}
                    maxW={40}
                    isTruncated
                  >
                    {workspace?.name}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>

              <BreadcrumbItem>
                <BreadcrumbLink
                  fontSize="sm"
                  color="grey.200"
                  fontWeight="semibold"
                  href="#"
                >
                  Address book
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
          </HStack>

          {hasPermission([OWNER, ADMIN, MANAGER]) && (
            <Box w={isExtraSmall ? 'full' : 'unset'}>
              <Button
                w="full"
                variant="primary"
                fontWeight="bold"
                leftIcon={<FaRegPlusSquare />}
                onClick={() => handleOpenDialog({})}
              >
                Add new favorite
              </Button>
            </Box>
          )}
        </Box>

        <Stack w="full" direction={{ base: 'column', md: 'row' }} spacing={6}>
          <ActionCard.Container
            flex={1}
            onClick={() => navigate(Pages.userVaults({ workspaceId: current }))}
          >
            <ActionCard.Icon icon={VaultIcon} />
            <Box>
              <ActionCard.Title>Vaults</ActionCard.Title>
              <ActionCard.Description>
                Access and Manage All Your Vaults in One Place.
              </ActionCard.Description>
            </Box>
          </ActionCard.Container>

          <ActionCard.Container
            flex={1}
            onClick={() => {
              return navigate(
                Pages.userTransactions({
                  workspaceId: current,
                }),
              );
            }}
          >
            <ActionCard.Icon
              icon={TransactionsIcon}
              //isUpcoming={hasTransactions ? false : true}
            />
            <Box>
              <ActionCard.Title>Transactions</ActionCard.Title>
              <ActionCard.Description>
                Manage Transactions Across All Vaults in One Place.
              </ActionCard.Description>
            </Box>
          </ActionCard.Container>

          <ActionCard.Container
            flex={1}
            onClick={() =>
              navigate(Pages.addressBook({ workspaceId: current }))
            }
          >
            <ActionCard.Icon icon={AddressBookIcon} />
            <Box>
              <ActionCard.Title>Address book</ActionCard.Title>
              <ActionCard.Description>
                Access and Manage Your Contacts for Easy Transfers and Vault
                Creation.
              </ActionCard.Description>
            </Box>
          </ActionCard.Container>
        </Stack>

        <Box mt={4} mb={-4} alignSelf="flex-start">
          <Text
            variant="subtitle"
            fontWeight="semibold"
            fontSize="xl"
            color="grey.200"
          >
            Address book
          </Text>
        </Box>
        {/* USER CONTACTS */}
        <Grid
          w="full"
          templateColumns={{
            base: 'repeat(1, 1fr)',
            xs: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            xl: 'repeat(3, 1fr)',
            '2xl': 'repeat(4, 1fr)',
          }}
          gap={6}
          pb={0}
        >
          {!hasContacts && listContactsRequest.isLoading && (
            <>
              <CustomSkeleton flex={1} h="200px" borderRadius={2} />
              <CustomSkeleton flex={1} h="200px" borderRadius={2} />
            </>
          )}
          {contacts?.map(({ id, nickname, user }) => {
            return (
              <GridItem key={id} display="flex">
                <ContactCard
                  nickname={nickname}
                  address={user.address}
                  avatar={user.avatar}
                  dialog={deleteContactDialog}
                  showActionButtons={hasPermission([OWNER, ADMIN, MANAGER])}
                  handleEdit={() =>
                    handleOpenDialog({
                      address: user.address,
                      nickname,
                      contactToEdit: id,
                    })
                  }
                  handleDelete={() => {
                    setContactToDelete({ id, nickname });
                    deleteContactDialog.onOpen();
                  }}
                />
              </GridItem>
            );
          })}
        </Grid>

        {!hasContacts && !listContactsRequest.isLoading && (
          <AddressBookEmptyState
            showAction={hasPermission([OWNER, ADMIN, MANAGER])}
            action={() => handleOpenDialog({})}
          />
        )}
      </VStack>
    </>
  );
};

export { AddressBookPage };
