import {
  Box,
  Flex,
  IconProps,
  InputGroup,
  InputGroupProps,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { forwardRef, ForwardRefExoticComponent, memo } from 'react';

import { AddressUtils } from '@/modules';

import { AutocompleteOption } from '../basic';
import AutocompleteInput from './input';
import InputValueImage from './inputValueImage';

export interface CustomAutocompleteValue extends AutocompleteOption {
  image?: ForwardRefExoticComponent<
    IconProps & React.RefAttributes<SVGSVGElement>
  >;
}

interface AutocompleteRootProps extends Omit<InputGroupProps, 'children'> {
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
          <InputGroup
            endElement={
              <>
                {isLoading ? (
                  <Spinner
                    position="absolute"
                    transform="translateY(-50%)"
                    top="50%"
                    size="sm"
                    color="brand.500"
                    right="0.5rem"
                  />
                ) : (
                  rightElement
                )}
              </>
            }
            {...rest}
          >
            <>
              {value?.value && (
                // <AutocompleteInput as="div" minH="50px">
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
                // </AutocompleteInput>
              )}
              <AutocompleteInput
                hidden={!!value?.value}
                {...inputProps}
                placeholder={label}
              />
            </>
          </InputGroup>

          {children}
        </Box>
      );
    },
  ),
);

export default AutocompleteRoot;
