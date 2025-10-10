import {
  Box,
  Field,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputProps,
  Spinner,
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
  isCreatingValue?: boolean;
  onChange: (value: any) => void;
  callbackOnSelectOption?: () => void;
  needShowOptionsAbove?: boolean;
  maxOptionsHeight?: number;
  isInvalid?: boolean;
}

const Select = ({
  value,
  options,
  label,
  isLoading,
  disabled,
  onChange,
  style,
  isCreatingValue,
  callbackOnSelectOption,
  needShowOptionsAbove,
  maxOptionsHeight,
  isInvalid,
  ...rest
}: SelectProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState<any>('');
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [isOptionsVisible, setIsOptionsVisible] = useState<boolean>(false);
  const [optionsPositionAbove, setOptionsPositionAbove] =
    useState<boolean>(false);

  const isReadyToShowOptions =
    showOptions && options && options.length > 0 && !isLoading;
  const showInputRightElement = isReadyToShowOptions || disabled;

  const handleSelectOption = (value: string | number) => {
    callbackOnSelectOption && callbackOnSelectOption();
    onChange(value);
    setShowOptions(false);
  };

  const handleRighElementClick = () => {
    setShowOptions(!open);
    inputRef.current?.focus();
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      !inputRef.current?.contains(event.target as Node) &&
      !optionsRef.current?.contains(event.target as Node)
    ) {
      setShowOptions(false);
    }
  };

  useEffect(() => {
    if (!value) {
      setInputValue('');
      return;
    }
    if (options && options.length > 0) {
      const selectedOption = options.find((option) => option.value === value);
      if (selectedOption) {
        setInputValue(selectedOption.label);
      }
    }
  }, [options, value]);

  useEffect(() => {
    const inputElement = inputRef.current;
    const optionsElement = optionsRef.current;

    if (inputElement && optionsElement) {
      const inputRect = inputElement.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const shouldShowAbove =
        inputRect.bottom + optionsElement.clientHeight > windowHeight;

      setOptionsPositionAbove(needShowOptionsAbove ?? shouldShowAbove);
    }
  }, [showOptions]);

  useEffect(() => {
    if (showOptions) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showOptions]);

  useEffect(() => {
    if (isReadyToShowOptions) {
      const timeoutId = setTimeout(() => {
        setIsOptionsVisible(true);
      }, 50);

      return () => {
        clearTimeout(timeoutId);
      };
    } else {
      setIsOptionsVisible(false);
    }
  }, [isReadyToShowOptions]);

  return (
    <Box position="relative" w="full">
      <InputGroup
        endElement={
          <>
            {isLoading ? (
              <Spinner
                css={{ '--spinner-track-color': 'dark.100' }}
                size="lg"
                color="brand.500"
              />
            ) : (
              <Icon as={ArrowDownIcon} fontSize={10} color="grey.200" />
            )}
          </>
        }
      >
        <Input
          ref={inputRef}
          value={inputValue}
          placeholder=" "
          readOnly
          disabled={disabled}
          onFocus={() => setShowOptions(true)}
          onBlur={() => setShowOptions(false)}
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
      </InputGroup>
      <Field.Label
        fontSize={isCreatingValue ? { base: 'xs', sm: 'md' } : 'unset'}
        pt={isCreatingValue ? { base: 1, sm: 'unset' } : 'unset'}
      >
        {label}
      </Field.Label>

      {isReadyToShowOptions && (
        <Box
          visibility={isOptionsVisible ? 'visible' : 'hidden'}
          ref={optionsRef}
          bg="dark.200"
          color="grey.200"
          fontSize="md"
          borderColor="dark.100"
          borderWidth={1}
          borderRadius={10}
          // adjust this padding
          // padding={2}
          position="absolute"
          zIndex={999}
          w="full"
          top={optionsPositionAbove ? 'auto' : 'calc(100% + 0.5rem)'}
          bottom={optionsPositionAbove ? 'calc(100% + 0.5rem)' : 'auto'}
        >
          <Flex display="flex" justifyContent="center" alignItems="center">
            <VStack
              w="full"
              maxH={maxOptionsHeight ?? 207}
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
                  p={3}
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
    </Box>
  );
};

export { Select, SelectOptions, SelectProps };
