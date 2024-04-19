import { PlusSquareIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Heading,
  HStack,
  Link,
  TabPanel,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Controller } from 'react-hook-form';

import { Dialog, RemoveIcon, Select } from '@/components';
import { AutoComplete } from '@/components/autocomplete';
import { CreateContactDialog } from '@/modules/addressBook/components';
import { useAddressBook } from '@/modules/addressBook/hooks/useAddressBook';
import { useAuth } from '@/modules/auth/hooks';
import { ITemplate } from '@/modules/core/models';
import { UseCreateVaultReturn } from '@/modules/vault/hooks/create/useCreateVault';

export interface VaultAddressesStepProps {
  form: UseCreateVaultReturn['form'];
  addresses: UseCreateVaultReturn['addresses'];
  templates: ITemplate[];
  selectedTemplate: UseCreateVaultReturn['selectedTemplate'];
  setTemplate: UseCreateVaultReturn['setFormWithTemplate'];
}

const VaultAddressesStep = ({
  form,
  addresses,
  templates,
  selectedTemplate,
  setTemplate,
}: VaultAddressesStepProps) => {
  const { isSingleWorkspace } = useAuth();
  const {
    handleOpenDialog,
    paginatedContacts,
    createContactRequest,
    search,
    form: contactForm,
    contactDialog,
    inView,
  } = useAddressBook(!isSingleWorkspace);

  const minSigners = form.formState.errors.minSigners?.message;

  return (
    <>
      <CreateContactDialog
        form={contactForm}
        dialog={contactDialog}
        isLoading={createContactRequest.isLoading}
        isEdit={false}
      />

      <TabPanel p={0}>
        <Box
          p={4}
          mb={8}
          borderRadius="xl"
          bgColor="dark.600"
          hidden={!templates.length}
          w="100%"
        >
          <FormControl>
            <Select
              label="Do you want to use a template?"
              value={selectedTemplate}
              onChange={(value) => setTemplate(value)}
              isDisabled={!templates.length}
              options={templates?.map((template) => ({
                label: template.name,
                value: template.id,
              }))}
            />
            <FormHelperText color="grey.450">
              You can make your work easier by following a rule that {`you've`}{' '}
              set up.
            </FormHelperText>
          </FormControl>
        </Box>

        <Dialog.Section
          p={4}
          mb={8}
          borderRadius="xl"
          bgColor="dark.600"
          title={
            <Heading fontSize="md" color="grey.200">
              Vault signers
            </Heading>
          }
          description="Who is going to sign this vault?"
        >
          <VStack mt={4} w="full" spacing={6}>
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
                          index={index}
                          label={
                            first ? 'Your address' : `Address ${index + 1}`
                          }
                          isInvalid={fieldState.invalid}
                          isDisabled={first}
                          onInputChange={search.handler}
                          onChange={(selected) => field.onChange(selected)}
                          errorMessage={fieldState.error?.message}
                          isLoading={!paginatedContacts.isSuccess}
                          inView={inView}
                          options={paginatedContacts.data!}
                          rightAction={{
                            ...(first
                              ? {}
                              : {
                                  icon: RemoveIcon!,
                                  handler: () => {
                                    const minSigners =
                                      form.getValues('minSigners');
                                    const addressesLength =
                                      addresses.fields.length - 1;
                                    if (Number(minSigners) > addressesLength) {
                                      form.setValue(
                                        'minSigners',
                                        String(addressesLength),
                                      );
                                    }
                                    addresses.remove(index);
                                  },
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
                                      handleOpenDialog?.({
                                        address: field.value,
                                      })
                                    }
                                  >
                                    add this
                                  </Link>{' '}
                                  address in your address book?
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
              w="full"
              border="none"
              color="dark.300"
              bgColor="grey.200"
              variant="secondary"
              onClick={() => {
                addresses.append();
                form.setValue(
                  'minSigners',
                  String(addresses.fields.length + 1),
                );
              }}
              leftIcon={<PlusSquareIcon w={5} h={5} />}
              _hover={{
                opacity: 0.8,
              }}
            >
              Add more address
            </Button>
          </VStack>
        </Dialog.Section>

        <HStack position="relative" mt="12">
          <Dialog.Section
            w="full"
            maxW={350}
            mb={5}
            title={
              <Heading fontSize={{ base: 'sm', sm: 'md' }} color="grey.200">
                Min signatures required?
              </Heading>
            }
            description="Set the minimum number of signatures to approve a transfer."
          />

          <Controller
            name="minSigners"
            control={form.control}
            render={({ field }) => (
              <FormControl position="relative" maxW={'full'} w="24">
                <Select
                  value={Number(field.value)}
                  onChange={field.onChange}
                  options={Array(addresses.fields.length)
                    .fill('')
                    .map((_, index) => ({
                      label: index + 1,
                      value: index + 1,
                    }))}
                />
              </FormControl>
            )}
          />
        </HStack>
        <FormControl>
          <FormHelperText
            color="error.500"
            maxW={{ base: 'full', sm: 'full' }}
            minW={{ base: '300', sm: 'full' }}
          >
            {minSigners}
          </FormHelperText>
        </FormControl>
      </TabPanel>
    </>
  );
};

export { VaultAddressesStep };
