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
import { keyframes } from '@emotion/react';
import {
  ChangeEvent,
  CSSProperties,
  LegacyRef,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { InViewHookResponse } from 'react-intersection-observer';

import { LineCloseIcon } from '../icons';

export interface AutocompleteOption {
  value: string;
  label: string;
}

const slideToPosition = keyframes`
  from {
    transform: translateY(20px); 
    opacity: 0; 
  }
  to {
    transform: translateY(0);
    opacity: 1; 
  }
`;

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
  onInputChange?: (e: React.ChangeEvent<HTMLInputElement> | string) => void;
  isFromTransactions?: boolean;
  actionOnFocus?: (value?: any) => void;
  actionOnSelect?: (value?: any) => void;
  actionOnRemoveInput?: (value?: any) => void;
}

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
  onInputChange,
  optionsRef,
  optionsContainerRef,
  isFromTransactions,
  actionOnFocus,
  actionOnSelect,
  actionOnRemoveInput,
  ...rest
}: AutocompleteProps) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const displayedOptions =
    filterSelectedOption && options
      ? options.filter((o) => o.value !== value)
      : options;

  const isOpen =
    isFocused && displayedOptions && displayedOptions.length > 0 && !isLoading;

  const showClearIcon = clearable && inputValue;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onChange(e.target.value);
    onInputChange?.(e);
  };

  const handleSelect = (selectedOption: AutocompleteOption) => {
    if (actionOnSelect) {
      actionOnSelect();
    }
    setInputValue(selectedOption.label);
    onChange(selectedOption.value);
    onInputChange?.(selectedOption.value);
  };

  const handleFocus = () => {
    if (actionOnFocus) {
      actionOnFocus();
    }
    if (!inputValue) onInputChange?.('');
    setIsFocused(true);
  };

  const handleRemoveInput = () => {
    if (actionOnRemoveInput) {
      actionOnRemoveInput();
    }
  };

  const handleClear = () => {
    setInputValue('');
    onChange('');
    onInputChange?.('');
  };

  useEffect(() => {
    if (options && options.length > 0) {
      const selectedOption = options.find((option) => option.value === value);
      if (selectedOption) {
        setInputValue(selectedOption.label);
      }
    }
  }, [value, options]);

  return (
    <>
      <InputGroup {...rest}>
        <Input
          value={inputValue}
          placeholder=" "
          disabled={disabled}
          autoComplete="off"
          onChange={handleInputChange}
          onBlur={() => setIsFocused(false)}
          onFocus={handleFocus}
          style={inputStyle}
        />

        <FormLabel color="grey.500">{label}</FormLabel>

        {!disabled && (
          <InputRightElement
            pr={1}
            top="1px"
            right="1px"
            borderRadius={10}
            bgColor={rightElement ? 'dark.250' : 'transparent'}
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
          maxW={
            isFromTransactions
              ? 'unset'
              : { base: 'calc(100% - 89px)', xs: 405 }
          }
          position={isFromTransactions ? 'absolute' : 'fixed'}
          zIndex={300}
          sx={{
            animation: `${slideToPosition} 0.3s ease-out`,
          }}
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
