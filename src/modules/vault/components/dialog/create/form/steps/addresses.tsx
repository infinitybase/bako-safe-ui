import { PlusSquareIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Heading,
  HStack,
  Icon,
  TabPanel,
  VStack,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { Controller } from 'react-hook-form';

import { Autocomplete, Dialog, RemoveIcon, Select } from '@/components';
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
    listContactsRequest,
    createContactRequest,
    form: contactForm,
    contactDialog,
    inView,
    workspaceId,
  } = useAddressBook(!isSingleWorkspace);

  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const handleFirstIsFirstLoad = () => {
    if (isFirstLoad) {
      setIsFirstLoad(false);
    }
  };

  const { optionsRequests, handleFieldOptions, optionRef } =
    useAddressBookAutocompleteOptions(
      workspaceId!,
      !isSingleWorkspace,
      listContactsRequest.data,
      form.watch('addresses'),
      form.formState.errors.addresses,
      true,
      isFirstLoad,
    );

  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    const container = containerRef.current;

    if (container) {
      container.scroll({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    }
  };
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
              isCreatingValue
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
          <VStack
            onClick={handleFirstIsFirstLoad}
            mt={4}
            w="full"
            spacing={2}
            overflowY="auto"
            maxH={{ base: 230 }}
            pr={{ base: 2, sm: 4 }}
            sx={{
              '&::-webkit-scrollbar': {
                width: '5px',
                maxHeight: '330px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#2C2C2C',
                borderRadius: '30px',
                height: '10px' /* Adjust the height of the scrollbar thumb */,
              },
            }}
            ref={containerRef}
          >
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
                      first,
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
                          optionsRef={optionRef}
                          value={field.value}
                          onChange={field.onChange}
                          options={appliedOptions}
                          isLoading={!optionsRequests[index].isSuccess}
                          disabled={first}
                          inView={inView}
                          clearable={false}
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
              minH={10}
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
                setTimeout(scrollToBottom, 0);
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
