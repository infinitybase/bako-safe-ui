import { PlusSquareIcon } from '@chakra-ui/icons';
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

import { Dialog, RemoveIcon } from '@/components';
import { AutoComplete } from '@/components/autocomplete';
import { CreateContactDialog } from '@/modules/addressBook/components';
import { useAddressBook } from '@/modules/addressBook/hooks/useAddressBook';
import { ITemplate } from '@/modules/core/models';
import { UseCreateVaultReturn } from '@/modules/vault/hooks/create/useCreateVault';

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
    paginatedContacts,
    createContactRequest,
    search,
    form: contactForm,
    contactDialog,
    inView,
    canAddMember,
  } = useAddressBook();

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
              placeholder=" "
              defaultValue=""
              isDisabled={!templates.length}
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

        <Divider borderColor="dark.100" my={9} />

        <HStack position="relative">
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
                  pt={2}
                  pb={2}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder=" "
                  cursor="pointer"
                  _hover={{
                    opacity: 0.8,
                  }}
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
        </HStack>
        <FormControl>
          <FormHelperText
            color="error.500"
            maxW={['full', 'full']}
            minW={['300', 'full']}
          >
            {minSigners}
          </FormHelperText>
        </FormControl>
      </TabPanel>
    </>
  );
};

export { VaultAddressesStep };
