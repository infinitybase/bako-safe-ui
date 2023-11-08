import { Icon, useDisclosure } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import debounce from 'lodash.debounce';
import { ChangeEvent, useCallback } from 'react';
import { BsFillCheckCircleFill } from 'react-icons/bs';
import { MdOutlineError } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { IApiError } from '@/config';
import { useNotification } from '@/modules/notification';

import { useCreateContactForm } from './useCreateContactForm';
import { useCreateContactRequest } from './useCreateContactRequest';
import { useFindContactsRequest } from './useFindContactsRequest';
import { useListContactsRequest } from './useListContactsRequest';
import { useUpdateContactRequest } from './useUpdateContactRequest';

export type UseAddressBookReturn = ReturnType<typeof useAddressBook>;

const useAddressBook = () => {
  const contactDialog = useDisclosure();
  const deleteContactDialog = useDisclosure();
  const navigate = useNavigate();
  const toast = useNotification();
  const { form } = useCreateContactForm();
  const findContactsRequest = useFindContactsRequest();
  const listContactsRequest = useListContactsRequest();
  const updateContactRequest = useUpdateContactRequest({
    onSuccess: () => {
      contactDialog.onClose();
      successToast({
        title: 'Nice!',
        description:
          'Next time you can use it just by typing this name label or address...',
      });
    },
    // onError: (error) => {
    //   const errorDescription = (
    //     (error as AxiosError)?.response?.data as IApiError
    //   )?.detail;

    //   errorToast({ description: errorDescription });

    //   if (errorDescription?.includes('label')) {
    //     form.setError('nickname', { message: 'Duplicated label' });
    //   }

    //   if (errorDescription?.includes('address')) {
    //     form.setError('address', { message: 'Duplicated address' });
    //   }
    // },
  });
  const createContactRequest = useCreateContactRequest({
    onSuccess: () => {
      contactDialog.onClose();
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

      errorToast({ description: errorDescription });

      if (errorDescription?.includes('label')) {
        form.setError('nickname', { message: 'Duplicated label' });
      }

      if (errorDescription?.includes('address')) {
        form.setError('address', { message: 'Duplicated address' });
      }
    },
  });

  const handleOpenDialog = (address?: string) => {
    if (address) form.setValue('address', address);
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
    updateContactRequest.mutate(data);
  });

  return {
    form: { ...form, handleCreateContact, handleUpdateContact },
    search: { handler: debouncedSearchHandler },
    listContactsRequest: {
      ...listContactsRequest,
      contacts: listContactsRequest.data,
    },
    createContactRequest,
    findContactsRequest,
    contactDialog,
    deleteContactDialog,
    navigate,
    handleOpenDialog,
  };
};

export { useAddressBook };
