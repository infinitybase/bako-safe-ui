import { Input, InputProps } from '@chakra-ui/react';
import { useCallback, useEffect, useRef, useState } from 'react';

import {
  useAddressBookInputValue,
  UseAddressBookReturn,
} from '@/modules/addressBook/hooks';

interface AddressInputProps
  extends Omit<InputProps, 'value' | 'onChange' | 'placeholder'> {
  value: string;
  onChange: (value: string) => void;
  adbForm: UseAddressBookReturn['form'];
}

const AddressInput = (props: AddressInputProps) => {
  const { onChange, value, adbForm, ...rest } = props;

  const [inputValue, setInputValue] = useState<string>('');
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const { setInputValue: setAddressBookInputValue } =
    useAddressBookInputValue();

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const _value = e.target.value;
      setInputValue(_value);
      onChange(_value);

      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      debounceTimeout.current = setTimeout(() => {
        const result = setAddressBookInputValue(_value);
        const handle = result?.label.split(' - ')[0];

        if (handle && handle.startsWith('@')) {
          adbForm.setValue('handle', handle);
          adbForm.setValue('resolver', result.value);
        }
        setInputValue(result.label);
        onChange(result.value);
      }, 1500); // 1.5s debounce delay
    },
    [setInputValue],
  );

  useEffect(() => {
    const handleFromContact = adbForm.watch('handle');
    if (handleFromContact) {
      const result = setAddressBookInputValue(handleFromContact);
      setInputValue(result.label);
      onChange(result.value);
    } else if (!handleFromContact && value) {
      const result = setAddressBookInputValue(value);
      setInputValue(result.label);
      onChange(result.value);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  return (
    <Input
      {...rest}
      value={inputValue}
      onChange={handleInputChange}
      placeholder=" "
    />
  );
};

export { AddressInput };
