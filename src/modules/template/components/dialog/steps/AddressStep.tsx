import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Heading,
  HStack,
  Icon,
  Select,
  TabPanel,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';

import { Autocomplete, Dialog, RemoveIcon, UserAddIcon } from '@/components';
import { AddToAddressBook } from '@/modules/addressBook/components';
import { CreateContactDialog } from '@/modules/addressBook/components/dialog/create';
import { useAddressBook } from '@/modules/addressBook/hooks';
import { useAuth } from '@/modules/auth/hooks';
import { AddressUtils, ITemplatePayload } from '@/modules/core';
import { useSteps } from '@/modules/template/hooks';

const AddressStep = ({ form }: { form: UseFormReturn<ITemplatePayload> }) => {
  const [firstRender, setFirstRender] = useState<boolean>(false);

  const { addresses } = useSteps();
  const { account, isSingleWorkspace } = useAuth();
  const {
    createContactRequest,
    search,
    form: contactForm,
    contactDialog,
    paginatedContacts,
    listContactsRequest,
    inView,
    canAddMember,
    handleOpenDialog,
    getUniquePaginatedContacts,
  } = useAddressBook(!isSingleWorkspace);

  useEffect(() => setFirstRender(true), []);

  return (
    <>
      <CreateContactDialog
        form={contactForm}
        dialog={contactDialog}
        isLoading={createContactRequest.isLoading}
        isEdit={false}
      />

      <TabPanel p={0}>
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
                const first = index === 0;
                const anotherAddress = field.value !== account;

                let options =
                  getUniquePaginatedContacts(
                    field.value,
                    form.watch('addresses') as { value: string }[],
                    form.formState.errors.addresses,
                  ) ?? [];

                if (!fieldState.isDirty && field.value) {
                  const optionsHasNoDefaultValue = options.every(
                    (o) => o.value !== field.value,
                  );

                  if (optionsHasNoDefaultValue && !firstRender) {
                    options = [
                      ...options,
                      { label: field.value, value: field.value },
                    ];
                  }
                }

                const showAddToAddressBook =
                  anotherAddress &&
                  canAddMember &&
                  !fieldState.invalid &&
                  AddressUtils.isValid(field.value) &&
                  paginatedContacts.isSuccess &&
                  listContactsRequest.data &&
                  !listContactsRequest.data
                    .map((o) => o.user.address)
                    .includes(field.value);

                return (
                  <FormControl isInvalid={fieldState.invalid}>
                    <Autocomplete
                      value={field.value}
                      label={`Address ${index + 1}`}
                      onInputChange={search.handler}
                      onChange={field.onChange}
                      isLoading={!paginatedContacts.isSuccess}
                      options={options!}
                      inView={inView}
                      rightElement={
                        <Icon
                          as={RemoveIcon}
                          fontSize="md"
                          cursor="pointer"
                          onClick={() => {
                            if (!first) {
                              addresses.remove(index);
                              form.unregister(`addresses.${index}`);
                            }
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
                        search.handler(field.value);
                      }}
                    />
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
            onClick={() => {
              addresses.append({
                value: '',
              });
            }}
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
            mb={5}
            title="Min signatures required?"
            description="Set the minimum number of signatures to approve a transfer."
          />

          <Box w="full" maxW={90} mb={3}>
            <Controller
              name="minSigners"
              control={form.control}
              render={({ field, fieldState }) => (
                <FormControl>
                  <Select
                    pt={2}
                    pb={2}
                    value={field.value}
                    defaultValue={1}
                    onChange={field.onChange}
                    placeholder=" "
                  >
                    {Array(addresses.fields.length)
                      .fill('')
                      .map((_, index) => (
                        <option key={index + 1} value={index + 1}>
                          {index + 1}
                        </option>
                      ))}
                  </Select>
                  <FormHelperText
                    color="error.500"
                    style={{
                      display: 'flex',
                      position: 'absolute',
                      left: '-309px',
                      minWidth: '400px',
                      marginBottom: '20px',
                    }}
                  >
                    {fieldState.error?.message}
                  </FormHelperText>
                </FormControl>
              )}
            />
          </Box>
        </HStack>
      </TabPanel>
    </>
  );
};

export { AddressStep };
