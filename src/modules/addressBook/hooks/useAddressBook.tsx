import { useDisclosure } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import debounce from 'lodash.debounce';
import { ChangeEvent, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { IApiError } from '@/config';
import { invalidateQueries } from '@/modules/core';

import { useContactToast } from './useContactToast';
import { useCreateContactForm } from './useCreateContactForm';
import { useCreateContactRequest } from './useCreateContactRequest';
import { useDeleteContactRequest } from './useDeleteContactRequest';
import { useFindContactsRequest } from './useFindContactsRequest';
import { useListContactsRequest } from './useListContactsRequest';
import { useUpdateContactRequest } from './useUpdateContactRequest';

export type UseAddressBookReturn = ReturnType<typeof useAddressBook>;

interface DialogProps {
  address?: string;
  nickname?: string;
  contactToEdit?: string;
}

const initialContact = { id: '', nickname: '' };

const useAddressBook = () => {
  const [contactToEdit, setContactToEdit] = useState({ id: '' });
  const [contactToDelete, setContactToDelete] = useState(initialContact);
  const contactDialog = useDisclosure();
  const deleteContactDialog = useDisclosure();
  const navigate = useNavigate();
  const { successToast, errorToast, createAndUpdateSuccessToast } =
    useContactToast();

  // FORM
  const { form } = useCreateContactForm();

  // QUERIES
  const findContactsRequest = useFindContactsRequest();
  const listContactsRequest = useListContactsRequest();

  // MUTATIONS
  const deleteContactRequest = useDeleteContactRequest({
    onSuccess: () => {
      deleteContactDialog.onClose();
      invalidateQueries(['contacts/by-user']);
      successToast({
        title: 'Success!',
        description: 'Your contact was deleted...',
      });
    },
  });

  const updateContactRequest = useUpdateContactRequest({
    onSuccess: () => {
      contactDialog.onClose();
      invalidateQueries(['contacts/by-user']);
      createAndUpdateSuccessToast();
    },
    onError: () => errorToast({}),
  });

  const createContactRequest = useCreateContactRequest({
    onSuccess: () => {
      contactDialog.onClose();
      invalidateQueries(['contacts/by-user']);
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

  const debouncedSearchHandler = useCallback(
    debounce((event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.value.length) {
        findContactsRequest.mutate({ q: event.target.value });
      }
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
    listContactsRequest: {
      ...listContactsRequest,
      contacts: listContactsRequest.data,
    },
    createContactRequest,
    findContactsRequest,
    deleteContactRequest,
    updateContactRequest,
    form: { ...form, handleCreateContact, handleUpdateContact },
    search: { handler: debouncedSearchHandler },
    contactDialog,
    deleteContactDialog,
    contactToEdit,
    contactToDelete,
    navigate,
    handleOpenDialog,
    handleDeleteContact,
    setContactToDelete,
  };
};

export { useAddressBook };
