import { Icon, useDisclosure } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import debounce from 'lodash.debounce';
import { ChangeEvent, useCallback, useState } from 'react';
import { BsFillCheckCircleFill } from 'react-icons/bs';
import { MdOutlineError } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { IApiError } from '@/config';
import { invalidateQueries } from '@/modules/core';
import { useNotification } from '@/modules/notification';

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

const useAddressBook = () => {
  const [contactToEdit, setContactToEdit] = useState({ id: '' });
  const [contactToDelete, setContactToDelete] = useState({
    id: '',
    nickname: '',
  });
  const navigate = useNavigate();
  const contactDialog = useDisclosure();
  const deleteContactDialog = useDisclosure();
  const toast = useNotification();
  const { form } = useCreateContactForm();
  const findContactsRequest = useFindContactsRequest();
  const listContactsRequest = useListContactsRequest();
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

      successToast({
        title: 'Nice!',
        description:
          'Next time you can use it just by typing this name label or address...',
      });
    },
    onError: () => {
      errorToast({
        title: 'Error!',
        description: 'There was an error. Check your data and try again.',
      });
    },
  });
  const createContactRequest = useCreateContactRequest({
    onSuccess: () => {
      contactDialog.onClose();
      invalidateQueries(['contacts/by-user']);
      successToast({
        title: 'Nice!',
        description:
          'Next time you can use it just by typing this name label or address...',
      });
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

  const successToast = ({
    description,
    title,
  }: {
    description?: string;
    title?: string;
  }) =>
    toast({
      status: 'success',
      duration: 4000,
      isClosable: false,
      title: title ?? 'Success!',
      description: description ?? '',
      icon: (
        <Icon fontSize="2xl" color="brand.500" as={BsFillCheckCircleFill} />
      ),
    });

  const errorToast = ({
    description,
    title,
  }: {
    description?: string;
    title?: string;
  }) => {
    return toast({
      status: 'error',
      duration: 4000,
      isClosable: false,
      title: title ?? 'Error!',
      description:
        description ?? 'Check the provided data and try again, please...',
      icon: <Icon fontSize="2xl" color="error.600" as={MdOutlineError} />,
    });
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
    navigate,
    handleOpenDialog,
    handleDeleteContact,
    contactToEdit,
    contactToDelete,
    setContactToDelete,
  };
};

export { useAddressBook };
