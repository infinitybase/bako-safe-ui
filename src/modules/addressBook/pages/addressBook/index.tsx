import { Box, Button, Grid, GridItem, HStack, VStack } from 'bako-ui';

import { BookmarkFavoriteIcon, CustomSkeleton, HomeIcon } from '@/components';
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
    screenSizes: { isExtraSmall, isSmall },
  } = useWorkspaceContext();

  const { data: contacts } = listContactsRequest;

  const hasContacts = !!contacts?.length;
  const workspaceId = workspace?.id ?? '';

  const { resolveAddressContactHandle } = useAddressNicknameResolver();

  return (
    <>
      {contactDialog.isOpen &&
        (contactToEdit?.id ? (
          <CreateContactDialog
            key={`edit-contact-${contactToEdit?.id}`}
            form={form}
            dialog={contactDialog}
            isLoading={updateContactRequest.isPending}
            address={contactToEdit?.address}
            isEdit
          />
        ) : (
          <CreateContactDialog
            key="create-contact"
            form={form}
            dialog={contactDialog}
            isLoading={createContactRequest.isPending}
          />
        ))}

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
          <HStack w={isExtraSmall ? 'full' : 'unset'} gap={3}>
            <Button
              fontWeight="semibold"
              fontSize="2xs"
              size="xs"
              bgColor="gray.600"
              color="gray.200"
              _hover={{
                bg: 'gray.550',
                color: 'textPrimary',
              }}
              gap={2}
              p={2}
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
              <HomeIcon w={5} color="gray.200" />
              {isSmall ? '' : 'HOME'}
            </Button>

            <Button
              flex={isExtraSmall ? 1 : 'unset'}
              fontWeight="semibold"
              fontSize="2xs"
              size="xs"
              bgColor="gray.550"
              color="gray.200"
              cursor="default"
              gap={2}
              p={2}
            >
              <BookmarkFavoriteIcon w={4} color="gray.200" />
              ADDRESS BOOK
            </Button>
          </HStack>

          {hasPermission([
            PermissionRoles?.OWNER,
            PermissionRoles?.ADMIN,
            PermissionRoles?.MANAGER,
          ]) && (
            <Box w={isExtraSmall ? 'full' : 'unset'}>
              <Button
                w="full"
                _hover={{
                  bg: 'bg.muted',
                  color: 'textPrimary',
                }}
                bgColor="gray.700"
                size="xs"
                px={3}
                color="gray.300"
                onClick={() => handleOpenDialog({})}
              >
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
                    setContactToDelete({ id, nickname, address: user.address });
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
