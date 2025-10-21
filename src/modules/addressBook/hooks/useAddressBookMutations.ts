import { UseQueryResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Address } from 'fuels';
import { UseFormReturn } from 'react-hook-form';

import { IApiError } from '@/config';
import { UseDisclosureReturn } from '@/modules/core/hooks/useDisclosure';

import { ListContactsResponse } from '../services';
import { useContactToast } from './useContactToast';
import { useCreateContactRequest } from './useCreateContactRequest';
import { useDeleteContactRequest } from './useDeleteContactRequest';
import { useUpdateContactRequest } from './useUpdateContactRequest';

type IContactFormData = {
  nickname: string;
  address: string;
  handle: string | undefined;
  resolver: string | undefined;
};

export type IUseAddressBookMutationsProps = {
  form: UseFormReturn<
    IContactFormData,
    unknown,
    IContactFormData & { handle?: string; resolver?: string }
  >;
  deleteContactDialog: UseDisclosureReturn;
  contactDialog: UseDisclosureReturn;
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
    onError: (error) => {
      const errorDescription = (
        (error as AxiosError)?.response?.data as IApiError
      )?.title;

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

  const createContactRequest = useCreateContactRequest({
    onSuccess: async () => {
      await listContactsRequest.refetch();
      contactDialog.onClose?.();
      createAndUpdateSuccessToast();
    },
    onError: (error) => {
      const errorDescription = (
        (error as AxiosError)?.response?.data as IApiError
      )?.title;

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
        address: new Address(address).toString(),
      });
    },
  );

  const handleUpdateContact = form.handleSubmit(
    async ({ nickname, address }) => {
      updateContactRequest.mutate({
        nickname,
        address: new Address(address).toString(),
        id: contactToEdit.id,
      });
    },
  );

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
