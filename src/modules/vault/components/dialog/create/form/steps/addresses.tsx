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
  TabPanel,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import { Controller } from 'react-hook-form';
import { TbTrash as RemoveIcon } from 'react-icons/tb';

import { Dialog, UserAddIcon } from '@/components';
import { UseCreateVaultReturn } from '@/modules';

export interface VaultAddressesStepProps {
  form: UseCreateVaultReturn['form'];
  addresses: UseCreateVaultReturn['addresses'];
}

const VaultAddressesStep = ({ form, addresses }: VaultAddressesStepProps) => (
  <TabPanel p={0}>
    <Dialog.Section
      title={
        <Heading fontSize="lg" color="grey.200">
          Vault rules
        </Heading>
      }
      description="Who is going to sign this vault?"
      mb={8}
    />

    <Divider borderColor="dark.100" mt={5} mb={9} />

    <Box w="100%">
      <FormControl>
        <Select placeholder=" ">
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </Select>
        <FormLabel>Do you want to use a template?</FormLabel>
        <FormHelperText>
          You can make your work easier by following a rule that {`you've`} set
          up.
        </FormHelperText>
      </FormControl>
    </Box>

    <Divider borderColor="dark.100" my={9} />

    <Dialog.Section
      title={
        <Heading fontSize="md" color="grey.200">
          Vault signers
        </Heading>
      }
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
                        onClick={() => {
                          if (index > 0) {
                            addresses.remove(index);
                          }
                        }}
                      />
                    </InputRightElement>
                  )}
                </InputGroup>
                <FormHelperText color="error.500">
                  {fieldState.error?.message}
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
      <Dialog.Section
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
                pt={2}
                pb={2}
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
  </TabPanel>
);

export { VaultAddressesStep };
