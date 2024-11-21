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
import { EmptyState } from '@/components/emptyState';
import { AddressBookIcon } from '@/components/icons/address-book';
import { TransactionsIcon } from '@/components/icons/transactions';
import { Pages, PermissionRoles } from '@/modules/core';
import { ActionCard } from '@/modules/home/components/ActionCard';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import {
  ContactCard,
  CreateContactDialog,
  DeleteContactDialog,
} from '../../components';

const AddressBookPage = () => {
  const {
    authDetails: {
      userInfos: { workspace, onSingleWorkspace },
    },
    workspaceInfos: {
      handlers: { handleWorkspaceSelection, hasPermission, goHome },
    },
    addressBookInfos: {
      form,
      requests: {
        deleteContactRequest,
        updateContactRequest,
        createContactRequest,
        listContactsRequest,
      },
      contacts: { contactToDelete, contactToEdit },
      dialog: { contactDialog, deleteContactDialog },
      handlers: {
        handleDeleteContact,
        handleOpenDialog,
        navigate,
        setContactToDelete,
      },
    },
    screenSizes: { isExtraSmall },
  } = useWorkspaceContext();

  const { data: contacts } = listContactsRequest;

  const hasContacts = !!contacts?.length;
  const workspaceId = workspace?.id ?? '';

  return (
    <>
      <CreateContactDialog
        form={form}
        dialog={contactDialog}
        isLoading={
          createContactRequest.isPending || updateContactRequest.isPending
        }
        isEdit={!!contactToEdit?.id}
      />

      {hasContacts && contactToDelete.nickname && (
        <DeleteContactDialog
          contactToDelete={contactToDelete}
          dialog={deleteContactDialog}
          handleDelete={handleDeleteContact}
          isLoading={deleteContactRequest.isPending}
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
          h={isExtraSmall ? 20 : 10}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexDir={isExtraSmall ? 'column' : 'row'}
          rowGap={4}
          mb={isExtraSmall ? 4 : 'unset'}
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
              onClick={() =>
                onSingleWorkspace
                  ? goHome()
                  : handleWorkspaceSelection(
                      workspaceId,
                      Pages.workspace({
                        workspaceId,
                      }),
                    )
              }
            >
              Back home
            </Button>

            <Breadcrumb display={{ base: 'none', sm: 'initial' }} ml={8}>
              <BreadcrumbItem>
                <BreadcrumbLink
                  fontSize="sm"
                  color="grey.200"
                  fontWeight="semibold"
                  onClick={() => goHome()}
                >
                  <Icon mr={2} as={HomeIcon} fontSize="sm" color="grey.200" />
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>

              {/* Commented out code to temporarily disable workspaces. */}

              {/* <BreadcrumbItem hidden={onSingleWorkspace}>
                {workspace?.id && (
                  <BreadcrumbLink
                    fontSize="sm"
                    color="grey.200"
                    fontWeight="semibold"
                    onClick={() =>
                      handleWorkspaceSelection(
                        workspace?.id,
                        Pages.workspace({
                          workspaceId: workspace?.id,
                        }),
                      )
                    }
                    maxW={40}
                    isTruncated
                  >
                    {workspace?.name}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem> */}
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

          {hasPermission([
            PermissionRoles?.OWNER,
            PermissionRoles?.ADMIN,
            PermissionRoles?.MANAGER,
          ]) && (
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
            onClick={() =>
              navigate(Pages.userVaults({ workspaceId: workspace?.id }))
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
            flex={1}
            onClick={() => {
              return navigate(
                Pages.userTransactions({
                  workspaceId: workspace?.id,
                }),
              );
            }}
          >
            <ActionCard.Icon icon={TransactionsIcon} />
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
              navigate(Pages.addressBook({ workspaceId: workspace?.id }))
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

        <Box
          w="full"
          display="flex"
          alignItems={'center'}
          flexDir={isExtraSmall ? 'column' : 'row'}
          gap={isExtraSmall ? 2 : 4}
          mt={6}
        >
          <Text variant="subtitle" fontWeight="semibold" color="grey.75">
            Address book
          </Text>
        </Box>
        {/* USER CONTACTS */}
        {hasContacts && (
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
                    showActionButtons={hasPermission([
                      PermissionRoles?.OWNER,
                      PermissionRoles?.ADMIN,
                      PermissionRoles?.MANAGER,
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
                </GridItem>
              );
            })}
          </Grid>
        )}

        {!hasContacts && !listContactsRequest.isLoading && (
          <EmptyState
            h="full"
            showAction={false}
            title="No Data available"
            subTitle={`Currently, there is no available data to display in this section.`}
          />
        )}
      </VStack>
    </>
  );
};

export { AddressBookPage };
