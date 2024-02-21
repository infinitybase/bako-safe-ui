import { useDisclosure } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import debounce from 'lodash.debounce';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';

import { IApiError } from '@/config';
import { invalidateQueries } from '@/modules/core';
import { useWorkspace } from '@/modules/workspace';

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

const useAddressBook = () => {
  const [contactToEdit, setContactToEdit] = useState({ id: '' });
  const [search, setSearch] = useState('');
  const [contactToDelete, setContactToDelete] = useState({
    id: '',
    nickname: '',
  });
  const [firsRender, setFirstRender] = useState(true);
  const [hasSkeleton, setHasSkeleton] = useState(false);
  const contactDialog = useDisclosure();
  const deleteContactDialog = useDisclosure();
  const inView = useInView({ delay: 300 });
  const navigate = useNavigate();
  const { successToast, errorToast, createAndUpdateSuccessToast } =
    useContactToast();
  const { currentWorkspace } = useWorkspace();

  // FORM
  const { form } = useCreateContactForm();

  // QUERIES
  const listContactsRequest = useListContactsRequest();
  const contactsPaginatedRequest = useListPaginatedContactsRequest({
    q: search,
    includePersonal: !currentWorkspace?.single,
  });

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

  useEffect(() => {
    if (inView.inView && !contactsPaginatedRequest.isLoading) {
      contactsPaginatedRequest.fetchNextPage();
    }
  }, [
    inView.inView,
    contactsPaginatedRequest.isLoading,
    contactsPaginatedRequest.fetchNextPage,
  ]);

  useMemo(() => {
    if (firsRender && contactsPaginatedRequest.isLoading) {
      setHasSkeleton(true);
      setFirstRender(false);
    }

    setTimeout(() => {
      if (!firsRender && contactsPaginatedRequest.isSuccess) {
        setHasSkeleton(false);
      }
    }, 500);
  }, [contactsPaginatedRequest.contacts]);

  return {
    listContactsRequest: {
      ...listContactsRequest,
      contacts: listContactsRequest.data,
    },
    createContactRequest,
    deleteContactRequest,
    updateContactRequest,
    contactsPaginatedRequest,
    form: { ...form, handleCreateContact, handleUpdateContact },
    search: { value: search, handler: debouncedSearchHandler },
    contactDialog,
    deleteContactDialog,
    contactToEdit,
    contactToDelete,
    inView,
    navigate,
    handleOpenDialog,
    handleDeleteContact,
    setContactToDelete,
    hasSkeleton,
  };
};

export { useAddressBook };
