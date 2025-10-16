import { Box, Button, Field, Heading, HStack, Icon, VStack } from 'bako-ui';
import { AddressUtils as BakoAddressUtils } from 'bakosafe';
import { Address, isB256, isEvmAddress } from 'fuels';
import { useRef, useState } from 'react';
import { Controller } from 'react-hook-form';
import { FiPlusSquare as PlusSquareIcon } from 'react-icons/fi';

import { Autocomplete, Dialog, RemoveIcon, Select } from '@/components';
import {
  AddToAddressBook,
  CreateContactDialog,
} from '@/modules/addressBook/components';
import {
  AddressesFields,
  useAddressBookAutocompleteOptions,
} from '@/modules/addressBook/hooks';
import { useBakoIDClient } from '@/modules/core/hooks/bako-id';
import { ITemplate } from '@/modules/core/models';
import { AddressUtils } from '@/modules/core/utils/address';
import CreateVaultWarning from '@/modules/vault/components/CreateVaultWarning';
import { UseCreateVaultReturn } from '@/modules/vault/hooks/create/useCreateVault';
import { useWorkspaceContext } from '@/modules/workspace/hooks';
import { AddressBookUtils } from '@/utils';
import { scrollToBottom } from '@/utils/scroll-to-bottom';

export interface VaultAddressesStepProps {
  form: UseCreateVaultReturn['form'];
  addresses: UseCreateVaultReturn['addresses'];
  templates: ITemplate[];
  selectedTemplate: UseCreateVaultReturn['selectedTemplate'];
  setTemplate: UseCreateVaultReturn['setFormWithTemplate'];
  validateAddress: UseCreateVaultReturn['validateAddress'];
}

const VaultAddressesStep = (props: VaultAddressesStepProps) => {
  const { form, addresses, validateAddress } = props;

  const {
    authDetails: { userInfos },
    addressBookInfos: {
      handlers: { handleOpenDialog },
      dialog: { contactDialog },
      requests: { listContactsRequest, createContactRequest },
      form: contactForm,
      inView,
      workspaceId,
    },
    providerInstance,
  } = useWorkspaceContext();

  const {
    handlers: { fetchResolverName, fetchResolveAddress },
  } = useBakoIDClient(providerInstance);

  const hasTwoOrMoreAddresses =
    form.watch('addresses') && form.watch('addresses')!.length >= 2;

  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [currentInputIndex, setCurrentInputIndex] = useState<
    number | undefined
  >(undefined);

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
      dynamicCurrentIndex: currentInputIndex,
    });

  const optionsScrollableContainerRef = useRef<HTMLDivElement>(null);

  const hasOneAddress = addresses.fields.length === 1;
  const hasTenAddress = addresses.fields.length >= 10;

  const isDisable =
    (!!form.formState.errors.addresses ||
      validateAddress.isLoading ||
      hasTenAddress) &&
    !hasOneAddress;

  const lastAddressIndex = addresses.fields.length;

  const minSigners = form.formState.errors.minSigners?.message;

  return (
    <>
      <CreateContactDialog
        form={contactForm}
        dialog={contactDialog}
        isLoading={createContactRequest.isPending}
        isEdit={false}
      />

      <Box p={0} maxH={500}>
        <VStack
          w="full"
          overflowY="scroll"
          aria-label="Scroll vault form"
          css={{
            '&::-webkit-scrollbar': {
              display: 'none',
              width: '5px',
              maxHeight: '330px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#2C2C2C',
              borderRadius: '30px',
              height: '10px',
            },
          }}
          onWheel={(e) => {
            e.stopPropagation();
          }}
          h={{ base: '60vh', sm: 500 }}
        >
          <CreateVaultWarning
            mb={2}
            message="Please ensure that all signer addresses are valid and accessible wallet
        addresses on the Fuel Network. Addresses from other Bako Safe Vaults and
        wallets from other networks cannot be used as signers."
          />

          <Dialog.Section
            w="full"
            p={4}
            borderRadius="xl"
            border="1px solid"
            borderColor="grey.925"
            bgColor="transparent"
            title={
              <Heading fontSize="sm" color="grey.200">
                Vault signers
              </Heading>
            }
            description="Who is going to sign this vault?"
            descriptionFontSize="sm"
          >
            <VStack
              mt={4}
              w="full"
              gap={2}
              minH={120}
              position="relative"
              onClick={() => {
                handleFirstIsFirstLoad();
              }}
              ref={optionsScrollableContainerRef}
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
                        optionsRequests[index]?.options ?? [],
                        first,
                      );

                      if (index && !fieldState.invalid && field.value) {
                        validateAddress.handler(field.value, index);
                      }

                      const isLoading =
                        !optionsRequests[index].isSuccess ||
                        validateAddress.isLoading;

                      const showAddToAddressBook =
                        !first &&
                        !fieldState.invalid &&
                        AddressUtils.isValid(field.value) &&
                        optionsRequests[index].isSuccess &&
                        listContactsRequest.data &&
                        !listContactsRequest.data
                          .map((o) =>
                            Address.fromString(o.user.address).toString(),
                          )
                          .includes(
                            isB256(field.value)
                              ? Address.fromString(field.value).toString()
                              : field.value,
                          );

                      return (
                        <Field.Root
                          invalid={fieldState.invalid}
                          id={`Address ${index + 1}`}
                        >
                          <Autocomplete
                            label={
                              first ? 'Your address' : `Address ${index + 1}`
                            }
                            actionOnFocus={() => {
                              if (index !== lastAddressIndex) {
                                setCurrentInputIndex(index);
                              }
                            }}
                            // variant="dark"
                            optionsRef={optionRef}
                            value={field.value}
                            onChange={field.onChange}
                            onInputChange={async (value: string) => {
                              const result = { value: value, label: value };

                              if (value.startsWith('@')) {
                                const address =
                                  await fetchResolveAddress.handler(
                                    value.split(' - ').at(0)!,
                                  );
                                if (address) {
                                  result.value = address;
                                  result.label =
                                    AddressBookUtils.formatForAutocomplete(
                                      value,
                                      address,
                                    );
                                }
                              }

                              if (
                                value.startsWith('eth:') ||
                                isEvmAddress(value)
                              ) {
                                const address = value.replaceAll('eth:', '');
                                if (isEvmAddress(address)) {
                                  result.value = new Address(address).toB256();
                                  result.label = address.toLowerCase();
                                }
                              }

                              if (isB256(value)) {
                                const name =
                                  await fetchResolverName.handler(value);
                                if (name) {
                                  result.label =
                                    AddressBookUtils.formatForAutocomplete(
                                      name,
                                      value,
                                    );
                                }
                                result.value = new Address(value).toB256();
                              }

                              return result;
                            }}
                            options={appliedOptions}
                            isLoading={isLoading}
                            disabled={first}
                            inView={inView}
                            clearable={false}
                            rightElement={
                              <Icon
                                as={RemoveIcon}
                                fontSize="md"
                                cursor="pointer"
                                onClick={() => {
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
                              let _address = field.value;

                              if (BakoAddressUtils.isEvm(_address)) {
                                _address =
                                  'eth:' +
                                  BakoAddressUtils.parseFuelAddressToEth(
                                    _address,
                                  );
                              }

                              handleOpenDialog?.({
                                address: _address,
                              });
                            }}
                          />
                        </Field.Root>
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
                colorPalette="secondary"
                mt="auto"
                disabled={isDisable}
                aria-label={'Add more addresses vault form'}
                onClick={() => {
                  addresses.append();
                  setTimeout(
                    () => scrollToBottom(optionsScrollableContainerRef),
                    0,
                  );
                }}
                _hover={{
                  opacity: 0.8,
                }}
              >
                <Icon as={PlusSquareIcon} w={5} h={5} />
                Add more addresses
              </Button>
            </VStack>
          </Dialog.Section>

          <HStack
            position="relative"
            mt={{ base: 2, sm: 8 }}
            border="1px solid"
            borderColor="grey.925"
            borderRadius="xl"
            py={{ base: 2, sm: 4 }}
            px={4}
            mb={{ base: 12, sm: 4 }}
          >
            <Dialog.Section
              w="full"
              maxW={350}
              mb={{ base: 0, sm: 5 }}
              title={
                <Heading fontSize="sm" color="grey.200">
                  Min signatures required?
                </Heading>
              }
              description="Set the minimum number of signatures to approve a transfer."
              descriptionFontSize="sm"
            />

            <Controller
              name="minSigners"
              control={form.control}
              render={({ field }) => (
                <Field.Root position="relative" maxW={'full'} w="24">
                  <Select
                    aria-label={'Select min signatures vault form'}
                    needShowOptionsAbove={hasTwoOrMoreAddresses}
                    style={{
                      background: '#201F1D',
                    }}
                    value={Number(field.value)}
                    onChange={field.onChange}
                    options={Array(addresses.fields.length)
                      .fill('')
                      .map((_, index) => ({
                        label: index + 1,
                        value: index + 1,
                      }))}
                  />
                </Field.Root>
              )}
            />
          </HStack>
          <Field.Root>
            <Field.HelperText
              color="error.500"
              maxW={{ base: 'full', sm: 'full' }}
              minW={{ base: '300', sm: 'full' }}
            >
              {minSigners}
            </Field.HelperText>
          </Field.Root>
        </VStack>
      </Box>
    </>
  );
};

export { VaultAddressesStep };
