import { useCallback, useMemo } from 'react';
import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';

import { AutocompleteOption } from '@/components/autocomplete';
import { WorkspaceContact } from '@/modules/core/models/workspace';
import { AddressBookUtils } from '@/utils/address-book';

import { useInfiniteListcontactsRequest } from './useInfiniteListContactsRequest';

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

  const handleValidAddresses = useCallback(
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

  const handleQueryData = useCallback((data: WorkspaceContact[]) => {
    return data?.map(({ nickname, user }) => ({
      label: AddressBookUtils.formatForAutocomplete(nickname, user.address),
      value: user.address,
    }));
  }, []);

  const handleFieldOptions = useCallback(
    (
      fieldValue: string,
      options: AutocompleteOption[],
      isMyAddress?: boolean,
    ) => {
      if (isMyAddress) {
        options = [...options, { label: fieldValue, value: fieldValue }];
      }

      return options;
    },
    [],
  );

  const currentIndex = fields?.length <= 1 ? 0 : fields.length - 1;

  const currentField = fields[currentIndex];

  const excludeContacts = handleValidAddresses(currentField.value);
  const excludeContactsQueryKey = excludeContacts.join('-');

  const { infinityContacts, lastElementRef, data, ...query } =
    useInfiniteListcontactsRequest(
      workspaceId,
      currentField.value,
      contactIds,
      includePersonal,
      excludeContactsQueryKey,
      excludeContacts,
    );

  const formattedQueries = useMemo(() => {
    return fields.map(() => {
      const formattedData = infinityContacts
        ? handleQueryData(infinityContacts)
        : [];

      return {
        ...query,
        options: formattedData,
      };
    });
  }, [handleQueryData, data, query]);

  return {
    optionsRequests: formattedQueries,
    handleFieldOptions,
    optionRef: lastElementRef,
  };
};

export { useAddressBookAutocompleteOptions };
