import type { ListContactsResponse } from '@bako-safe/services';
import type { UseDisclosureProps } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import { Address } from 'fuels';
import debounce from 'lodash.debounce';
import { type ChangeEvent, useCallback } from 'react';

import { useCreateContactForm } from './useCreateContactForm';

interface DialogProps {
  address?: string;
  nickname?: string;
  contactToEdit?: string;
}

export type IUseAddressBookFormHandlersProps = {
  setContactToEdit: React.Dispatch<
    React.SetStateAction<{
      id: string;
    }>
  >;
  contactDialog: UseDisclosureProps;
  listContactsRequest: UseQueryResult<ListContactsResponse, Error>;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
};

const useAddressBookFormHandlers = ({
  setContactToEdit,
  contactDialog,
  listContactsRequest,
  setSearch,
}: IUseAddressBookFormHandlersProps) => {
  const { form } = useCreateContactForm();

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

    contactDialog.onOpen?.();
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

  return {
    form,
    handleOpenDialog,
    contactByAddress,
    debouncedSearchHandler,
  };
};

export { useAddressBookFormHandlers };
