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
import { ChangeEvent, useEffect, useState } from 'react';

interface AutoCompleteProps<T> {
  isLoading: boolean;
  isInvalid: boolean;
  options: T[];
  value?: string;
  label: string;
  isDisabled: boolean;
  errorMessage?: string;
  actionIcon?: ComponentWithAs<'svg', IconProps>;
  action?: () => void;
  onChange: () => void;
  onInputChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  fieldsToShow: (model: T) => string;
}

function AutoComplete<T>({
  isLoading,
  isInvalid,
  isDisabled,
  options,
  value,
  label,
  errorMessage,
  actionIcon,
  action,
  fieldsToShow,
  onChange,
  onInputChange,
}: AutoCompleteProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const showResultList = isOpen && !isDisabled && !isInvalid;

  useEffect(() => {
    setIsOpen(isLoading || options.length ? true : false);
  }, [isLoading, options]);

  return (
    <FormControl isInvalid={isInvalid}>
      <InputGroup>
        <Input
          {...(value ? { value: value } : {})}
          onChange={onInputChange}
          disabled={isDisabled ?? false}
          placeholder=" "
        />
        <FormLabel color="grey.500">{label}</FormLabel>

        {action && (
          <InputRightElement
            px={2}
            top="1px"
            right="1px"
            borderRadius={10}
            bgColor="dark.200"
            h="calc(100% - 2px)"
          >
            <Icon
              as={actionIcon}
              fontSize="md"
              cursor="pointer"
              onClick={action}
            />
          </InputRightElement>
        )}
      </InputGroup>

      {isInvalid && (
        <FormHelperText color="error.500">{errorMessage}</FormHelperText>
      )}

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
            {isLoading ? (
              <Spinner color="brand.500" size="sm" />
            ) : (
              <VStack
                w="full"
                maxH={180}
                overflowY="scroll"
                css={{
                  '&::-webkit-scrollbar': { width: '0' },
                  scrollbarWidth: 'none',
                }}
              >
                {!options.length ? (
                  <Text>No items found matching your search</Text>
                ) : (
                  options.map((option, index) => (
                    <Box
                      w="full"
                      p={2}
                      borderRadius={10}
                      cursor="pointer"
                      key={index}
                      onClick={() => {
                        onChange;
                        setIsOpen(false);
                      }}
                      _hover={{ background: 'dark.150' }}
                    >
                      <Text
                        whiteSpace="nowrap"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        w="full"
                      >
                        {fieldsToShow(option)}
                      </Text>
                    </Box>
                  ))
                )}
              </VStack>
            )}
          </Flex>
        </Box>
      )}
    </FormControl>
  );
}

export { AutoComplete };
