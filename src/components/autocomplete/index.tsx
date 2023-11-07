import {
  Box,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { ChangeEvent, useEffect, useState } from 'react';

import { AddressBook } from '@/modules/core/models/addressBook';

import { RemoveIcon } from '../icons';

interface AutoCompleteProps {
  isLoading: boolean;
  isInvalid: boolean;
  index: number;
  options: AddressBook[];
  value?: string;
  errorMessage?: string;
  onChange: () => void;
  onRemove: () => void;
  onInputChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

const AutoComplete = ({
  index,
  isLoading,
  isInvalid,
  onChange,
  options,
  onInputChange,
  onRemove,
  value,
  errorMessage,
}: AutoCompleteProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const showResultList = isOpen && index > 0 && !isInvalid;

  useEffect(() => {
    if (isLoading || options.length) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [isLoading, options]);

  return (
    <FormControl isInvalid={isInvalid}>
      <InputGroup>
        <Input
          {...(value ? { value: value } : {})}
          // onChange={onChange}
          onChange={onInputChange}
          // onChange={(e) => console.log(`>>>>>`, e.target.value)}
          disabled={index === 0}
          placeholder=" "
        />
        <FormLabel color="grey.500">
          {index === 0 ? 'Your address' : `Address ${index + 1}`}
        </FormLabel>
        {index > 0 && (
          <InputRightElement
            px={2}
            top="1px"
            right="1px"
            borderRadius={10}
            bgColor="dark.200"
            h="calc(100% - 2px)"
          >
            <Icon
              as={RemoveIcon}
              fontSize="md"
              cursor="pointer"
              onClick={onRemove}
            />
          </InputRightElement>
        )}
      </InputGroup>

      <FormHelperText color="error.500">{errorMessage}</FormHelperText>

      {showResultList && (
        <Box
          bg="dark.200"
          color="grey.200"
          fontSize="md"
          borderColor="dark.100"
          borderWidth={1}
          borderRadius={10}
          padding={2}
          mt={2}
          w="full"
          zIndex={200}
          position="absolute"
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
                {options.map((option, index) => (
                  <Box
                    key={index}
                    w="full"
                    p={2}
                    borderRadius={10}
                    cursor="pointer"
                    onClick={onChange}
                    _hover={{ background: 'dark.150' }}
                  >
                    <Text
                      whiteSpace="nowrap"
                      overflow="hidden"
                      textOverflow="ellipsis"
                      // noOfLines={2}
                      w="full"
                    >{`${option.nickname} - ${option.user.address}`}</Text>
                  </Box>
                ))}
              </VStack>
            )}
          </Flex>
        </Box>
      )}
    </FormControl>
  );
};

export { AutoComplete };
