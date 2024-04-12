import { Icon, PlusSquareIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Select,
  TabPanel,
  VStack,
} from '@chakra-ui/react';
import { Controller } from 'react-hook-form';

import { Autocomplete, Dialog, RemoveIcon } from '@/components';
import {
  AddToAddressBook,
  CreateContactDialog,
} from '@/modules/addressBook/components';
import {
  useAddressBook,
  useAddressBookAutocompleteOptions,
} from '@/modules/addressBook/hooks';
import { useAuth } from '@/modules/auth/hooks';
import { ITemplate } from '@/modules/core/models';
import { AddressUtils } from '@/modules/core/utils/address';
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
  const { isSingleWorkspace } = useAuth();
  const {
    handleOpenDialog,
    listContactsRequest,
    createContactRequest,
    form: contactForm,
    contactDialog,
    inView,
    workspaceId,
  } = useAddressBook(!isSingleWorkspace);
  const { optionsRequests, handleFieldOptions } =
    useAddressBookAutocompleteOptions(
      workspaceId!,
      !isSingleWorkspace,
      listContactsRequest.data,
      form.watch('addresses'),
      form.formState.errors.addresses,
    );

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
                  control={form.control}
                  render={({ field, fieldState }) => {
                    const appliedOptions = handleFieldOptions(
                      field.value,
                      optionsRequests[index].options,
                    );

                    const showAddToAddressBook =
                      !first &&
                      !fieldState.invalid &&
                      AddressUtils.isValid(field.value) &&
                      optionsRequests[index].isSuccess &&
                      listContactsRequest.data &&
                      !listContactsRequest.data
                        .map((o) => o.user.address)
                        .includes(field.value);

                    return (
                      <FormControl isInvalid={fieldState.invalid}>
                        <Autocomplete
                          label={
                            first ? 'Your address' : `Address ${index + 1}`
                          }
                          value={field.value}
                          onChange={field.onChange}
                          options={appliedOptions}
                          isLoading={!optionsRequests[index].isSuccess}
                          disabled={first}
                          inView={inView}
                          rightElement={
                            <Icon
                              as={RemoveIcon}
                              fontSize="md"
                              cursor="pointer"
                              onClick={() => {
                                const minSigners = form.getValues('minSigners');
                                const addressesLength =
                                  addresses.fields.length - 1;
                                if (Number(minSigners) > addressesLength) {
                                  form.setValue(
                                    'minSigners',
                                    String(addressesLength),
                                  );
                                }
                                addresses.remove(index);
                              }}
                            />
                          }
                        />

                        <FormHelperText color="error.500">
                          {fieldState.error?.message}
                        </FormHelperText>

                        <AddToAddressBook
                          visible={showAddToAddressBook}
                          onAdd={() => {
                            handleOpenDialog?.({
                              address: field.value,
                            });
                          }}
                        />
                      </FormControl>
                    );
                  }}
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
                  {Array(addresses.fields.length)
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
