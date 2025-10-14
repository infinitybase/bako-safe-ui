import { Box, Field } from 'bako-ui';
import { Address, isB256 } from 'fuels';
import { Controller } from 'react-hook-form';

import { Autocomplete } from '@/components';
import { AddToAddressBook } from '@/modules/addressBook/components';
import {
  useAddressBookAutocompleteOptions,
  useAddressBookInputValue,
} from '@/modules/addressBook/hooks';
import { AddressUtils } from '@/modules/core/utils/address';

import { UseChangeMember } from '../../hooks';
import { useWorkspaceContext } from '../../WorkspaceProvider';

interface MemberAddressForm {
  form: UseChangeMember['form']['memberForm'];
  addressBook: UseChangeMember['addressBook'];
}

/* TODO: Move to components folder */
export const MemberAddressForm = ({ form, addressBook }: MemberAddressForm) => {
  const {
    authDetails: { userInfos },
    addressBookInfos: {
      requests: { listContactsRequest },
      handlers: { handleOpenDialog },
      workspaceId,
    },
  } = useWorkspaceContext();
  const { setInputValue } = useAddressBookInputValue();

  const { optionsRequests, handleFieldOptions, optionRef } =
    useAddressBookAutocompleteOptions({
      workspaceId: workspaceId!,
      includePersonal: !userInfos.onSingleWorkspace,
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
            listContactsRequest.isSuccess &&
            listContactsRequest.data &&
            !listContactsRequest.data
              .map((o) => Address.fromString(o.user.address).toString())
              .includes(
                isB256(field.value)
                  ? Address.fromString(field.value).toString()
                  : field.value,
              );

          return (
            <>
              <Field.Root invalid={fieldState.invalid}>
                <Autocomplete
                  label="Name or address"
                  value={field.value}
                  optionsRef={optionRef}
                  onChange={field.onChange}
                  onInputChange={(value: string) => setInputValue(value)}
                  options={appliedOptions}
                  isLoading={!optionsRequests[0].isSuccess}
                  inView={addressBook.inView}
                  clearable={false}
                  variant={'dark'}
                />

                <Field.HelperText color="error.500">
                  {fieldState.error?.message}
                </Field.HelperText>
              </Field.Root>

              <AddToAddressBook
                visible={showAddToAddressBook}
                onAdd={() =>
                  handleOpenDialog?.({
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
