import { useDisclosure } from '@chakra-ui/react';
import { BakoProvider } from 'bakosafe';
import { Assets } from 'fuels';
import { useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate, useParams } from 'react-router-dom';

import { IUseAuthReturn } from '@/modules/auth/services';
import { PermissionRoles } from '@/modules/core';

import { useAddressBookFormHandlers } from './useAddressBookFormHandlers';
import { useAddressBookMutations } from './useAddressBookMutations';
import { useListContactsRequest } from './useListContactsRequest';

export type UseAddressBookReturn = ReturnType<typeof useAddressBook>;

const useAddressBook = (
  authDetails: IUseAuthReturn,
  hasPermission: (requiredRoles: PermissionRoles[]) => boolean,
  providerInstance: Promise<BakoProvider>,
  fuelsTokens?: Assets,
) => {
  const [contactToEdit, setContactToEdit] = useState({ id: '' });
  const [search, setSearch] = useState('');
  const [contactToDelete, setContactToDelete] = useState({
    id: '',
    nickname: '',
  });

  const contactDialog = useDisclosure();
  const deleteContactDialog = useDisclosure();
  const { workspaceId } = useParams();
  const inView = useInView({ delay: 300 });
  const navigate = useNavigate();

  const listContactsRequest = useListContactsRequest({
    workspaceId: workspaceId!,
    includePersonal: authDetails.userInfos.onSingleWorkspace,
  });

  const { contactByAddress, debouncedSearchHandler, handleOpenDialog, form } =
    useAddressBookFormHandlers({
      contactDialog,
      listContactsRequest,
      setContactToEdit,
      setSearch,
      providerInstance,
      fuelsTokens,
    });

  const {
    createContactRequest,
    deleteContactRequest,
    handleCreateContact,
    handleDeleteContact,
    handleUpdateContact,
    updateContactRequest,
  } = useAddressBookMutations({
    contactDialog,
    contactToEdit,
    deleteContactDialog,
    form,
    listContactsRequest,
  });

  const canAddMember = useMemo(() => {
    return hasPermission([
      PermissionRoles.OWNER,
      PermissionRoles.ADMIN,
      PermissionRoles.MANAGER,
    ]);
  }, [hasPermission]);

  return {
    inView,
    canAddMember,
    workspaceId,
    search: { value: search, handler: debouncedSearchHandler },
    contacts: {
      contactToEdit,
      contactToDelete,
    },
    dialog: {
      contactDialog: {
        ...contactDialog,
        onClose: () => {
          contactDialog.onClose();
          form.setValue('address', '');
          form.setValue('nickname', '');
        },
      },
      deleteContactDialog,
    },
    requests: {
      createContactRequest,
      deleteContactRequest,
      updateContactRequest,
      listContactsRequest,
    },
    form: { ...form, handleCreateContact, handleUpdateContact },
    handlers: {
      navigate,
      handleOpenDialog,
      contactByAddress,
      setContactToDelete,
      handleDeleteContact,
    },
  };
};

export { useAddressBook };
