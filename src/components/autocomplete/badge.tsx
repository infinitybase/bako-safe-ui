import {
  Badge,
  BadgeProps,
  Box,
  Field,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputProps,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
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
          <InputBadge colorPalette="grey">
            {badgeLabel} <Spinner w={3} h={3} />
          </InputBadge>
        );
      case AutocompleteBadgeStatus.INFO:
        return <InputBadge colorPalette="grey">{badgeLabel}</InputBadge>;
      case AutocompleteBadgeStatus.SUCCESS:
        return <InputBadge colorPalette="success">{badgeLabel}</InputBadge>;
      case AutocompleteBadgeStatus.ERROR:
        return <InputBadge colorPalette="error">{badgeLabel}</InputBadge>;
      default:
        return null;
    }
  })();

  return (
    <Field.Root>
      <InputGroup
        mt="1px"
        endElement={
          <HStack gap={4}>
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
        }
      >
        <Input
          colorPalette="dark"
          value={value}
          placeholder=" "
          autoComplete="off"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => onChange(e.target.value)}
          {...rest}
        />
      </InputGroup>
      <Field.Label color="grey.500">{label}</Field.Label>

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
          css={{
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
    </Field.Root>
  );
};

export { AutocompleteBadge, AutocompleteBadgeStatus };
