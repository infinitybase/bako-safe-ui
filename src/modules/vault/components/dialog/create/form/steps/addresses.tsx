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
import { ITemplate, UseCreateVaultReturn } from '@/modules';

export interface VaultAddressesStepProps {
  form: UseCreateVaultReturn['form'];
  addresses: UseCreateVaultReturn['addresses'];
  templates: ITemplate[];
  setTemplate: UseCreateVaultReturn['setFormWithTemplate'];
}

const VaultAddressesStep = ({
  form,
  addresses,
  templates,
  setTemplate,
}: VaultAddressesStepProps) => (
  <TabPanel p={0}>
    <Dialog.Section
      hidden={!templates.length}
      title={
        <Heading fontSize="lg" color="grey.200">
          Vault rules
        </Heading>
      }
      description="What is the rule of the vault?"
      mb={8}
    />

    <Divider hidden={!templates.length} borderColor="dark.100" mt={5} mb={9} />

    <Box hidden={!templates.length} w="100%">
      <FormControl>
        <Select
          placeholder=" "
          onChange={(item) => setTemplate(item.target.value)}
        >
          {templates.length > 0 &&
            templates?.map((item: ITemplate) => {
              return (
                <option value={item.id} key={item.id}>
                  {item.name}
                </option>
              );
            })}
        </Select>
        <FormLabel>Do you want to use a template?</FormLabel>
        <FormHelperText>
          You can make your work easier by following a rule that {`you've`} set
          up.
        </FormHelperText>
      </FormControl>
    </Box>

    <Divider hidden={!templates.length} borderColor="dark.100" my={9} />

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
        title={
          <Heading fontSize="md" color="grey.200">
            Min signatures required?
          </Heading>
        }
        description="Set the minimum number of signatures to approve a transfer."
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
