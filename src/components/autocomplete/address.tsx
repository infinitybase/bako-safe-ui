import { Box, IconProps, InputGroupProps, Stack, Text } from '@chakra-ui/react';
import {
  forwardRef,
  ForwardRefExoticComponent,
  memo,
  useCallback,
  useMemo,
  useState,
} from 'react';

import { AddressUtils } from '@/modules';

import { AutocompleteOption } from './basic';
import Autocomplete from './components';
import InputValueImage from './components/inputValueImage';

export interface AddressAutocompleteValue extends AutocompleteOption {
  image?: ForwardRefExoticComponent<
    IconProps & React.RefAttributes<SVGSVGElement>
  >;
}

interface AddressAutocompleteProps
  extends Omit<InputGroupProps, 'onSelect' | 'children'> {
  options: AddressAutocompleteValue[];
  label: string;
  value?: AddressAutocompleteValue;
  isLoading?: boolean;
  onInputChange?: (value: string) => void;
  rightElement?: React.ReactNode;
  inputValue?: string;
  optionsRef?: (node: HTMLDivElement) => void;
  onSelect: (value: string) => void;
  emptyOptionsText?: string;
}

/**
 * Address Autocomplete Component with avatar support for Bako handles.
 */
const AddressAutocomplete = memo(
  forwardRef<HTMLInputElement, AddressAutocompleteProps>(
    (
      {
        isLoading,
        value,
        options,
        optionsRef,
        label,
        onInputChange,
        rightElement,
        inputValue,
        onSelect,
        emptyOptionsText,
        ...rest
      },
      ref,
    ) => {
      const [isFocused, setIsFocused] = useState<boolean>(false);

      const isOpen = useMemo(
        () => isFocused && !value && !isLoading,
        [isFocused, isLoading, value],
      );

      const handleFocus = useCallback(() => {
        setIsFocused(true);
      }, []);

      const handleOnBlur = useCallback(() => {
        setIsFocused(false);
      }, []);

      const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
          onInputChange?.(e.target.value);
        },
        [onInputChange],
      );

      return (
        <Autocomplete.Root
          ref={ref}
          label={label}
          isLoading={isLoading}
          rightElement={rightElement}
          value={value}
          inputProps={{
            value: inputValue || value?.value || '',
            onFocus: handleFocus,
            onBlur: handleOnBlur,
            onChange: handleInputChange,
          }}
          {...rest}
        >
          {isOpen && (
            <Autocomplete.List rootRef={optionsRef}>
              {options.map((option) => (
                <Autocomplete.ListItem
                  value={option.value}
                  key={option.value}
                  onSelect={(value) => onSelect(value ?? '')}
                  display="flex"
                  alignItems="center"
                  gap={2}
                >
                  <Box rounded="full" boxSize={8} overflow="hidden">
                    <InputValueImage
                      image={option.image}
                      label={option.label || ''}
                      boxSize="32px"
                    />
                  </Box>
                  <Stack gap={0}>
                    <Text color="section.200">{option.label}</Text>
                    <Text color="section.500">
                      {AddressUtils.format(option.value || '')}
                    </Text>
                  </Stack>
                </Autocomplete.ListItem>
              ))}

              {options?.length === 0 && !isLoading && (
                <Autocomplete.ListEmpty emptyMessage={emptyOptionsText} />
              )}
            </Autocomplete.List>
          )}
        </Autocomplete.Root>
      );
    },
  ),
);

AddressAutocomplete.displayName = 'AddressAutocomplete';

export default AddressAutocomplete;
