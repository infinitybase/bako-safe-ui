import {
  Badge,
  BadgeProps,
  Box,
  Flex,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputProps,
  InputRightElement,
  keyframes,
  Spinner,
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

enum AutocompleteBadgeStatus {
  SEARCHING = 0,
  SUCCESS = 1,
  ERROR = 2,
  INFO = 3,
}

interface AutocompleteBadgeProps
  extends Omit<InputProps, 'value' | 'onChange'> {
  label?: string;
  value?: string;
  options?: AutocompleteOption[];
  isLoading?: boolean;
  disabled?: boolean;
  showOptions?: boolean;
  badgeStatus?: AutocompleteBadgeStatus;
  badgeLabel?: string;
  onChange: (value: string) => void;
}

const InputBadge = (props: BadgeProps) => {
  return (
    <Badge
      border="none"
      borderRadius={4}
      h={19}
      px={2}
      fontSize="2xs"
      {...props}
    >
      {props.children}
    </Badge>
  );
};

const AutocompleteBadge = ({
  label,
  value,
  options = [],
  isLoading,
  showOptions,
  badgeStatus,
  badgeLabel,
  onChange,
  ...rest
}: AutocompleteBadgeProps) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const isOpen =
    (isFocused && options && options.length > 0 && !isLoading && showOptions) ||
    (isFocused &&
      value?.length !== undefined &&
      value.length <= 3 &&
      options &&
      options.length > 0 &&
      !isLoading);

  const showClearIcon = !!value;

  const CurrentBadge = (() => {
    switch (badgeStatus) {
      case AutocompleteBadgeStatus.SEARCHING:
        return (
          <InputBadge variant="grey">
            {badgeLabel} <Spinner w={3} h={3} />
          </InputBadge>
        );
      case AutocompleteBadgeStatus.INFO:
        return <InputBadge variant="grey">{badgeLabel}</InputBadge>;
      case AutocompleteBadgeStatus.SUCCESS:
        return <InputBadge variant="success">{badgeLabel}</InputBadge>;
      case AutocompleteBadgeStatus.ERROR:
        return <InputBadge variant="error">{badgeLabel}</InputBadge>;
      default:
        return null;
    }
  })();

  return (
    <>
      <InputGroup mt="1px">
        <Input
          variant="dark"
          value={value}
          placeholder=" "
          autoComplete="off"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => onChange(e.target.value)}
          {...rest}
        />

        <FormLabel color="grey.500">{label}</FormLabel>

        <InputRightElement
          top="3px"
          right={4}
          borderRadius={10}
          bg="grey.825"
          h="calc(100% - 6px)"
          w="fit-content"
          pl={2}
        >
          <HStack spacing={4}>
            {CurrentBadge}

            {showClearIcon && (
              <LineCloseIcon
                fontSize={16}
                color="grey.100"
                cursor="pointer"
                onClick={() => onChange('')}
              />
            )}
          </HStack>
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

export { AutocompleteBadge, AutocompleteBadgeStatus };
