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
  Text,
  VStack,
} from '@chakra-ui/react';
import { FaRegPlusSquare } from 'react-icons/fa';
import { GoArrowSwitch } from 'react-icons/go';
import { IoChevronBack } from 'react-icons/io5';

import { CustomSkeleton, HomeIcon, VaultIcon } from '@/components';
import { AddressBookIcon } from '@/components/icons/address-book';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { Pages, PermissionRoles } from '@/modules/core';
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

      <VStack w="full" spacing={6}>
        <HStack w="full" h="10" justifyContent="space-between" my={2}>
          <HStack>
            <Button
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

            <Breadcrumb ml={8}>
              <BreadcrumbItem>
                <Icon mr={2} as={HomeIcon} fontSize="sm" color="grey.200" />
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
            <Box>
              <Button
                variant="primary"
                fontWeight="bold"
                leftIcon={<FaRegPlusSquare />}
                onClick={() => handleOpenDialog({})}
              >
                Add new favorite
              </Button>
            </Box>
          )}
        </HStack>

        <HStack w="full" spacing={6}>
          <ActionCard.Container
            onClick={() =>
              navigate(
                Pages.userVaults({
                  workspaceId,
                }),
              )
            }
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
            onClick={() => {
              navigate(
                Pages.userTransactions({
                  workspaceId,
                }),
              );
            }}
          >
            <ActionCard.Icon icon={GoArrowSwitch} />
            <Box>
              <ActionCard.Title>Transactions</ActionCard.Title>
              <ActionCard.Description>
                Manage Transactions Across All Vaults in One Place.
              </ActionCard.Description>
            </Box>
          </ActionCard.Container>
          <ActionCard.Container
            onClick={() =>
              navigate(
                Pages.addressBook({
                  workspaceId,
                }),
              )
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
        </HStack>

        <Box mt={4} mb={-2} alignSelf="flex-start">
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
            sm: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
            xl: 'repeat(3, 1fr)',
            '2xl': 'repeat(4, 1fr)',
          }}
          gap={6}
          pb={28}
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
