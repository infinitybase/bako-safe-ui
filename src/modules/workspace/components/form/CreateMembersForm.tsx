import { Box, FormControl, FormHelperText } from '@chakra-ui/react';
import { Controller } from 'react-hook-form';

import { Autocomplete } from '@/components';
import { AddToAddressBook } from '@/modules/addressBook/components';
import { useAddressBook } from '@/modules/addressBook/hooks';
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
  const { paginatedContacts, listContactsRequest, search } =
    useAddressBook(!isSingleWorkspace);

  return (
    <Box w="full" maxW={480} mb={8}>
      <Controller
        name="address"
        control={form.control}
        render={({ field, fieldState }) => {
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
                  onInputChange={search.handler}
                  onChange={field.onChange}
                  options={paginatedContacts.data!}
                  isLoading={!paginatedContacts.isSuccess}
                  inView={addressBook.inView}
                />

                <FormHelperText color="error.500">
                  {fieldState.error?.message}
                </FormHelperText>
              </FormControl>

              {showAddToAddressBook && (
                <AddToAddressBook
                  onAdd={() =>
                    addressBook.handleOpenDialog?.({
                      address: form.getValues('address'),
                    })
                  }
                />
              )}
            </>
          );
        }}
      />
    </Box>
  );
};
