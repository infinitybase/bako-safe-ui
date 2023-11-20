import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Link,
  Select,
  TabPanel,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Controller } from 'react-hook-form';

import { Dialog, RemoveIcon, UserAddIcon } from '@/components';
import { AutoComplete } from '@/components/autocomplete';
import { AddressUtils, ITemplate, UseCreateVaultReturn } from '@/modules';
import { CreateContactDialog } from '@/modules/addressBook/components';
import { useAddressBook } from '@/modules/addressBook/hooks/';

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
}: VaultAddressesStepProps) => {
  const {
    handleOpenDialog,
    findContactsRequest,
    createContactRequest,
    search,
    form: contactForm,
    contactDialog,
  } = useAddressBook();

  return (
    <>
      <CreateContactDialog
        form={contactForm}
        dialog={contactDialog}
        isLoading={createContactRequest.isLoading}
        isEdit={false}
      />

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

        <Divider
          hidden={!templates.length}
          borderColor="dark.100"
          mt={5}
          mb={9}
        />

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
              You can make your work easier by following a rule that {`you've`}{' '}
              set up.
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
          {addresses.fields.map(({ id }, index) => {
            const first = index === 0;

            return (
              <Controller
                key={id}
                name={`addresses.${index}.value`}
                render={({ field, fieldState }) => {
                  return (
                    <>
                      <AutoComplete
                        value={field.value}
                        label={first ? 'Your address' : `Address ${index + 1}`}
                        isInvalid={fieldState.invalid}
                        isDisabled={first}
                        onChange={(selected) => {
                          field.onChange(selected);
                          findContactsRequest.reset();
                        }}
                        onInputChange={search.handler}
                        errorMessage={fieldState.error?.message}
                        isLoading={findContactsRequest.isLoading}
                        options={
                          findContactsRequest?.data?.map((contact) => ({
                            value: contact.user.address,
                            label: `${contact.nickname} - ${AddressUtils.format(
                              contact.user.address,
                            )}`,
                          })) ?? []
                        }
                        rightAction={{
                          ...(first
                            ? {}
                            : {
                                icon: RemoveIcon!,
                                handler: () => addresses.remove(index),
                              }),
                        }}
                        bottomAction={
                          first ? undefined : (
                            <Box mt={2}>
                              <Text color="grey.200" fontSize={12}>
                                Do you wanna{' '}
                                <Link
                                  color="brand.500"
                                  onClick={() =>
                                    handleOpenDialog?.({ address: field.value })
                                  }
                                >
                                  add
                                </Link>{' '}
                                this address in your address book?
                              </Text>
                            </Box>
                          )
                        }
                      />
                    </>
                  );
                }}
                control={form.control}
              />
            );
          })}

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
    </>
  );
};

export { VaultAddressesStep };
