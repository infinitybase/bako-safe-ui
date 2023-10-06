import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  StackProps,
  TabPanel,
  Text,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import { Controller } from 'react-hook-form';
import { TbTrash as RemoveIcon } from 'react-icons/tb';

import { UserAddIcon } from '@/components';
import { UseCreateVaultReturn } from '@/modules';

export interface VaultAddressesStepProps {
  form: UseCreateVaultReturn['form'];
  addresses: UseCreateVaultReturn['addresses'];
}

export interface VaultFormFieldBoxProps extends StackProps {
  title: string;
  description: string;
}

const VaultFormFieldBox = ({
  title,
  description,
  ...stackProps
}: VaultFormFieldBoxProps) => (
  <VStack spacing={4} alignItems="flex-start" {...stackProps}>
    <Heading fontSize="md" color="grey.200">
      {title}
    </Heading>
    <Text variant="description">{description}</Text>
  </VStack>
);

const VaultAddressesStep = ({ form, addresses }: VaultAddressesStepProps) => (
  <TabPanel p={0}>
    <VaultFormFieldBox
      title="Vault signers"
      description="Who is going to sign this vault?"
      mb={8}
    />

    <VStack spacing={6}>
      {addresses.fields.map(({ id }, index) => (
        <Controller
          key={id}
          name={`addresses.${index}.value`}
          render={({ field, fieldState }) => {
            return (
              <FormControl isInvalid={fieldState.invalid}>
                <InputGroup>
                  <Input
                    value={field.value}
                    onChange={field.onChange}
                    disabled={index === 0}
                    placeholder=" "
                  />
                  <FormLabel color="gray">
                    {index === 0 ? 'Your address' : `Address ${index + 1}`}
                  </FormLabel>
                  {index > 0 && (
                    /*
                    background-color: var(--chakra-colors-dark-200);
                    right: 1px;
                    border-radius: 0px 10px 10px 0;
                    */

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
                        onClick={() => {
                          if (index > 0) {
                            addresses.remove(index);
                          }
                        }}
                      />
                    </InputRightElement>
                  )}
                </InputGroup>
                <FormHelperText>
                  <Text color="error">{fieldState.error?.message}</Text>
                </FormHelperText>
              </FormControl>
            );
          }}
          control={form.control}
        />
      ))}
      <Button
        border="none"
        bgColor="dark.100"
        variant="secondary"
        onClick={addresses.append}
        leftIcon={<UserAddIcon />}
      >
        Add address
      </Button>
    </VStack>

    <Divider borderColor="dark.100" my={9} />

    <HStack>
      <VaultFormFieldBox
        w="full"
        maxW={300}
        title="Min signatures required?"
        description="Setting Sail on a Journey to Unlock the Potential of User-Centered Design."
      />

      <Box w="full" maxW={90}>
        <Controller
          name="minSigners"
          control={form.control}
          render={({ field }) => (
            <FormControl>
              <Select
                value={field.value}
                onChange={field.onChange}
                placeholder=" "
              >
                {Array(10)
                  .fill('')
                  .map((_, index) => (
                    <option key={index + 1} value={index + 1}>
                      {index + 1}
                    </option>
                  ))}
              </Select>
            </FormControl>
          )}
        />
      </Box>
    </HStack>

    {/* TODO: Form actions component */}
    <Divider borderColor="dark.100" my={9} />
  </TabPanel>
);

export { VaultAddressesStep };
