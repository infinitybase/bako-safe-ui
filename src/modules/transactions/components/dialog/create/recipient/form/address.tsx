import { Box, FormControl, FormHelperText, HStack } from '@chakra-ui/react';
import { AddressUtils as BakoSafeUtils } from 'bakosafe';
import { Address, isB256 } from 'fuels';
import { memo, useCallback, useMemo } from 'react';
import { FieldError, useFormContext, useWatch } from 'react-hook-form';

import { Autocomplete } from '@/components';
import { AddressUtils, AddToAddressBook, EnumOption } from '@/modules';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';
import { AddressBookUtils } from '@/utils';

import Clear from './clear';

interface RecipientFormAddressProps {
  index: number;
  value: string;
  onChange: (value: string) => void;
  handleOpenDialog: (addr: string) => void;
  isLoading: boolean;
  handleResolverName: (name: string) => Promise<string | null>;
  handleResolverAddress: (address: string) => Promise<string | null>;
  addressBookOptions: EnumOption[];
  optionsRef?: (node: HTMLDivElement) => void;
  error?: FieldError;
}

const RecipientFormAddress = ({
  index,
  handleOpenDialog,
  isLoading,
  handleResolverAddress,
  handleResolverName,
  addressBookOptions,
  onChange,
  value,
  optionsRef,
  error,
}: RecipientFormAddressProps) => {
  const {
    addressBookInfos: {
      requests: { listContactsRequest },
      inView,
      canAddMember,
    },
  } = useWorkspaceContext();
  const { setValue, control } = useFormContext();
  const labelPath = `transactions.${index}.resolvedLabel` as const;
  const resolvedLabel = useWatch({ control, name: labelPath });
  const inputValue = resolvedLabel?.startsWith('@') ? resolvedLabel : value;

  const filteredOptions = useMemo(
    () =>
      addressBookOptions.filter(
        (a) => new Address(a.value).toString() !== value,
      ),
    [addressBookOptions, value],
  );

  const handleClear = useCallback(() => {
    onChange('');
    setValue(labelPath, '');
  }, [onChange, setValue, labelPath]);

  const showAddToAddressBook = useMemo(
    () =>
      canAddMember &&
      !error?.message &&
      AddressUtils.isValid(value) &&
      !BakoSafeUtils.isEvm(value) &&
      listContactsRequest.data &&
      !listContactsRequest.data
        .map((o) => new Address(o.user.address).toString())
        .includes(isB256(value) ? new Address(value).toString() : value),
    [canAddMember, error?.message, listContactsRequest.data, value],
  );

  return (
    <HStack align="start" spacing={2} position="relative" width="100%">
      <FormControl isInvalid={!!error?.message} flex="1">
        <Box position="relative">
          <Autocomplete
            label={`Recipient ${index + 1} address`}
            ariaLabel={`Autocomplete Recipient Address ${index + 1}`}
            value={inputValue}
            onChange={onChange}
            onInputChange={async (value: string) => {
              const result = { value, label: value };

              if (value.startsWith('@')) {
                const address = await handleResolverAddress(
                  value.split(' - ').at(0)!,
                );

                if (address) {
                  result.value = address;
                  result.label = AddressBookUtils.formatForAutocomplete(
                    value,
                    address,
                  );
                }
              } else if (isB256(value)) {
                const name = await handleResolverName(value);
                if (name) {
                  result.label = AddressBookUtils.formatForAutocomplete(
                    name,
                    value,
                  );
                }
                result.value = new Address(value).toB256();
              }

              onChange(result.value);
              setValue(`transactions.${index}.resolvedLabel`, result.label);
              return result;
            }}
            isLoading={isLoading}
            options={filteredOptions}
            inView={inView}
            clearable
            optionsRef={optionsRef}
            variant="dark"
          />
          {!!value && <Clear onClear={handleClear} />}
        </Box>
        <FormHelperText color="error.500">{error?.message}</FormHelperText>
        <AddToAddressBook
          visible={showAddToAddressBook}
          onAdd={() => handleOpenDialog?.(value)}
        />
      </FormControl>
    </HStack>
  );
};

RecipientFormAddress.displayName = 'RecipientFormAddress';

export default memo(RecipientFormAddress);
