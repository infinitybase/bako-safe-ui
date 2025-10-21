import {
  Field,
  floatingStyles,
  Input,
  InputGroup,
  InputProps,
  Loader,
} from 'bako-ui';
import { isB256 } from 'fuels';
import { useCallback, useEffect, useRef, useState } from 'react';

import { UseAddressBookReturn } from '@/modules/addressBook/hooks';
import { useBakoIDClient } from '@/modules/core/hooks/bako-id';
import { useWorkspaceContext } from '@/modules/workspace/hooks';
import { AddressBookUtils } from '@/utils';

interface AddressInputProps
  extends Omit<InputProps, 'value' | 'onChange' | 'placeholder'> {
  value: string;
  onChange: (value: string) => void;
  adbForm: UseAddressBookReturn['form'];
}

const AddressInput = (props: AddressInputProps) => {
  const { onChange, value, adbForm, ...rest } = props;

  const [inputValue, setInputValue] = useState<string>(value);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const { providerInstance } = useWorkspaceContext();
  const {
    handlers: { fetchResolverName, fetchResolveAddress },
  } = useBakoIDClient(providerInstance);

  const setAddressBookInputValue = useCallback(
    async (value: string) => {
      const result = { value: value, label: value };

      if (value.startsWith('@')) {
        const address = await fetchResolveAddress.handler(
          value.split(' - ').at(0)!,
        );
        if (address) {
          result.value = address;
          result.label = AddressBookUtils.formatForAutocomplete(value, address);
        }
      }

      if (isB256(value)) {
        const name = await fetchResolverName.handler(value);
        if (name) {
          result.label = AddressBookUtils.formatForAutocomplete(name, value);
          result.value = value;
        }
      }

      return result;
    },
    [adbForm],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const _value = e.target.value;
      setInputValue(_value);
      onChange(_value);
      adbForm.setValue('handle', '');
      adbForm.setValue('resolver', '');

      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      debounceTimeout.current = setTimeout(async () => {
        const result = await setAddressBookInputValue(_value);
        const handle = result?.label.split(' - ')[0];

        setInputValue(result.label);
        onChange(result.value);

        if (handle && handle.startsWith('@')) {
          adbForm.setValue('handle', handle);
          if (isB256(result.value)) {
            adbForm.setValue('resolver', result.value);
          }
        }
      }, 1500); // 1.5s debounce delay
    },
    [setInputValue],
  );

  useEffect(() => {
    (async () => {
      const handleFromContact = adbForm.watch('handle');
      if (handleFromContact) {
        const result = await setAddressBookInputValue(handleFromContact);
        setInputValue(result.label);
        onChange(result.value);
      } else if (!handleFromContact && value) {
        const result = await setAddressBookInputValue(value);
        setInputValue(result.label);
        onChange(result.value);
      }
    })();

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      adbForm.setValue('handle', '');
      adbForm.setValue('resolver', '');
      adbForm.setValue('address', '');
    };
  }, []);

  useEffect(() => {
    if (!value || !value?.startsWith('@')) return;

    if (fetchResolveAddress.isLoading || fetchResolverName.isLoading) {
      return;
    }

    if (value.startsWith('@') && !adbForm.getValues('resolver')) {
      adbForm.setError('address', {
        type: 'manual',
        message: 'Not found resolver for this handle',
      });
    }
  }, [fetchResolveAddress.isLoading, fetchResolverName.isLoading, value]);

  return (
    <Field.Root>
      <InputGroup
        endAddonProps={
          <Loader
            css={{ '--spinner-track-color': 'dark.100' }}
            size="md"
            color="brand.500"
          />
        }
      >
        <Input
          {...rest}
          value={inputValue}
          onChange={handleInputChange}
          placeholder=" "
          pt={2}
          px={3}
        />
      </InputGroup>
      <Field.Label
        css={floatingStyles({
          withStartIcon: false,
          hasValue: inputValue.length > 0,
        })}
      >
        Address
      </Field.Label>
    </Field.Root>
  );
};

export { AddressInput };
