import { useDisclosure } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import debounce from 'lodash.debounce';
import { ChangeEvent, useCallback, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate, useParams } from 'react-router-dom';

import { IApiError } from '@/config';
import { useAuth } from '@/modules/auth';
import { AddressBookQueryKey, invalidateQueries } from '@/modules/core';
import { useWorkspace } from '@/modules/workspace';

import { useAddressBookStore } from '../store/useAddressBookStore';
import { useContactToast } from './useContactToast';
import { useCreateContactForm } from './useCreateContactForm';
import { useCreateContactRequest } from './useCreateContactRequest';
import { useDeleteContactRequest } from './useDeleteContactRequest';
import { useListContactsRequest } from './useListContactsRequest';
import { useListPaginatedContactsRequest } from './useListPaginatedContactsRequest';
import { useUpdateContactRequest } from './useUpdateContactRequest';

export type UseAddressBookReturn = ReturnType<typeof useAddressBook>;

interface DialogProps {
  address?: string;
  nickname?: string;
  contactToEdit?: string;
}

const useAddressBook = (isSingleIncluded?: boolean) => {
  const [contactToEdit, setContactToEdit] = useState({ id: '' });
  const [search, setSearch] = useState('');
  const [contactToDelete, setContactToDelete] = useState({
    id: '',
    nickname: '',
  });

  const contactDialog = useDisclosure();
  const deleteContactDialog = useDisclosure();
  const { workspaceId, vaultId } = useParams();
  const inView = useInView({ delay: 300 });
  const navigate = useNavigate();
  const { contacts } = useAddressBookStore();
  const { successToast, errorToast, createAndUpdateSuccessToast } =
    useContactToast();
  const {
    workspaces: { current, single },
  } = useAuth();

  useWorkspace(); // dont remove

  // FORM
  const { form } = useCreateContactForm();

  // MUTATIONS
  const deleteContactRequest = useDeleteContactRequest({
    onSuccess: () => {
      deleteContactDialog.onClose();
      invalidateQueries(AddressBookQueryKey.LIST_BY_USER(current, vaultId));
      invalidateQueries(
        AddressBookQueryKey.LIST_BY_USER_PAGINATED(current, search),
      );
      successToast({
        title: 'Success!',
        description: 'Your contact was deleted...',
      });
    },
  });

  const updateContactRequest = useUpdateContactRequest({
    onSuccess: () => {
      contactDialog.onClose();
      invalidateQueries(AddressBookQueryKey.LIST_BY_USER(current, vaultId));
      createAndUpdateSuccessToast();
    },
    onError: () => errorToast({}),
  });

  const createContactRequest = useCreateContactRequest({
    onSuccess: () => {
      contactDialog.onClose();
      invalidateQueries(AddressBookQueryKey.LIST_BY_USER(current, vaultId));
      createAndUpdateSuccessToast();
    },
    onError: (error) => {
      const errorDescription = (
        (error as AxiosError)?.response?.data as IApiError
      )?.detail;

      if (errorDescription?.includes('label')) {
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
    return contacts.find(({ user }) => user.address === address);
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

  const handleCreateContact = form.handleSubmit(async (data) => {
    createContactRequest.mutate(data);
  });

  const handleUpdateContact = form.handleSubmit(async (data) => {
    updateContactRequest.mutate({ ...data, id: contactToEdit.id });
  });

  const handleDeleteContact = async (id: string) => {
    deleteContactRequest.mutate(id);
  };

  return {
    inView,
    contacts,
    contactToEdit,
    contactDialog,
    contactToDelete,
    deleteContactDialog,
    createContactRequest,
    deleteContactRequest,
    updateContactRequest,
    search: { value: search, handler: debouncedSearchHandler },
    //functions
    navigate,
    handleOpenDialog,
    contactByAddress,
    setContactToDelete,
    handleDeleteContact,
    useListPaginatedContactsRequest: useListContactsRequest(
      current,
      isSingleIncluded ?? single !== workspaceId,
      vaultId,
    ),
    form: { ...form, handleCreateContact, handleUpdateContact },
    paginatedContacts: useListPaginatedContactsRequest(
      contacts,
      { q: search },
      current,
    ),
  };
};

export { useAddressBook };
