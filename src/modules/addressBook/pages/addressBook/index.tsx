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
import { Pages } from '@/modules/core';

import {
  AddressBookEmptyState,
  ContactCard,
  CreateContactDialog,
  DeleteContactDialog,
} from '../../components';
import { useAddressBook } from '../../hooks';

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
  } = useAddressBook();

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
              onClick={() => navigate(Pages.home())}
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
                  href={Pages.home()}
                >
                  Home
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
                    <CustomSkeleton isLoaded={!loadingContacts}>
                      <ContactCard
                        nickname={nickname}
                        address={user.address}
                        avatar={user.avatar}
                        dialog={deleteContactDialog}
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
