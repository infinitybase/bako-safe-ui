import { useDisclosure } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { Address } from 'fuels';
import debounce from 'lodash.debounce';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate, useParams } from 'react-router-dom';

import { IApiError, queryClient } from '@/config';
import { AddressBookQueryKey, PermissionRoles } from '@/modules/core';
import { useWorkspace } from '@/modules/workspace';

import { useContactToast } from './useContactToast';
import { useCreateContactForm } from './useCreateContactForm';
import { useCreateContactRequest } from './useCreateContactRequest';
import { useDeleteContactRequest } from './useDeleteContactRequest';
import { useListContactsRequest } from './useListContactsRequest';
import { useListPaginatedContactsRequest } from './useListPaginatedContactsRequest';
import { useUpdateContactRequest } from './useUpdateContactRequest';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

export type UseAddressBookReturn = ReturnType<typeof useAddressBook>;

interface DialogProps {
  address?: string;
  nickname?: string;
  contactToEdit?: string;
}

const useAddressBook = (isSingleIncluded: boolean = false) => {
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

  const { successToast, errorToast, createAndUpdateSuccessToast } =
    useContactToast();
  const auth = useWorkspaceContext();

  const { hasPermission } = useWorkspace(); // dont remove

  const listContactsRequest = useListContactsRequest({
    current: workspaceId!,
    includePersonal: isSingleIncluded ?? auth.isSingleWorkspace,
  });
  const listContactsPaginatedRequest = useListPaginatedContactsRequest(
    listContactsRequest.data ?? [],
    { q: search },
    workspaceId!,
    isSingleIncluded,
  );

  // FORM
  const { form } = useCreateContactForm();

  // MUTATIONS
  const deleteContactRequest = useDeleteContactRequest({
    onSuccess: async () => {
      await listContactsRequest.refetch();
      deleteContactDialog.onClose();
      successToast({
        title: 'Success!',
        description: 'Your contact was deleted...',
      });
    },
  });

  const updateContactRequest = useUpdateContactRequest({
    onSuccess: async () => {
      await listContactsRequest.refetch();
      contactDialog.onClose();
      createAndUpdateSuccessToast();
    },
    onError: () => errorToast({}),
  });

  const createContactRequest = useCreateContactRequest({
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: [AddressBookQueryKey.DEFAULT],
        exact: false,
      });
      contactDialog.onClose();
      createAndUpdateSuccessToast();
    },
    onError: (error) => {
      const errorDescription = (
        (error as AxiosError)?.response?.data as IApiError
      )?.detail;

      if (errorDescription?.includes('nickname')) {
        errorToast({
          title: 'Duplicated name',
          description: 'You already have this name in your address book',
        });
        form.setError('nickname', { message: 'Duplicated label' });
      }

      if (errorDescription?.includes('address')) {
        errorToast({
          title: 'Duplicated address',
          description: 'You already have this address in your address book',
        });
        form.setError('address', { message: 'Duplicated address' });
      }
    },
  });

  const handleOpenDialog = ({
    address,
    nickname,
    contactToEdit,
  }: DialogProps) => {
    form.clearErrors('address');
    form.clearErrors('nickname');
    form.setValue('address', '');
    form.setValue('nickname', '');

    setContactToEdit({ id: contactToEdit ?? '' });
    if (address) form.setValue('address', address);
    if (nickname) form.setValue('nickname', nickname);

    contactDialog.onOpen();
  };

  const contactByAddress = (address: string) => {
    const contacts = listContactsRequest?.data ?? [];
    return contacts.find(
      ({ user }) =>
        Address.fromString(user.address).bech32Address ===
        Address.fromString(address).bech32Address,
    );
  };

  const debouncedSearchHandler = useCallback(
    debounce((event: string | ChangeEvent<HTMLInputElement>) => {
      if (typeof event === 'string') {
        setSearch(event);
        return;
      }

      setSearch(event.target.value);
    }, 300),
    [],
  );

  const handleCreateContact = form.handleSubmit(
    async ({ nickname, address }) => {
      createContactRequest.mutate({
        nickname,
        address: Address.fromString(address).bech32Address,
      });
    },
  );

  const handleUpdateContact = form.handleSubmit(async (data) => {
    updateContactRequest.mutate({ ...data, id: contactToEdit.id });
  });

  const handleDeleteContact = async (id: string) => {
    deleteContactRequest.mutate(id);
  };

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
    contactToEdit,
    contactDialog,
    contactToDelete,
    listContactsRequest,
    deleteContactDialog,
    createContactRequest,
    deleteContactRequest,
    updateContactRequest,
    form: { ...form, handleCreateContact, handleUpdateContact },
    search: { value: search, handler: debouncedSearchHandler },
    paginatedContacts: listContactsPaginatedRequest,
    workspaceId,
    //functions
    navigate,
    handleOpenDialog,
    contactByAddress,
    setContactToDelete,
    handleDeleteContact,
  };
};

export { useAddressBook };
