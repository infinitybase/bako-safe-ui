import {
  Box,
  CircularProgress,
  Flex,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputGroupProps,
  InputRightElement,
  Text,
  VStack,
} from '@chakra-ui/react';
import { isB256 } from 'fuels';
import {
  ChangeEvent,
  CSSProperties,
  LegacyRef,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { InViewHookResponse } from 'react-intersection-observer';

import { useBakoIDClient } from '@/modules/core/hooks/bako-id';
import { AddressBookUtils } from '@/utils';

import { LineCloseIcon } from '../icons';

export interface AutocompleteOption {
  value: string;
  label: string;
}

interface AutocompleteProps extends Omit<InputGroupProps, 'onChange'> {
  label?: string;
  value?: string;
  options?: AutocompleteOption[];
  disabled?: boolean;
  isLoading?: boolean;
  inputStyle?: CSSProperties;
  rightElement?: ReactNode;
  filterSelectedOption?: boolean;
  inView?: InViewHookResponse;
  clearable?: boolean;
  optionsRef?: LegacyRef<HTMLDivElement>;
  optionsContainerRef?: LegacyRef<HTMLDivElement>;
  onChange: (value: string) => void;
  onInputChange?: (
    value: string,
  ) => AutocompleteOption | Promise<AutocompleteOption>;
  actionOnFocus?: () => void;
  actionOnSelect?: () => void;
  actionOnRemoveInput?: () => void;
  actionOnBlur?: () => void;
  inputRef?: LegacyRef<HTMLInputElement>;
  providerInstance?: any;
}
// import { useCallback, useEffect, useRef, useState } from 'react';

const Autocomplete = ({
  label,
  value,
  options,
  disabled,
  isLoading,
  inputStyle,
  rightElement,
  filterSelectedOption = true,
  inView,
  clearable = true,
  onChange,
  optionsRef,
  optionsContainerRef,
  actionOnFocus = () => {},
  actionOnSelect = () => {},
  actionOnRemoveInput = () => {},
  actionOnBlur = () => {},
  inputRef,
  providerInstance,
  ...rest
}: AutocompleteProps) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const {
    handlers: { fetchResolverName, fetchResolveAddress },
  } = useBakoIDClient(providerInstance);

  const [inputValue, setInputValue] = useState<string>(value || '');
  const [formattedLabel, setFormattedLabel] = useState<string | null>(null);

  useEffect(() => {
    const fetchAutocompleteData = async () => {
      if (!value) return;

      const result = { value, label: value };

      if (value.startsWith('@')) {
        const address = await fetchResolveAddress.handler(
          value.split(' - ').at(0)!,
        );
        if (address) {
          result.value = address;
          result.label = AddressBookUtils.formatForAutocomplete(value, address);
        }
      } else if (isB256(value)) {
        const name = await fetchResolverName.handler(value);
        if (name) {
          result.label = AddressBookUtils.formatForAutocomplete(name, value);
          result.value = value;
        }
      }

      if (result.label !== result.value) {
        setFormattedLabel(result.label);
      } else {
        setFormattedLabel(null);
      }

      onChange(result.value);
    };

    fetchAutocompleteData();
  }, [value]);

  useEffect(() => {
    if (formattedLabel) {
      setInputValue(formattedLabel);
    }
  }, [formattedLabel]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setFormattedLabel(null);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      onChange(newValue);
    }, 1500);
  };

  const displayedOptions =
    filterSelectedOption && options
      ? options.filter((o) => o.value !== value)
      : options;

  const isOpen =
    isFocused && displayedOptions && displayedOptions.length > 0 && !isLoading;

  const showClearIcon = clearable && inputValue;

  const handleSelect = (selectedOption: AutocompleteOption) => {
    actionOnSelect();
    setInputValue(selectedOption.label);
    onChange(selectedOption.value);
  };

  const handleFocus = () => {
    actionOnFocus();
    setIsFocused(true);
  };

  const handleRemoveInput = () => {
    actionOnRemoveInput();
  };

  const handleClear = () => {
    setInputValue('');
    onChange('');
  };

  const handleOnBlur = () => {
    actionOnBlur();
    setIsFocused(false);
  };

  useEffect(() => {
    if (options && options.length > 0) {
      const selectedOption = options.find((option) => option.value === value);
      if (selectedOption) {
        setInputValue(selectedOption.label);
      }
    }
  }, [value, options]);

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  return (
    <>
      <InputGroup {...rest}>
        <Input
          value={inputValue}
          placeholder=" "
          disabled={disabled}
          autoComplete="off"
          onChange={handleInputChange}
          onBlur={handleOnBlur}
          onFocus={handleFocus}
          style={inputStyle}
          ref={inputRef}
          pr={10}
          sx={{ pr: !disabled && rightElement ? '55px !important' : 'initial' }}
        />

        <FormLabel color="grey.500">{label}</FormLabel>

        {!disabled && rightElement && (
          <InputRightElement
            pr={1}
            top="1px"
            right="1px"
            borderRadius={10}
            bgColor={rightElement ? 'grey.825' : 'transparent'}
            h="calc(100% - 3px)"
            w={showClearIcon && rightElement ? 16 : 10}
            onClick={handleRemoveInput}
          >
            {isLoading && isFocused ? (
              <CircularProgress
                trackColor="dark.100"
                size={18}
                isIndeterminate
                color="brand.500"
              />
            ) : (
              <HStack>
                {showClearIcon && (
                  <LineCloseIcon
                    fontSize={16}
                    color="grey.100"
                    cursor="pointer"
                    onClick={handleClear}
                  />
                )}
                {rightElement}
              </HStack>
            )}
          </InputRightElement>
        )}
      </InputGroup>

      {isOpen && (
        <Box
          ref={optionsContainerRef}
          bg="dark.200"
          color="grey.200"
          fontSize="md"
          borderColor="dark.100"
          borderWidth={1}
          borderRadius={10}
          padding={2}
          position="absolute"
          zIndex={300}
          w="full"
          mt={2}
        >
          <Flex display="flex" justifyContent="center" alignItems="center">
            <VStack
              w="full"
              maxH={194}
              gap={0}
              overflowY="scroll"
              css={{
                '&::-webkit-scrollbar': { width: '0' },
                scrollbarWidth: 'none',
              }}
            >
              {displayedOptions
                .filter((option) => option.value !== value)
                .map((option) => (
                  <Box
                    ref={optionsRef}
                    key={option.value}
                    w="full"
                    p={2}
                    borderRadius={10}
                    cursor="pointer"
                    _hover={{ background: 'dark.150' }}
                    onMouseDown={() => handleSelect(option)}
                  >
                    <Text
                      whiteSpace="nowrap"
                      overflow="hidden"
                      textOverflow="ellipsis"
                      w="full"
                    >
                      {option.label}
                    </Text>
                  </Box>
                ))}
              <Box ref={inView?.ref} />
            </VStack>
          </Flex>
        </Box>
      )}
    </>
  );
};

export { Autocomplete };
