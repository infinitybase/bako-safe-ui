import {
  Box,
  Button,
  Separator,
  Field,
  
  Heading,
  HStack,
  Icon,
  
  VStack,
} from '@chakra-ui/react';
import { Address, isB256 } from 'fuels';
import { useEffect, useRef, useState } from 'react';
import {
  Controller,
  UseFieldArrayReturn,
  UseFormReturn,
} from 'react-hook-form';

import {
  Autocomplete,
  Dialog,
  RemoveIcon,
  Select,
  UserAddIcon,
} from '@/components';
import { AddToAddressBook } from '@/modules/addressBook/components';
import { CreateContactDialog } from '@/modules/addressBook/components/dialog/create';
import {
  AddressesFields,
  useAddressBookAutocompleteOptions,
  useAddressBookInputValue,
} from '@/modules/addressBook/hooks';
import { AddressUtils, ITemplatePayload } from '@/modules/core';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';
import { keepOptionsNearToInput } from '@/utils/keep-options-near-to-container';
import { scrollToBottom } from '@/utils/scroll-to-bottom';

interface AddressStepProps {
  form: UseFormReturn<ITemplatePayload>;
  addresses: UseFieldArrayReturn<ITemplatePayload, 'addresses', 'id'>;
}

const AddressStep = ({ form, addresses }: AddressStepProps) => {
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const {
    authDetails: { userInfos },
    addressBookInfos: {
      requests: { createContactRequest, listContactsRequest },
      form: contactForm,
      inView,
      canAddMember,
      workspaceId,
      dialog: { contactDialog },
      handlers: { handleOpenDialog },
    },
  } = useWorkspaceContext();
  const { setInputValue } = useAddressBookInputValue();

  const handleFirstIsFirstLoad = () => {
    if (isFirstLoad) {
      setIsFirstLoad(false);
    }
  };

  const { optionsRequests, handleFieldOptions, optionRef } =
    useAddressBookAutocompleteOptions({
      workspaceId: workspaceId!,
      includePersonal: !userInfos.onSingleWorkspace,
      contacts: listContactsRequest.data!,
      fields: form.watch('addresses') as AddressesFields,
      errors: form.formState.errors.addresses,
      isUsingTemplate: true,
      isFirstLoading: isFirstLoad,
    });

  const containerRef = useRef<HTMLDivElement>(null);
  const optionsContainerRef = useRef<HTMLDivElement>(null);

  const handleKeepOptionsNearToInput = () => {
    const pixelsToIncrement = addresses.fields.length === 2 ? 136 : 156;

    keepOptionsNearToInput({
      containerRef,
      childRef: optionsContainerRef,
      pixelsToIncrement,
    });
  };

  useEffect(() => {
    if (containerRef.current && optionsContainerRef.current) {
      handleKeepOptionsNearToInput();
    }
    window.addEventListener('resize', handleKeepOptionsNearToInput);
    window.addEventListener('scroll', handleKeepOptionsNearToInput);

    return () => {
      window.removeEventListener('resize', handleKeepOptionsNearToInput);
      window.removeEventListener('scroll', handleKeepOptionsNearToInput);
    };
  }, [
    containerRef.current,
    optionsContainerRef.current,
    addresses.fields.length,
  ]);

  return (
    <>
      <CreateContactDialog
        form={contactForm}
        dialog={contactDialog}
        isLoading={createContactRequest.isPending}
        isEdit={false}
      />

      <Box p={0}>
        <Separator borderColor="dark.100" my={9} />

        <Dialog.Section
          title={
            <Heading fontSize="md" color="grey.200">
              Vault signers
            </Heading>
          }
          description="Who is going to sign this vault?"
          mb={8}
        />

        <VStack
          gap={6}
          onClick={handleFirstIsFirstLoad}
          ref={containerRef}
          maxH={{ base: 230 }}
          pr={{ base: 2, sm: 4 }}
          overflowY="auto"
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
        >
          {addresses.fields.map(({ id }, index) => (
            <Controller
              key={id}
              name={`addresses.${index}.value`}
              render={({ field, fieldState }) => {
                const first = index === 0;
                const anotherAddress = field.value !== userInfos.address;

                const appliedOptions = handleFieldOptions(
                  field.value,
                  optionsRequests[index].options,
                  first,
                );

                const showAddToAddressBook =
                  anotherAddress &&
                  canAddMember &&
                  AddressUtils.isValid(field.value) &&
                  !fieldState.invalid &&
                  optionsRequests[index].isSuccess &&
                  listContactsRequest.data &&
                  !listContactsRequest.data
                    .map((o) => Address.fromString(o.user.address).toString())
                    .includes(
                      isB256(field.value)
                        ? Address.fromString(field.value).toString()
                        : field.value,
                    );

                return (
                  <Field.Root invalid={fieldState.invalid}>
                    <Autocomplete
                      optionsContainerRef={optionsContainerRef}
                      optionsRef={optionRef}
                      value={field.value}
                      disabled={first}
                      label={first ? 'Your address' : `Address ${index + 1}`}
                      onChange={field.onChange}
                      onInputChange={(value: string) => setInputValue(value)}
                      options={appliedOptions}
                      isLoading={!optionsRequests[index].isSuccess}
                      inView={inView}
                      clearable={false}
                      rightElement={
                        <Icon
                          as={RemoveIcon}
                          fontSize="md"
                          cursor="pointer"
                          onClick={() => {
                            if (!first) {
                              addresses.remove(index);
                            }
                          }}
                        />
                      }
                    />

                    <Field.HelperText color="error.500">
                      {fieldState.error?.message}
                    </Field.HelperText>

                    <AddToAddressBook
                      visible={showAddToAddressBook}
                      onAdd={() => {
                        handleOpenDialog?.({
                          address: field.value,
                        });
                      }}
                    />
                  </Field.Root>
                );
              }}
              control={form.control}
            />
          ))}
          <Button
            border="none"
            bgColor="dark.100"
            variant="secondary"
            minH="40px"
            w="full"
            onClick={() => {
              addresses.append({
                value: '',
              });
              setTimeout(() => scrollToBottom(containerRef), 0);
            }}
            leftIcon={<UserAddIcon />}
          >
            Add address
          </Button>
        </VStack>

        <Separator borderColor="dark.100" my={9} />

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
                <Field.Root>
                  <Select
                    pt={2}
                    pb={2}
                    value={field?.value}
                    defaultValue={1}
                    onChange={field?.onChange}
                    options={Array(addresses.fields.length)
                      .fill('')
                      .map((_, index) => ({
                        label: index + 1,
                        value: index + 1,
                      }))}
                  />

                  <Field.HelperText
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
                  </Field.HelperText>
                </Field.Root>
              )}
            />
          </Box>
        </HStack>
      </Box>
    </>
  );
};

export { AddressStep };
