import { AutocompleteOption } from '@ui/components';
import { useCallback, useMemo } from 'react';
import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';

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

type AddressBookAutocompleteOptionsProps = {
  workspaceId: string;
  includePersonal: boolean;
  contacts: WorkspaceContact[];
  fields: AddressesFields;
  errors?: AddressesErrors;
  isUsingTemplate?: boolean;
  isFirstLoading?: boolean;
  dynamicCurrentIndex?: number;
  canRepeatAddresses?: boolean;
};

export type AddressesFields = { [key: string]: string }[];

const useAddressBookAutocompleteOptions = ({
  workspaceId,
  includePersonal,
  contacts = [],
  fields = [],
  errors,
  isUsingTemplate,
  isFirstLoading,
  dynamicCurrentIndex,
  canRepeatAddresses,
}: AddressBookAutocompleteOptionsProps) => {
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

  const currentField = fields[dynamicCurrentIndex ?? currentIndex];

  const excludeContacts = handleValidAddresses(currentField?.value);
  const excludeContactsQueryKey = excludeContacts.join('-');

  const { infinityContacts, lastElementRef, data, ...query } =
    useInfiniteListcontactsRequest(
      workspaceId,
      currentField?.value,
      contactIds,
      includePersonal,
      canRepeatAddresses ? '' : excludeContactsQueryKey,
      canRepeatAddresses ? [''] : excludeContacts,
    );

  const formattedQueries = useMemo(() => {
    const contactsToMapOver =
      isUsingTemplate && isFirstLoading ? contacts : infinityContacts;

    return fields.map(() => {
      const formattedData = contactsToMapOver
        ? handleQueryData(contactsToMapOver)
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
