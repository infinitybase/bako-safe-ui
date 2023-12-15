import {
  Box,
  ComponentWithAs,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Icon,
  IconProps,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { ChangeEvent, ReactNode, useEffect, useState } from 'react';

import { AddressUtils } from '@/modules';

interface AutoCompleteOption {
  value: string;
  label: string;
}

interface RightAction {
  icon?: ComponentWithAs<'svg', IconProps>;
  handler?: () => void;
}

interface AutoCompleteProps {
  isLoading: boolean;
  isInvalid: boolean;
  options: AutoCompleteOption[];
  value?: string;
  label: string;
  isDisabled: boolean;
  errorMessage?: string;
  rightAction?: RightAction;
  bottomAction?: ReactNode;
  index?: number;
  onChange: (value: string) => void;
  onInputChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

function AutoComplete({
  isLoading,
  isInvalid,
  isDisabled,
  options,
  value,
  label,
  errorMessage,
  rightAction,
  bottomAction,
  index,
  onChange,
  onInputChange,
}: AutoCompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasSelection, setHasSelection] = useState(false);
  const [inputValue, setInputValue] = useState(value ?? '');
  const [currentIndex, setCurrentIndex] = useState<number>();

  const isContact = (value: string) => {
    return value.includes('-') || value.includes('...');
  };

  const showResultList =
    isOpen &&
    !isDisabled &&
    !hasSelection &&
    inputValue.length > 0 &&
    currentIndex === index;

  const showRightAction = !!rightAction?.handler;
  const showBottomAction =
    bottomAction &&
    !isContact(inputValue) &&
    !isInvalid &&
    !showResultList &&
    inputValue.length > 0 &&
    AddressUtils.isValid(inputValue);

  useEffect(() => {
    setIsOpen(isLoading || options.length ? true : false);
  }, [isLoading, options]);

  return (
    <FormControl isInvalid={isInvalid}>
      <InputGroup>
        <Input
          value={inputValue}
          placeholder=" "
          disabled={isDisabled ?? false}
          autoComplete="off"
          onBlur={() => {
            setIsOpen(false);
            setCurrentIndex(undefined);
          }}
          onFocus={() => setCurrentIndex(typeof index === 'number' ? index : 0)}
          onChange={(e) => {
            onChange(e.target.value);
            setHasSelection(false);
            onInputChange?.(e);
            setInputValue(e.target.value);
          }}
        />
        <FormLabel color="grey.500">{label}</FormLabel>

        {showRightAction && (
          <InputRightElement
            px={2}
            top="1px"
            right="1px"
            borderRadius={10}
            bgColor="dark.200"
            h="calc(100% - 2px)"
          >
            <Icon
              as={rightAction.icon}
              fontSize="md"
              cursor="pointer"
              onClick={rightAction.handler}
            />
          </InputRightElement>
        )}
      </InputGroup>

      {isInvalid && !showResultList && (
        <FormHelperText color="error.500">{errorMessage}</FormHelperText>
      )}

      {showBottomAction && bottomAction}

      {showResultList && (
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
            {isLoading && (
              <Box p={2}>
                <Spinner color="brand.500" size="sm" />
              </Box>
            )}

            <VStack
              hidden={isLoading}
              w="full"
              maxH={180}
              overflowY="scroll"
              css={{
                '&::-webkit-scrollbar': { width: '0' },
                scrollbarWidth: 'none',
              }}
            >
              {!options.length && (
                <Text>No items found matching your search</Text>
              )}

              {options.length &&
                options.map(({ value, label }) => (
                  <Box
                    key={value}
                    onMouseDown={() => {
                      setInputValue(label);
                      setHasSelection(true);
                      onChange(value);
                      setIsOpen(false);
                    }}
                    w="full"
                    p={2}
                    borderRadius={10}
                    cursor="pointer"
                    _hover={{ background: 'dark.150' }}
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
    </FormControl>
  );
}

export { AutoComplete };
