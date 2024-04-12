import { useCallback } from 'react';
import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';
import { useQueries } from 'react-query';

import { AutocompleteOption } from '@/components/autocomplete';
import { AddressBookQueryKey } from '@/modules/core/models/addressBook';
import { WorkspaceContact } from '@/modules/core/models/workspace';
import { AddressUtils } from '@/modules/core/utils/address';
import { AddressBookUtils } from '@/utils/address-book';

import { AddressBookService } from '../services/methods';

type AddressesErrors = Merge<
  FieldError,
  (
    | Merge<
        FieldError,
        FieldErrorsImpl<{
          value: string;
        }>
      >
    | undefined
  )[]
>;

export type AddressesFields = { value: string }[];

const useAddressBookAutocompleteOptions = (
  workspaceId: string,
  includePersonal: boolean,
  contacts: WorkspaceContact[] = [],
  fields: AddressesFields = [],
  errors?: AddressesErrors,
) => {
  const contactIds = contacts.map((contact) => contact.id).join('-');

  const getValidAddresses = useCallback(
    (fieldValue: string) => {
      const validSelectedValues: string[] = [];

      fields?.forEach((field, index) => {
        if (
          !errors?.[index]?.value &&
          !validSelectedValues.includes(field.value)
        ) {
          validSelectedValues.push(field.value);
        }
      });

      return validSelectedValues.filter((address) => address !== fieldValue);
    },
    [errors, fields],
  );

  const handleFieldOptions = useCallback(
    (fieldValue: string, options: AutocompleteOption[]) => {
      const addressIsValid = AddressUtils.isValid(fieldValue);

      if (addressIsValid) {
        const optionsHasNoDefaultValue = options.every(
          (o) => o.value !== fieldValue,
        );

        if (optionsHasNoDefaultValue) {
          options = [...options, { label: fieldValue, value: fieldValue }];
        }
      }

      return options;
    },
    [],
  );

  const options = useQueries(
    fields.map((field) => {
      const excludeContacts = getValidAddresses(field.value);
      const excludeContactsQueryKey = excludeContacts.join('-');

      return {
        queryKey: AddressBookQueryKey.LIST_BY_USER_PAGINATED(
          workspaceId,
          field.value ?? '',
          contactIds,
          includePersonal,
          excludeContactsQueryKey,
        ),
        queryFn: () =>
          AddressBookService.search(
            {
              q: field.value,
              excludeContacts,
              includePersonal,
              perPage: 5,
            },
            contacts,
          ),
      };
    }),
  ).map((o) => {
    return (
      o?.data?.map(({ nickname, user }) => {
        return {
          label: AddressBookUtils.formatForAutocomplete(nickname, user.address),
          value: user.address,
        };
      }) ?? []
    );
  });

  return {
    options,
    handleFieldOptions,
  };
};

export { useAddressBookAutocompleteOptions };
