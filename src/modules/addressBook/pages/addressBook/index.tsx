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
import { IoChevronBack } from 'react-icons/io5';

import { CustomSkeleton, HomeIcon } from '@/components';
import { Pages, PermissionRoles } from '@/modules/core';
import { useHome } from '@/modules/home/hooks/useHome';
import { useWorkspace } from '@/modules/workspace';

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
    navigate,
    listContactsRequest: { contacts, isLoading: loadingContacts },
    contactDialog,
    handleOpenDialog,
    deleteContactDialog,
    deleteContactRequest,
    updateContactRequest,
    createContactRequest,
    form,
    contactToDelete,
    setContactToDelete,
    handleDeleteContact,
    contactToEdit,
    hasSkeleton,
  } = useAddressBook();
  const { hasPermission, currentWorkspace } = useWorkspace();
  const { goHome } = useHome();

  const hasContacts = contacts?.length;

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

      {!!hasContacts && contactToDelete.nickname && (
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
              onClick={() =>
                currentWorkspace.single
                  ? goHome()
                  : navigate(
                      Pages.workspace({ workspaceId: currentWorkspace.id }),
                    )
              }
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

              <BreadcrumbItem hidden={currentWorkspace.single}>
                <BreadcrumbLink
                  fontSize="sm"
                  color="grey.200"
                  fontWeight="semibold"
                  onClick={() =>
                    navigate(
                      Pages.workspace({ workspaceId: currentWorkspace.id }),
                    )
                  }
                >
                  {currentWorkspace.name}
                </BreadcrumbLink>
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

        {/* USER CONTACTS */}
        {!!hasContacts && (
          <>
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

            <Grid w="full" templateColumns="repeat(4, 1fr)" gap={6} pb={28}>
              {contacts?.map(({ id, nickname, user }) => {
                return (
                  <GridItem key={id}>
                    <CustomSkeleton isLoaded={!hasSkeleton}>
                      <ContactCard
                        nickname={nickname}
                        address={user.address}
                        avatar={user.avatar}
                        dialog={deleteContactDialog}
                        showActionButtons={hasPermission([
                          OWNER,
                          ADMIN,
                          MANAGER,
                        ])}
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
                    </CustomSkeleton>
                  </GridItem>
                );
              })}
            </Grid>
          </>
        )}

        {!hasContacts && !loadingContacts && (
          <AddressBookEmptyState action={() => handleOpenDialog({})} />
        )}
      </VStack>
    </>
  );
};

export { AddressBookPage };
