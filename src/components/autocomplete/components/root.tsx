import {
  Box,
  Flex,
  IconProps,
  InputGroup,
  InputGroupProps,
  Loader,
  Text,
} from 'bako-ui';
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
  placeholder?: string;
  isLoading?: boolean;
  inputProps?: React.ComponentProps<typeof AutocompleteInput>;
  rightElement?: React.ReactNode;
  value?: CustomAutocompleteValue;
}

const AutocompleteRoot = memo(
  forwardRef<HTMLDivElement, AutocompleteRootProps>(
    (
      {
        children,
        isLoading,
        rightElement,
        inputProps,
        value,
        placeholder,
        ...rest
      },
      ref,
    ) => {
      return (
        <Box ref={ref} position="relative" w="full">
          <InputGroup
            endElement={
              <>
                {isLoading ? (
                  <Loader size="sm" color="primary.main" />
                ) : (
                  rightElement
                )}
              </>
            }
            {...rest}
          >
            <>
              {value?.value && (
                <Flex
                  w="full"
                  gap={2}
                  pl={3}
                  align="center"
                  bg="gray.550"
                  h="40px"
                  rounded="sm"
                  pr={isLoading || rightElement ? '40px' : 'unset'}
                >
                  <InputValueImage
                    image={value.image}
                    label={value.label || ''}
                  />
                  <Text
                    fontSize="sm"
                    color="textPrimary"
                    lineHeight="shorter"
                    overflow="hidden"
                    whiteSpace="nowrap"
                  >
                    {value.label}{' '}
                    <Text as="span" color="textSecondary" lineHeight="shorter">
                      ({AddressUtils.format(value.value)})
                    </Text>
                  </Text>
                </Flex>
              )}
              <AutocompleteInput
                hidden={!!value?.value}
                {...inputProps}
                placeholder={placeholder}
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
