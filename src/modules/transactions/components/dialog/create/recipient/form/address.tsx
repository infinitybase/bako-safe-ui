import { Field, HStack } from 'bako-ui';
import { AddressUtils as BakoSafeUtils } from 'bakosafe';
import { Address, isB256 } from 'fuels';
import { memo, useCallback, useMemo, useState } from 'react';
import { FieldError, useFormContext } from 'react-hook-form';

import { BakoIdIcon, CloseCircle } from '@/components';
import AddressAutocomplete from '@/components/autocomplete/address';
import { AddressBookIcon } from '@/components/icons/address-book';
import {
  AddressUtils,
  AddToAddressBook,
  EnumOption,
  ITransactionForm,
  useDebounce,
} from '@/modules';
import {
  useResolverAddressQuery,
  useResolverNameQuery,
} from '@/modules/core/hooks/bako-id';
import { useWorkspaceContext } from '@/modules/workspace/hooks';
import { HandleUtils } from '@/utils';

interface RecipientFormAddressProps {
  index: number;
  value: string | undefined;
  onChange: (value: string) => void;
  handleOpenDialog: (addr: string) => void;
  isLoading: boolean;
  addressBookOptions: Array<EnumOption & { name: string }>;
  optionsRef?: (node: HTMLDivElement) => void;
  error?: FieldError;
}

const RecipientFormAddress = ({
  index,
  handleOpenDialog,
  isLoading,
  addressBookOptions,
  onChange,
  value,
  optionsRef,
  error,
}: RecipientFormAddressProps) => {
  const [inputValue, setInputValue] = useState(value || '');
  const {
    addressBookInfos: {
      requests: { listContactsRequest },
      canAddMember,
    },
    providerInstance,
  } = useWorkspaceContext();
  const { setValue } = useFormContext<ITransactionForm>();

  const debouncedValue = useDebounce(inputValue, 600);

  const isHandleInputted = useMemo(
    () => inputValue.startsWith('@'),
    [inputValue],
  );
  const { name, isLoading: isResolvingName } = useResolverNameQuery(
    { address: debouncedValue, providerInstance },
    { enabled: isB256(debouncedValue) },
  );
  const { address, isLoading: isResolvingAddress } = useResolverAddressQuery(
    { name: debouncedValue, providerInstance },
    { enabled: isHandleInputted && debouncedValue.length > 3 },
  );

  const bakoIdData = useMemo(
    () => ({
      label: name ? HandleUtils.toHandle(name) : inputValue,
      value: address || inputValue,
      image: BakoIdIcon,
    }),
    [inputValue, name, address],
  );

  const filteredOptions = useMemo(
    () =>
      addressBookOptions.map((option) => ({
        ...option,
        label: option.name,
        image: AddressBookIcon,
      })),
    [addressBookOptions],
  );

  const showBakoIdOption = useMemo(() => !!name || !!address, [name, address]);

  const autocompleteOptions = useMemo(() => {
    if (isHandleInputted || showBakoIdOption) {
      return showBakoIdOption ? [bakoIdData] : [];
    }
    return filteredOptions;
  }, [isHandleInputted, filteredOptions, showBakoIdOption, bakoIdData]);

  const currentValue = useMemo(
    () => autocompleteOptions.find((o) => o.value === value),
    [autocompleteOptions, value],
  );

  const handleChange = useCallback(
    (value: string) => {
      onChange(value);
      setInputValue(value);
    },
    [onChange],
  );

  const handleClear = useCallback(() => {
    onChange('');
    setInputValue('');
  }, [onChange]);

  const showAddToAddressBook = useMemo(
    () =>
      canAddMember &&
      !!value &&
      !error?.message &&
      AddressUtils.isValid(value) &&
      !BakoSafeUtils.isEvm(value) &&
      listContactsRequest.data &&
      !listContactsRequest.data
        .map((o) => new Address(o.user.address).toString())
        .includes(isB256(value) ? new Address(value).toString() : value),
    [canAddMember, error?.message, listContactsRequest.data, value],
  );

  const handleSelectOption = useCallback(
    (value: string) => {
      if (isHandleInputted && address) {
        setValue(`transactions.${index}.resolvedLabel`, bakoIdData.label);
        return onChange(value);
      }
      setValue(`transactions.${index}.resolvedLabel`, '');
      onChange(value);
    },
    [address, bakoIdData.label, index, isHandleInputted, onChange, setValue],
  );

  const isLoadingOptions = useMemo(
    () => isLoading || isResolvingAddress || isResolvingName,
    [isLoading, isResolvingAddress, isResolvingName],
  );

  const emptyOptionsText = useMemo(() => {
    if (isHandleInputted && inputValue.length > 3) {
      return 'No resolver for domain provided';
    }
    return 'No results found';
  }, [inputValue, isHandleInputted]);

  return (
    <HStack align="start" gap={2} position="relative" width="100%">
      <Field.Root invalid={!!error?.message} flex="1">
        <AddressAutocomplete
          label="Address destination"
          aria-label={`Autocomplete Recipient Address ${index + 1}`}
          value={currentValue}
          rightElement={
            <CloseCircle
              onClick={handleClear}
              size="xs"
              cursor="pointer"
              display={currentValue ? 'inline-flex' : 'none'}
            />
          }
          onInputChange={handleChange}
          inputValue={inputValue}
          isLoading={isLoadingOptions}
          options={autocompleteOptions}
          onSelect={handleSelectOption}
          optionsRef={optionsRef}
          emptyOptionsText={emptyOptionsText}
        />

        {error?.message && (
          <Field.HelperText>{error?.message}</Field.HelperText>
        )}
        <AddToAddressBook
          visible={showAddToAddressBook}
          onAdd={() => handleOpenDialog?.(value!)}
        />
      </Field.Root>
    </HStack>
  );
};

RecipientFormAddress.displayName = 'RecipientFormAddress';

export default memo(RecipientFormAddress);
