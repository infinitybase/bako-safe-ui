import { Icon } from '@chakra-ui/icons';
import {
  Box,
  BoxProps,
  Flex,
  Image,
  Stack,
  Text,
  TextProps,
  VStack,
} from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { UNKNOWN_ASSET } from '@/modules';

import { ArrowDownIcon } from '../icons';

interface AssetSelectOption {
  value: string;
  image: string | null;
  name: string;
  symbol: string | null;
}

interface BoxSelectProps extends BoxProps {}

interface AssetSelectProps {
  value?: string;
  options?: AssetSelectOption[];
  label?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  isInvalid?: boolean;
  name?: string;
  onChange: (value: string) => void;
  needShowOptionsAbove?: boolean;
  maxOptionsHeight?: number;
  boxProps?: BoxSelectProps;
  textLabelProps?: TextProps;
  textValueProps?: TextProps;
}

const AssetSelect = ({
  value,
  options,
  label,
  isLoading,
  isDisabled,
  onChange,
  isInvalid,
  needShowOptionsAbove,
  maxOptionsHeight,
  name,
  boxProps,
  textLabelProps,
  textValueProps,
}: AssetSelectProps) => {
  const selectRef = useRef<HTMLDivElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [focusedOptionIndex, setFocusedOptionIndex] = useState<number>(-1);
  const [optionsCoords, setOptionsCoords] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  const selectedOption = useMemo(
    () => options?.find((option) => option.value === value),
    [options, value],
  );
  const isReadyToShowOptions =
    showOptions && options && options.length > 0 && !isLoading;

  const handleSelectOption = (selectedValue: string) => {
    onChange(selectedValue);
    setShowOptions(false);
    setFocusedOptionIndex(-1);
    selectRef.current?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (isDisabled || isLoading) return;

    const availableOptions = options || [];

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!showOptions) {
          setShowOptions(true);
          calculateOptionsCoords();
        } else if (
          focusedOptionIndex >= 0 &&
          availableOptions[focusedOptionIndex]
        ) {
          handleSelectOption(availableOptions[focusedOptionIndex].value);
        }
        break;

      case 'Escape':
        event.preventDefault();
        if (showOptions) {
          setShowOptions(false);
          setFocusedOptionIndex(-1);
        }
        break;

      case 'ArrowDown':
        event.preventDefault();
        if (!showOptions) {
          setShowOptions(true);
          calculateOptionsCoords();
          setFocusedOptionIndex(0);
        } else {
          setFocusedOptionIndex((prev) =>
            prev < availableOptions.length - 1 ? prev + 1 : 0,
          );
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (!showOptions) {
          setShowOptions(true);
          calculateOptionsCoords();
          setFocusedOptionIndex(availableOptions.length - 1);
        } else {
          setFocusedOptionIndex((prev) =>
            prev > 0 ? prev - 1 : availableOptions.length - 1,
          );
        }
        break;

      case 'Tab':
        if (showOptions) {
          setShowOptions(false);
          setFocusedOptionIndex(-1);
        }
        break;

      default:
        break;
    }
  };

  const calculateOptionsCoords = useCallback(() => {
    if (!selectRef.current || !options) return;

    const rect = selectRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    const OPTION_HEIGHT = 56;
    const PADDING = 8;
    const actualOptionsHeight = Math.min(
      options.length * OPTION_HEIGHT + PADDING * 2,
      maxOptionsHeight ?? 207,
    );

    const shouldShowAbove =
      needShowOptionsAbove ??
      (rect.bottom + actualOptionsHeight > windowHeight &&
        rect.top > actualOptionsHeight);

    const minusTop = 5;
    const top = shouldShowAbove
      ? rect.top - actualOptionsHeight - PADDING
      : rect.bottom + PADDING - minusTop;

    console.log('>>>> top', top);
    setOptionsCoords({
      top: top,
      left: rect.left,
      width: rect.width,
      height: actualOptionsHeight + 5,
    });
  }, [needShowOptionsAbove, maxOptionsHeight, options]);

  useEffect(() => {
    if (showOptions) {
      const handleScrollResize = () => {
        calculateOptionsCoords();
      };

      window.addEventListener('scroll', handleScrollResize, true);
      window.addEventListener('resize', handleScrollResize);

      return () => {
        window.removeEventListener('scroll', handleScrollResize, true);
        window.removeEventListener('resize', handleScrollResize);
      };
    }
  }, [showOptions, calculateOptionsCoords]);

  const handleToggleOptions = () => {
    if (isDisabled || isLoading) return;
    if (!showOptions) {
      setShowOptions(true);
      setFocusedOptionIndex(-1);
      calculateOptionsCoords();
    } else {
      setShowOptions(false);
      setFocusedOptionIndex(-1);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (!selectRef.current?.contains(event.target as Node)) {
      setShowOptions(false);
      setFocusedOptionIndex(-1);
    }
  };

  useEffect(() => {
    setFocusedOptionIndex(-1);
  }, [options]);

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

  return (
    <Box w="full" position="relative">
      <input
        ref={hiddenInputRef}
        type="hidden"
        name={name}
        value={value || ''}
        tabIndex={-1}
        aria-hidden="true"
      />

      <Box
        ref={selectRef}
        position="relative"
        w="full"
        h="50px"
        px={5}
        py={3}
        bg="grey.825"
        border="1px solid"
        borderColor={isInvalid ? 'error.600' : 'grey.800'}
        borderRadius={10}
        cursor={isDisabled ? 'not-allowed' : 'pointer'}
        onClick={handleToggleOptions}
        onKeyDown={handleKeyDown}
        opacity={isDisabled ? 0.4 : 1}
        _hover={!isDisabled ? { borderColor: 'grey.400' } : {}}
        _focus={{
          outline: 'none',
          borderColor: 'grey.200',
          boxShadow:
            '0 0 0 1px color-mix(in srgb, var(--chakra-colors-brand-500) 100%, transparent)',
        }}
        tabIndex={isDisabled ? -1 : 0}
        role="combobox"
        aria-expanded={showOptions}
        aria-haspopup="listbox"
        aria-label={label || 'Select an asset'}
        aria-invalid={isInvalid}
        aria-describedby={isInvalid ? `${name}-error` : undefined}
        {...boxProps}
      >
        {label && (
          <Text
            fontSize="md"
            position="absolute"
            top={selectedOption ? 1 : '50%'}
            transform={
              selectedOption
                ? 'translateY(-2px) scale(0.7)'
                : 'translateY(-50%)'
            }
            transition="all 0.2s"
            left={selectedOption ? 3.5 : 5}
            color="grey.400"
            mb={1}
            fontWeight="medium"
            lineHeight="1"
            {...textLabelProps}
          >
            {label}
          </Text>
        )}

        {selectedOption && (
          <Flex align="center" justify="space-between">
            <Flex align="center" gap={2} flex={1} pt={label ? 2 : 0}>
              <Image
                src={selectedOption.image ?? ''}
                boxSize={6}
                rounded="md"
                flexShrink={0}
              />
              <Text
                fontSize="sm"
                color="grey.200"
                flex={1}
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
                {...textValueProps}
              >
                {selectedOption.name}
              </Text>
            </Flex>
          </Flex>
        )}

        {!selectedOption && !isLoading && (
          <Icon
            as={ArrowDownIcon}
            fontSize={10}
            color="grey.200"
            transition="transform 0.2s"
            position="absolute"
            top="50%"
            right={4}
            transform={
              showOptions
                ? 'translateY(-50%) rotate(180deg)'
                : 'translateY(-50%)'
            }
          />
        )}
      </Box>

      {isReadyToShowOptions && optionsCoords && (
        <Box
          position="fixed"
          aria-expanded={showOptions}
          role="listbox"
          top={`${optionsCoords.top}px`}
          left={`${optionsCoords.left}px`}
          w={optionsCoords.width}
          h={optionsCoords.height}
          bg="dark.200"
          color="grey.200"
          fontSize="md"
          borderColor="dark.100"
          borderWidth={1}
          borderRadius={10}
          zIndex={9999}
          boxShadow="lg"
          overflow="hidden"
        >
          <VStack
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            w="full"
            h="full"
            maxH={optionsCoords.height}
            gap={0}
            overflowY="auto"
            css={{
              '&::-webkit-scrollbar': { width: '4px' },
              '&::-webkit-scrollbar-track': { background: 'transparent' },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '2px',
              },
              scrollbarWidth: 'thin',
            }}
            p={1}
          >
            {options.map(
              ({ value: optionValue, image, name, symbol }, index) => (
                <Box
                  key={optionValue}
                  w="full"
                  px={3}
                  py={2}
                  borderRadius={8}
                  cursor="pointer"
                  bg={focusedOptionIndex === index ? 'dark.150' : 'transparent'}
                  _hover={{ background: 'dark.150' }}
                  onMouseDown={() => handleSelectOption(optionValue)}
                  onMouseEnter={() => setFocusedOptionIndex(index)}
                  display="flex"
                  alignItems="center"
                  gap={3}
                  transition="background 0.15s"
                  role="option"
                  aria-selected={value === optionValue}
                  id={`option-${index}`}
                >
                  <Image
                    src={image ?? ''}
                    fallbackSrc={UNKNOWN_ASSET.icon}
                    fallbackStrategy="onError"
                    boxSize={8}
                    rounded={'lg'}
                    flexShrink={0}
                  />
                  <Stack gap={0} flex={1} minW={0}>
                    <Text
                      whiteSpace="nowrap"
                      overflow="hidden"
                      textOverflow="ellipsis"
                      fontSize="md"
                    >
                      {name}
                    </Text>
                    {symbol && (
                      <Text
                        fontSize="sm"
                        color="grey.400"
                        whiteSpace="nowrap"
                        overflow="hidden"
                        textOverflow="ellipsis"
                      >
                        {symbol}
                      </Text>
                    )}
                  </Stack>
                </Box>
              ),
            )}
          </VStack>
        </Box>
      )}
    </Box>
  );
};

export { AssetSelect, AssetSelectOption, AssetSelectProps };
