import { Icon } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import debounce from 'lodash.debounce';
import { ChangeEvent, useCallback, useState } from 'react';
import { BsFillCheckCircleFill } from 'react-icons/bs';
import { MdOutlineError } from 'react-icons/md';

import { IApiError } from '@/config';
import { useNotification } from '@/modules/notification';

import { useAddressBookStore } from '../store';
import { useCreateContactForm } from './useCreateContactForm';
import { useCreateContactRequest } from './useCreateContactRequest';
import { useFindContactsRequest } from './useFindContactsRequest';

export type UseCreateContactReturn = ReturnType<typeof useContact>;

const useContact = () => {
  const [contactDialogIsOpen, setContactDialogIsOpen] = useState(false);
  const { address, setAddress } = useAddressBookStore();

  const toast = useNotification();

  const handleCloseDialog = () => setContactDialogIsOpen(false);
  const handleOpenDialog = (address?: string) => {
    if (address) setAddress(address);
    setContactDialogIsOpen(true);
  };

  const { form } = useCreateContactForm();

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

  const createContactRequest = useCreateContactRequest({
    onSuccess: () => {
      handleCloseDialog();
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

  const debouncedSearchHandler = useCallback(
    debounce((event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.value.length) {
        findContactsRequest.mutate({ q: event.target.value });
      }
    }, 300),
    [],
  );

  const findContactsRequest = useFindContactsRequest();

  const handleCreateContact = form.handleSubmit(async (data) => {
    createContactRequest.mutate(data);
  });

  return {
    form: { ...form, handleCreateContact },
    search: { handler: debouncedSearchHandler },
    address,
    createContactRequest,
    findContactsRequest,
    contactDialogIsOpen,
    handleCloseDialog,
    handleOpenDialog,
  };
};

export { useContact };
