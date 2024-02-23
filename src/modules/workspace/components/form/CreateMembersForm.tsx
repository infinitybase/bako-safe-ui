import { Box, Divider, Link, Text } from '@chakra-ui/react';
import { Controller } from 'react-hook-form';

import { AutoComplete } from '@/components/autocomplete';
import { useAddressBook } from '@/modules/addressBook';

import { UseChangeMember } from '../../hooks';

interface MemberAddressForm {
  form: UseChangeMember['form']['memberForm'];
  addressBook: UseChangeMember['addressBook'];
}

/* TODO: Move to components folder */
export const MemberAddressForm = ({ form, addressBook }: MemberAddressForm) => {
  const { paginatedContacts } = useAddressBook(true);

  const bottomAction = (
    <Box mt={2}>
      <Text color="grey.200" fontSize={12}>
        Do you wanna{' '}
        <Link
          color="brand.500"
          onClick={() =>
            addressBook.handleOpenDialog?.({
              address: form.getValues('address'),
            })
          }
        >
          add
        </Link>{' '}
        this address in your address book?
      </Text>
    </Box>
  );

  return (
    <Box w="full" maxW={500} pr={12}>
      <Controller
        name="address"
        control={form.control}
        render={({ field, fieldState }) => (
          <AutoComplete
            index={0}
            label="Name or address"
            value={field.value}
            onInputChange={addressBook.search.handler}
            onChange={field.onChange}
            errorMessage={fieldState.error?.message}
            isInvalid={fieldState.invalid}
            options={paginatedContacts.data!}
            isLoading={!paginatedContacts.isSuccess}
            bottomAction={bottomAction}
            inView={addressBook.inView}
          />
        )}
      />
      <Divider borderColor="dark.100" my={9} />
    </Box>
  );
};
