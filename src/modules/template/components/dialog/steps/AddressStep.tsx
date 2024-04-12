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
import {
  Controller,
  UseFieldArrayReturn,
  UseFormReturn,
} from 'react-hook-form';

import { Autocomplete, Dialog, RemoveIcon, UserAddIcon } from '@/components';
import { AddToAddressBook } from '@/modules/addressBook/components';
import { CreateContactDialog } from '@/modules/addressBook/components/dialog/create';
import {
  AddressesFields,
  useAddressBook,
  useAddressBookAutocompleteOptions,
} from '@/modules/addressBook/hooks';
import { useAuth } from '@/modules/auth/hooks';
import { AddressUtils, ITemplatePayload } from '@/modules/core';

interface AddressStepProps {
  form: UseFormReturn<ITemplatePayload>;
  addresses: UseFieldArrayReturn<ITemplatePayload, 'addresses', 'id'>;
}

const AddressStep = ({ form, addresses }: AddressStepProps) => {
  const { account, isSingleWorkspace } = useAuth();
  const {
    createContactRequest,
    form: contactForm,
    contactDialog,
    paginatedContacts,
    listContactsRequest,
    inView,
    canAddMember,
    workspaceId,
    handleOpenDialog,
  } = useAddressBook(!isSingleWorkspace);
  const { options, handleFieldOptions } = useAddressBookAutocompleteOptions(
    workspaceId!,
    !isSingleWorkspace,
    listContactsRequest.data,
    form.watch('addresses') as AddressesFields,
    form.formState.errors.addresses,
  );

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

                const appliedOptions = handleFieldOptions(
                  field.value,
                  options[index],
                );

                const showAddToAddressBook =
                  anotherAddress &&
                  canAddMember &&
                  AddressUtils.isValid(field.value) &&
                  !fieldState.invalid &&
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
                      onChange={field.onChange}
                      options={appliedOptions}
                      inView={inView}
                      rightElement={
                        <Icon
                          as={RemoveIcon}
                          fontSize="md"
                          cursor="pointer"
                          onClick={() => {
                            if (!first) {
                              addresses.remove(index);
                              form.trigger();
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
              form.trigger();
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
