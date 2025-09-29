import {
  Box,
  CircularProgress,
  ComponentWithAs,
  Flex,
  FormLabel,
  IconProps,
  InputGroup,
  InputGroupProps,
  Text,
} from '@chakra-ui/react';
import { forwardRef, memo } from 'react';

import { AddressUtils } from '@/modules';

import { AutocompleteOption } from '../basic';
import AutocompleteInput from './input';
import InputValueImage from './inputValueImage';
import AutocompleteRightElement from './rightElement';

export interface CustomAutocompleteValue extends AutocompleteOption {
  image?: ComponentWithAs<'svg', IconProps>;
}

interface AutocompleteRootProps extends InputGroupProps {
  children: React.ReactNode;
  label: string;
  isLoading?: boolean;
  inputProps?: React.ComponentProps<typeof AutocompleteInput>;
  rightElement?: React.ReactNode;
  value?: CustomAutocompleteValue;
}

const AutocompleteRoot = memo(
  forwardRef<HTMLDivElement, AutocompleteRootProps>(
    (
      { children, label, isLoading, rightElement, inputProps, value, ...rest },
      ref,
    ) => {
      return (
        <Box ref={ref} position="relative" w="full">
          <InputGroup {...rest}>
            {value?.value && (
              <AutocompleteInput as="div" minH="50px">
                <Flex w="full" gap={2} align="center">
                  <InputValueImage
                    image={value.image}
                    label={value.label || ''}
                  />
                  <Text fontSize="sm" color="section.200">
                    {value.label}{' '}
                    <Text as="span" color="section.500">
                      ({AddressUtils.format(value.value)})
                    </Text>
                  </Text>
                </Flex>
              </AutocompleteInput>
            )}
            <AutocompleteInput hidden={!!value?.value} {...inputProps} />

            <FormLabel color="grey.500">{label}</FormLabel>

            <AutocompleteRightElement>
              {isLoading ? (
                <CircularProgress
                  trackColor="dark.100"
                  position="absolute"
                  transform="translateY(-50%)"
                  top="50%"
                  size="20px"
                  isIndeterminate
                  color="brand.500"
                  right="0.5rem"
                />
              ) : (
                rightElement
              )}
            </AutocompleteRightElement>
          </InputGroup>

          {children}
        </Box>
      );
    },
  ),
);

export default AutocompleteRoot;
