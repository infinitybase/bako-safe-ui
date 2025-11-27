import {
  Box,
  Breadcrumb,
  Button,
  Grid,
  GridItem,
  HStack,
  Icon,
  VStack,
} from 'bako-ui';
import { FaRegPlusSquare } from 'react-icons/fa';
import { IoChevronBack } from 'react-icons/io5';

import { CustomSkeleton, HomeIcon } from '@/components';
import { EmptyState } from '@/components/emptyState';
import { Pages, PermissionRoles } from '@/modules/core';
import { useAddressNicknameResolver } from '@/modules/core/hooks/useAddressNicknameResolver';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

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
      handlers: { handleDeleteContact, handleOpenDialog, setContactToDelete },
    },
    screenSizes: { isExtraSmall },
  } = useWorkspaceContext();

  const { data: contacts } = listContactsRequest;

  const hasContacts = !!contacts?.length;
  const workspaceId = workspace?.id ?? '';

  const { resolveAddressContactHandle } = useAddressNicknameResolver();

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
        gap={6}
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
              colorPalette="primary"
              fontWeight="semibold"
              fontSize={15}
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
              <IoChevronBack size={22} />
              Back home
            </Button>

            <Breadcrumb.Root display={{ base: 'none', sm: 'initial' }} ml={8}>
              <Breadcrumb.List>
                <Breadcrumb.Item>
                  <Breadcrumb.Link
                    fontSize="sm"
                    color="grey.200"
                    fontWeight="semibold"
                    onClick={() => goHome()}
                  >
                    <Icon mr={2} as={HomeIcon} w={4} color="grey.200" />
                    Home
                  </Breadcrumb.Link>
                </Breadcrumb.Item>

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
                <Breadcrumb.Separator />
                <Breadcrumb.Item>
                  <Breadcrumb.Link
                    id="adressbookBread"
                    fontSize="sm"
                    color="grey.200"
                    fontWeight="semibold"
                    href="#"
                  >
                    Address book
                  </Breadcrumb.Link>
                </Breadcrumb.Item>
              </Breadcrumb.List>
            </Breadcrumb.Root>
          </HStack>

          {hasPermission([
            PermissionRoles?.OWNER,
            PermissionRoles?.ADMIN,
            PermissionRoles?.MANAGER,
          ]) && (
            <Box w={isExtraSmall ? 'full' : 'unset'}>
              <Button
                w="full"
                colorPalette="primary"
                fontWeight="bold"
                onClick={() => handleOpenDialog({})}
              >
                <FaRegPlusSquare />
                Add new
              </Button>
            </Box>
          )}
        </Box>

        <Grid
          w="full"
          templateColumns={{
            base: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
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
            const handleInfo = listContactsRequest.data?.find(
              (contact) => contact.handle_info?.resolver === user?.address,
            )?.handle_info;

            const _contact = user?.address
              ? resolveAddressContactHandle(
                  user.address,
                  handleInfo?.handle,
                  handleInfo?.resolver,
                )
              : undefined;
            return (
              <GridItem key={id} display="flex">
                <ContactCard
                  nickname={nickname}
                  address={user.address}
                  avatar={user.avatar}
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
                      handle: _contact?.handle,
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
          <EmptyState
            h="full"
            showAction={false}
            title="No Data available"
            subTitle={
              "It seems you haven't added any favorites yet. Would you like to add one now?"
            }
          />
        )}
      </VStack>
    </>
  );
};

export { AddressBookPage };
