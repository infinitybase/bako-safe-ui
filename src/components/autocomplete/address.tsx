import { Box, IconProps, InputGroupProps, Stack, Text } from 'bako-ui';
import {
  forwardRef,
  ForwardRefExoticComponent,
  memo,
  RefObject,
  useCallback,
  useMemo,
  useRef,
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
  boundaryRef?: RefObject<HTMLDivElement | null>;
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
        boundaryRef,
        ...rest
      },
      ref,
    ) => {
      const anchorRef = useRef<HTMLDivElement>(null);
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
          ref={anchorRef}
          placeholder={label}
          isLoading={isLoading}
          rightElement={rightElement}
          value={value}
          inputProps={{
            value: inputValue || value?.value || '',
            onFocus: handleFocus,
            onBlur: handleOnBlur,
            onChange: handleInputChange,
            ref,
          }}
          {...rest}
        >
          {isOpen && (
            <Autocomplete.List
              anchorRef={anchorRef}
              rootRef={optionsRef}
              boundaryRef={boundaryRef}
            >
              {options.map((option) => (
                <Autocomplete.ListItem
                  value={option.value}
                  key={option.value}
                  onSelect={(value) => onSelect(value ?? '')}
                  display="flex"
                  alignItems="center"
                  gap={2}
                >
                  <Box rounded="full" boxSize="24px" overflow="hidden">
                    <InputValueImage
                      image={option.image}
                      label={option.label || ''}
                      boxSize="24px"
                    />
                  </Box>
                  <Stack gap={0}>
                    <Text
                      color="textPrimary"
                      fontSize="sm"
                      lineHeight="shorter"
                    >
                      {option.label}
                    </Text>
                    <Text
                      color="textSecondary"
                      fontSize="xs"
                      lineHeight="shorter"
                    >
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
