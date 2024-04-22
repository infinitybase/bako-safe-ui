import {
  Box,
  CircularProgress,
  Flex,
  FormLabel,
  Input,
  InputGroup,
  InputGroupProps,
  InputRightElement,
  Text,
  VStack,
} from '@chakra-ui/react';
import {
  ChangeEvent,
  CSSProperties,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { InViewHookResponse } from 'react-intersection-observer';

export interface AutocompleteOption {
  value: string;
  label: string;
}

interface AutocompleteProps extends Omit<InputGroupProps, 'onChange'> {
  label?: string;
  value?: string;
  options: AutocompleteOption[];
  disabled?: boolean;
  isLoading?: boolean;
  inputStyle?: CSSProperties;
  rightElement?: ReactNode;
  filterSelectedOption?: boolean;
  inView?: InViewHookResponse;
  onChange: (value: string) => void;
  onInputChange?: (e: React.ChangeEvent<HTMLInputElement> | string) => void;
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
  onChange,
  onInputChange,
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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onChange(e.target.value);
    onInputChange?.(e);
  };

  const handleSelect = (selectedOption: AutocompleteOption) => {
    setInputValue(selectedOption.label);
    onChange(selectedOption.value);
    onInputChange?.(selectedOption.value);
  };

  const handleFocus = () => {
    if (!inputValue) onInputChange?.('');
    setIsFocused(true);
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
            px={3}
            top="1px"
            right="1px"
            borderRadius={10}
            bgColor={rightElement ? 'dark.250' : 'transparent'}
            h="calc(100% - 3px)"
            w={10}
          >
            {isLoading && isFocused ? (
              <CircularProgress
                trackColor="dark.100"
                size={18}
                isIndeterminate
                color="brand.500"
              />
            ) : (
              rightElement
            )}
          </InputRightElement>
        )}
      </InputGroup>

      {isOpen && (
        <Box
          bg="dark.200"
          color="grey.200"
          fontSize="md"
          borderColor="dark.100"
          borderWidth={1}
          borderRadius={10}
          padding={2}
          position="absolute"
          zIndex={200}
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
