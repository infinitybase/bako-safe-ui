import { UseDisclosureProps } from '@chakra-ui/react';
import { ListContactsResponse } from '@services/modules/address-book';
import { UseQueryResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Address } from 'fuels';
import { UseFormReturn } from 'react-hook-form';

import { IApiError } from '@/config';

import { useContactToast } from './useContactToast';
import { useCreateContactRequest } from './useCreateContactRequest';
import { useDeleteContactRequest } from './useDeleteContactRequest';
import { useUpdateContactRequest } from './useUpdateContactRequest';

export type IUseAddressBookMutationsProps = {
  form: UseFormReturn<{
    nickname: string;
    address: string;
  }>;
  deleteContactDialog: UseDisclosureProps;
  contactDialog: UseDisclosureProps;
  listContactsRequest: UseQueryResult<ListContactsResponse, Error>;
  contactToEdit: {
    id: string;
  };
};

const useAddressBookMutations = ({
  form,
  deleteContactDialog,
  contactDialog,
  listContactsRequest,
  contactToEdit,
}: IUseAddressBookMutationsProps) => {
  const { successToast, errorToast, createAndUpdateSuccessToast } =
    useContactToast();

  const deleteContactRequest = useDeleteContactRequest({
    onSuccess: async () => {
      await listContactsRequest.refetch();
      deleteContactDialog.onClose?.();
      successToast({
        title: 'Success!',
        description: 'Your contact was deleted...',
      });
    },
  });

  const updateContactRequest = useUpdateContactRequest({
    onSuccess: async () => {
      await listContactsRequest.refetch();
      contactDialog.onClose?.();
      createAndUpdateSuccessToast();
    },
    onError: () => errorToast({}),
  });

  const createContactRequest = useCreateContactRequest({
    onSuccess: async () => {
      await listContactsRequest.refetch();
      contactDialog.onClose?.();
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

  return {
    deleteContactRequest,
    updateContactRequest,
    createContactRequest,
    handleCreateContact,
    handleUpdateContact,
    handleDeleteContact,
  };
};

export { useAddressBookMutations };