import {
  Box,
  CircularProgress,
  Flex,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputProps,
  InputRightElement,
  keyframes,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';

import { AutocompleteOption, LineCloseIcon } from '@/components';

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

interface WebAuthnInputProps extends Omit<InputProps, 'value' | 'onChange'> {
  value?: string;
  options?: AutocompleteOption[];
  isLoading?: boolean;
  showOptions?: boolean;
  onChange: (value: string) => void;
}

const WebAuthnLoginInput = ({
  value,
  options = [],
  isLoading,
  showOptions,
  onChange,
  ...rest
}: WebAuthnInputProps) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const isOpen =
    isFocused && options && options.length > 0 && !isLoading && showOptions;
  const showClearIcon = !!value;

  return (
    <>
      <InputGroup mt="1px">
        <Input
          value={value}
          placeholder=" "
          autoComplete="off"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => onChange(e.target.value)}
          {...rest}
        />

        <FormLabel color="grey.500">Username</FormLabel>

        <InputRightElement
          pr={1}
          top="3px"
          right="1px"
          borderRadius={10}
          bgColor="dark.250"
          h="calc(100% - 6px)"
          w={10}
        >
          {isLoading ? (
            <CircularProgress
              trackColor="dark.100"
              size={18}
              isIndeterminate
              color="brand.500"
            />
          ) : (
            <>
              {showClearIcon && (
                <HStack>
                  <LineCloseIcon
                    fontSize={16}
                    color="grey.100"
                    cursor="pointer"
                    onClick={() => onChange('')}
                  />
                </HStack>
              )}
            </>
          )}
        </InputRightElement>
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
          zIndex={300}
          w="full"
          mt={2}
          sx={{
            animation: `${slideToPosition} 0.3s ease-out`,
          }}
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
              {options.map((option) => (
                <Box
                  key={option.value}
                  w="full"
                  p={2}
                  borderRadius={10}
                  cursor="pointer"
                  _hover={{ background: 'dark.150' }}
                  onMouseDown={() => onChange(option.label)}
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
            </VStack>
          </Flex>
        </Box>
      )}
    </>
  );
};

export { WebAuthnLoginInput };
