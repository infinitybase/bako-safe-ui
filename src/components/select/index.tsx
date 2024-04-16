import { Icon } from '@chakra-ui/icons';
import {
  Box,
  CircularProgress,
  Flex,
  FormLabel,
  Input,
  InputGroup,
  InputProps,
  InputRightElement,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';

import { ArrowDownIcon } from '../icons';

interface SelectOptions {
  label: string | number;
  value: string | number;
}

interface SelectProps
  extends Omit<
    InputProps,
    | 'onChange'
    | 'value'
    | 'placeholder'
    | 'onBlur'
    | 'onFocus'
    | 'cursor'
    | 'isReadOnly'
    | '_readOnly'
  > {
  value?: any;
  options?: SelectOptions[];
  label?: string;
  isLoading?: boolean;
  onChange: (value: any) => void;
}

const Select = ({
  value,
  options,
  label,
  isLoading,
  isDisabled,
  onChange,
  isInvalid,
  style,
  ...rest
}: SelectProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState<any>('');
  const [open, setOpen] = useState<boolean>(false);

  const isOpen = open && options && options.length > 0 && !isLoading;

  const handleSelectOption = (value: string | number) => {
    onChange(value);
    setOpen(false);
  };

  const handleRighElementClick = () => {
    setOpen(!open);
    inputRef.current?.focus();
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      optionsRef.current &&
      !optionsRef.current.contains(event.target as Node)
    ) {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (options && options.length > 0) {
      const selectedOption = options.find((option) => option.value === value);
      if (selectedOption) {
        setInputValue(selectedOption.label);
      }
    }
  }, [options, value]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <InputGroup>
        <Input
          ref={inputRef}
          value={inputValue}
          placeholder=" "
          isReadOnly
          disabled={isDisabled}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          isInvalid={isInvalid}
          cursor="pointer"
          _readOnly={{
            boxShadow: isInvalid ? 'error.600' : 'none',
          }}
          style={
            label
              ? { ...style }
              : {
                  paddingTop: '0.5rem',
                  paddingBottom: '0.5rem',
                  ...style,
                }
          }
          {...rest}
        />

        <FormLabel>{label}</FormLabel>

        <InputRightElement
          hidden={isOpen || isDisabled}
          px={3}
          top="1.5px"
          right="1px"
          borderRadius={10}
          bgColor={'dark.250'}
          h="calc(100% - 3px)"
          w={10}
          onClick={handleRighElementClick}
          cursor={isLoading ? 'default' : 'pointer'}
        >
          {isLoading ? (
            <CircularProgress
              trackColor="dark.100"
              size={18}
              isIndeterminate
              color="brand.500"
            />
          ) : (
            <Icon as={ArrowDownIcon} fontSize={10} color="grey.200" />
          )}
        </InputRightElement>
      </InputGroup>

      {isOpen && (
        <Box
          ref={optionsRef}
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
              maxH={207}
              gap={0}
              overflowY="scroll"
              css={{
                '&::-webkit-scrollbar': { width: '0' },
                scrollbarWidth: 'none',
              }}
            >
              {options.map(({ value, label }) => (
                <Box
                  key={value}
                  w="full"
                  p={2}
                  borderRadius={10}
                  cursor="pointer"
                  _hover={{ background: 'dark.150' }}
                  onMouseDown={() => handleSelectOption(value)}
                >
                  <Text
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    w="full"
                  >
                    {label}
                  </Text>
                </Box>
              ))}
            </VStack>
          </Flex>
        </Box>
      )}
    </>
  );
};

export { Select, SelectOptions, SelectProps };
