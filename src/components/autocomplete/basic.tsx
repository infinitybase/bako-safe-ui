import {
  Box,
  Field,
  Flex,
  floatingStyles,
  HStack,
  Input,
  InputGroup,
  InputGroupProps,
  Loader,
  Text,
  VStack,
} from 'bako-ui';
import {
  ChangeEvent,
  ComponentProps,
  CSSProperties,
  LegacyRef,
  ReactNode,
  Ref,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { InViewHookResponse } from 'react-intersection-observer';

import { LineCloseIcon } from '../icons';

export interface AutocompleteOption {
  value: string;
  label: string;
}

interface AutocompleteProps
  extends Omit<InputGroupProps, 'onChange' | 'children'> {
  label?: string;
  ariaLabel?: string;
  value?: string;
  options?: AutocompleteOption[];
  disabled?: boolean;
  isLoading?: boolean;
  inputStyle?: CSSProperties;
  rightElement?: ReactNode;
  filterSelectedOption?: boolean;
  inView?: InViewHookResponse;
  clearable?: boolean;
  optionsRef?: LegacyRef<HTMLDivElement>;
  optionsContainerRef?: LegacyRef<HTMLDivElement>;
  onChange: (value: string) => void;
  onInputChange?: (
    value: string,
  ) => AutocompleteOption | Promise<AutocompleteOption>;
  actionOnFocus?: () => void;
  actionOnSelect?: () => void;
  actionOnRemoveInput?: () => void;
  actionOnBlur?: () => void;
  inputRef?: Ref<HTMLInputElement>;
  inputProps?: Omit<ComponentProps<typeof Input>, 'onChange' | 'value' | 'ref'>;
}

const Autocomplete = ({
  label,
  ariaLabel,
  value,
  options,
  disabled,
  isLoading,
  inputStyle,
  rightElement,
  filterSelectedOption = true,
  inView,
  clearable = true,
  onChange,
  onInputChange,
  optionsRef,
  optionsContainerRef,
  actionOnFocus = () => {},
  actionOnSelect = () => {},
  // actionOnRemoveInput = () => {},
  actionOnBlur = () => {},
  inputRef,
  inputProps,
  ...rest
}: AutocompleteProps) => {
  const [inputValue, setInputValue] = useState<string>(value ?? '');
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const displayedOptions =
    filterSelectedOption && options
      ? options.filter((o) => o.value !== value)
      : options;

  const isOpen =
    isFocused && displayedOptions && displayedOptions.length > 0 && !isLoading;

  const showClearIcon = clearable && inputValue;

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);

      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      debounceTimeout.current = setTimeout(() => {
        const replacedValue = value;

        if (!onInputChange) {
          setInputValue(replacedValue);
          onChange(replacedValue);
          return;
        }

        const result = onInputChange(replacedValue);

        if (result instanceof Promise) {
          result.then((resolvedResult) => {
            setInputValue(resolvedResult.label);
            onChange(resolvedResult.value);
          });
        } else {
          setInputValue(result.label);
          onChange(result.value);
        }
      }, 1500); // 1.5s debounce delay
    },
    [inputValue],
  );

  const handleSelect = (selectedOption: AutocompleteOption) => {
    actionOnSelect();
    setInputValue(selectedOption.label);
    onChange(selectedOption.value);
  };

  const handleFocus = () => {
    actionOnFocus();
    setIsFocused(true);
  };

  const handleClear = () => {
    onChange('');
  };

  const handleOnBlur = () => {
    actionOnBlur();
    setIsFocused(false);
  };

  const handlePaste = () => {
    setIsFocused(false);
  };

  useEffect(() => {
    if (options && options.length > 0) {
      const selectedOption = options.find((option) => option.value === value);
      if (selectedOption) {
        setInputValue(selectedOption.label);
      }
    }
  }, [value, options]);

  useEffect(() => {
    if (!value) {
      setInputValue('');
      return;
    }
  }, [value]);

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  return (
    <Field.Root position="relative">
      <InputGroup
        endElement={
          <>
            {isLoading && isFocused ? (
              <Loader
                css={{ '--spinner-track-color': 'dark.100' }}
                w={18}
                color="brand.500"
              />
            ) : (
              <HStack>
                {showClearIcon && (
                  <LineCloseIcon
                    fontSize={16}
                    color="grey.100"
                    cursor="pointer"
                    onClick={handleClear}
                  />
                )}
                {rightElement}
              </HStack>
            )}
          </>
        }
        {...rest}
      >
        <Input
          aria-label={ariaLabel ?? 'Autocomplete Input'}
          value={inputValue}
          variant="subtle"
          placeholder=" "
          disabled={disabled}
          autoComplete="off"
          rounded="8px"
          onChange={handleInputChange}
          onBlur={handleOnBlur}
          onPaste={handlePaste}
          onFocus={handleFocus}
          style={inputStyle}
          ref={inputRef}
          paddingInlineEnd={'2.2rem !important'}
          {...inputProps}
        />
      </InputGroup>
      {label && (
        <Field.Label
          color="grey.500"
          css={floatingStyles({ hasValue: !!inputValue })}
        >
          {label}
        </Field.Label>
      )}

      {isOpen && (
        <Box
          ref={optionsContainerRef}
          bg="bg.muted"
          color="gray.200"
          fontSize="md"
          borderColor="bg.panel"
          borderWidth={1}
          borderRadius="8px"
          padding={2}
          position="absolute"
          zIndex={300}
          w="full"
          top="100%"
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
                    ref={optionsRef}
                    key={option.value}
                    w="full"
                    p={2}
                    borderRadius="8px"
                    cursor="pointer"
                    _hover={{ background: 'bg.panel' }}
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
    </Field.Root>
  );
};

export { Autocomplete };
