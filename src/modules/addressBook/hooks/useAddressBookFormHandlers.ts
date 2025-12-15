import { UseQueryResult } from '@tanstack/react-query';
import { BakoProvider } from 'bakosafe';
import { Assets } from 'fuels';
import debounce from 'lodash.debounce';
import { ChangeEvent, useCallback } from 'react';

import { UseDisclosureReturn } from '@/modules/core/hooks/useDisclosure';
import { AddressUtils } from '@/modules/core/utils/address';

import { ListContactsResponse } from '../services';
import { useCreateContactForm } from './useCreateContactForm';

interface DialogProps {
  address?: string;
  nickname?: string;
  contactToEdit?: string;
  handle?: string;
}

export type IUseAddressBookFormHandlersProps = {
  setContactToEdit: React.Dispatch<
    React.SetStateAction<{
      id: string;
      address: string;
    }>
  >;
  contactDialog: UseDisclosureReturn;
  listContactsRequest: UseQueryResult<ListContactsResponse, Error>;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  providerInstance: Promise<BakoProvider>;
  fuelsTokens?: Assets;
};

const useAddressBookFormHandlers = ({
  setContactToEdit,
  contactDialog,
  listContactsRequest,
  setSearch,
  providerInstance,
  fuelsTokens,
}: IUseAddressBookFormHandlersProps) => {
  const { form } = useCreateContactForm(providerInstance, fuelsTokens);

  const handleOpenDialog = ({
    address,
    nickname,
    contactToEdit,
    handle,
  }: DialogProps) => {
    form.clearErrors('address');
    form.clearErrors('nickname');
    form.setValue('address', '');
    form.setValue('nickname', '');

    setContactToEdit({ id: contactToEdit ?? '', address: address ?? '' });
    if (address) form.setValue('address', address);
    if (nickname) form.setValue('nickname', nickname);
    if (handle) {
      form.setValue('handle', handle);
      form.setValue('resolver', address);
    }

    setTimeout(() => contactDialog.onOpen?.(), 250);
  };

  const contactByAddress = (address: string) => {
    const contacts = listContactsRequest?.data ?? [];
    return contacts.find(({ user }) =>
      AddressUtils.equal(user.address, address),
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
