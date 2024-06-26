import { Box, FormControl, FormHelperText } from '@chakra-ui/react';
import { Controller } from 'react-hook-form';

import { Autocomplete } from '@/components';
import { AddToAddressBook } from '@/modules/addressBook/components';
import {
  useAddressBook,
  useAddressBookAutocompleteOptions,
} from '@/modules/addressBook/hooks';
import { useAuth } from '@/modules/auth/hooks';
import { AddressUtils } from '@/modules/core/utils/address';

import { UseChangeMember } from '../../hooks';

interface MemberAddressForm {
  form: UseChangeMember['form']['memberForm'];
  addressBook: UseChangeMember['addressBook'];
}

/* TODO: Move to components folder */
export const MemberAddressForm = ({ form, addressBook }: MemberAddressForm) => {
  const { isSingleWorkspace } = useAuth();
  const { paginatedContacts, listContactsRequest, workspaceId } =
    useAddressBook(!isSingleWorkspace);

  const { optionsRequests, handleFieldOptions, optionRef } =
    useAddressBookAutocompleteOptions({
      workspaceId: workspaceId!,
      includePersonal: !isSingleWorkspace,
      contacts: listContactsRequest.data!,
      fields: [form.watch('address')],
      errors: form.formState.errors.address,
      isUsingTemplate: false,
      isFirstLoading: false,
    });

  return (
    <Box w="full" maxW={480} mb="12px">
      <Controller
        name="address.value"
        control={form.control}
        render={({ field, fieldState }) => {
          const appliedOptions = handleFieldOptions(
            field.value,
            optionsRequests[0].options,
          );

          const showAddToAddressBook =
            !fieldState.invalid &&
            AddressUtils.isValid(field.value) &&
            paginatedContacts.isSuccess &&
            listContactsRequest.data &&
            !listContactsRequest.data
              .map((o) => o.user.address)
              .includes(field.value);

          return (
            <>
              <FormControl isInvalid={fieldState.invalid}>
                <Autocomplete
                  label="Name or address"
                  value={field.value}
                  optionsRef={optionRef}
                  onChange={field.onChange}
                  options={appliedOptions}
                  isLoading={!optionsRequests[0].isSuccess}
                  inView={addressBook.inView}
                  clearable={false}
                />

                <FormHelperText color="error.500">
                  {fieldState.error?.message}
                </FormHelperText>
              </FormControl>

              <AddToAddressBook
                visible={showAddToAddressBook}
                onAdd={() =>
                  addressBook.handleOpenDialog?.({
                    address: form.getValues('address.value'),
                  })
                }
              />
            </>
          );
        }}
      />
    </Box>
  );
};
