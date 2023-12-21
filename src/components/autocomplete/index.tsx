import {
  Box,
  CircularProgress,
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
  Text,
  VStack,
} from '@chakra-ui/react';
import { ChangeEvent, ReactNode, useEffect, useState } from 'react';
import { InViewHookResponse } from 'react-intersection-observer';

import { AddressBook, AddressUtils } from '@/modules';

interface RightAction {
  icon?: ComponentWithAs<'svg', IconProps>;
  handler?: () => void;
}

interface AutoCompleteProps {
  isLoading: boolean;
  isFetching: boolean;
  isInvalid: boolean;
  options: AddressBook[];
  value?: string;
  label: string;
  isDisabled: boolean;
  errorMessage?: string;
  rightAction?: RightAction;
  bottomAction?: ReactNode;
  index?: number;
  inView: InViewHookResponse;
  selected?: string[];
  onChange: (value: string) => void;
  onInputChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

function AutoComplete({
  isLoading,
  isFetching,
  isInvalid,
  isDisabled,
  options,
  value,
  label,
  errorMessage,
  rightAction,
  bottomAction,
  selected,
  index,
  inView,
  onChange,
  onInputChange,
}: AutoCompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value ?? '');
  const [currentIndex, setCurrentIndex] = useState<number>();

  const isContact = (value: string) =>
    value.includes('-') || value.includes('...');

  const optionsList = options
    ?.filter(({ user }) => !selected?.includes(user.address))
    ?.map(({ user, nickname }) => ({
      value: user.address,
      label: `${nickname} - ${AddressUtils.format(user.address)}`,
    }));

  const showOptionsList = isOpen && currentIndex === index;

  console.log(`🚀`, isOpen, currentIndex === index);

  const showBottomAction =
    bottomAction &&
    !isContact(inputValue) &&
    !isInvalid &&
    !showOptionsList &&
    inputValue.length > 0 &&
    AddressUtils.isValid(inputValue);

  useEffect(() => {
    setIsOpen(options.length ? true : false);
  }, [isLoading, options]);

  return (
    <FormControl isInvalid={isInvalid}>
      <InputGroup>
        <Input
          value={inputValue}
          placeholder=" "
          disabled={isDisabled || false}
          autoComplete="off"
          onBlur={() => {
            setIsOpen(false);
            setCurrentIndex(undefined);
            // setEnabled(false)
          }}
          onFocus={() => {
            setCurrentIndex(typeof index === 'number' ? index : 0);
            // setEnabled(true)
          }}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(false);
            onInputChange?.(e);
            setInputValue(e.target.value);
          }}
        />
        <FormLabel color="grey.500">{label}</FormLabel>

        {!!rightAction?.handler && (
          <InputRightElement
            px={3}
            top="1px"
            right="1px"
            borderRadius={10}
            bgColor="dark.200"
            h="calc(100% - 2px)"
          >
            {isFetching || isLoading ? (
              <CircularProgress
                trackColor="dark.100"
                size={18}
                isIndeterminate
                color="brand.500"
              />
            ) : (
              <Icon
                as={rightAction.icon}
                fontSize="md"
                cursor="pointer"
                onClick={rightAction.handler}
              />
            )}
          </InputRightElement>
        )}
      </InputGroup>

      {isInvalid && !showOptionsList && (
        <FormHelperText color="error.500">{errorMessage}</FormHelperText>
      )}

      {/* ACTION THAT CAN DYNAMICALLY APPEARS BELOW THE INPUT */}
      {showBottomAction && bottomAction}

      {showOptionsList && (
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
              hidden={isLoading}
              w="full"
              maxH={180}
              overflowY="scroll"
              css={{
                '&::-webkit-scrollbar': { width: '0' },
                scrollbarWidth: 'none',
              }}
            >
              {optionsList.length > 0 &&
                optionsList.map(({ value, label }) => (
                  <Box
                    key={value}
                    w="full"
                    p={2}
                    borderRadius={10}
                    cursor="pointer"
                    _hover={{ background: 'dark.150' }}
                    onMouseDown={() => {
                      setInputValue(label);
                      onChange(value);
                      setIsOpen(false);
                    }}
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
              <Box ref={inView.ref} />
            </VStack>
          </Flex>
        </Box>
      )}
    </FormControl>
  );
}

export { AutoComplete };
