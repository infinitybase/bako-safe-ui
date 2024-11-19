import { Input, InputProps } from '@chakra-ui/react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useAddressBookInputValue } from '@/modules/addressBook/hooks';

interface AddressInputProps
  extends Omit<InputProps, 'value' | 'onChange' | 'placeholder'> {
  value: string;
  onChange: (value: string) => void;
}

const AddressInput = (props: AddressInputProps) => {
  const { onChange, value, ...rest } = props;

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
        setInputValue(result.label);
        onChange(result.value);
      }, 1500); // 1.5s debounce delay
    },
    [setInputValue],
  );

  useEffect(() => {
    if (value) {
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
