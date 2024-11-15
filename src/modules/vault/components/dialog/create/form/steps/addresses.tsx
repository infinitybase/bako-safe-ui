import { PlusSquareIcon } from '@chakra-ui/icons';
import {
  Button,
  FormControl,
  FormHelperText,
  Heading,
  HStack,
  Icon,
  TabPanel,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { Controller } from 'react-hook-form';

import { Autocomplete, Dialog, RemoveIcon, Select } from '@/components';
import { queryClient } from '@/config/query-client';
import {
  AddToAddressBook,
  CreateContactDialog,
} from '@/modules/addressBook/components';
import {
  AddressesFields,
  useAddressBookAutocompleteOptions,
  useAddressBookInputValue,
} from '@/modules/addressBook/hooks';
import { OFF_CHAIN_SYNC_DATA_QUERY_KEY } from '@/modules/core/hooks/bako-id';
import { ITemplate } from '@/modules/core/models';
import { AddressUtils } from '@/modules/core/utils/address';
import CreateVaultWarning from '@/modules/vault/components/CreateVaultWarning';
import { UseCreateVaultReturn } from '@/modules/vault/hooks/create/useCreateVault';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';
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
  } = useWorkspaceContext();
  const { setInputValue } = useAddressBookInputValue();

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

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: [OFF_CHAIN_SYNC_DATA_QUERY_KEY],
    });
  }, []);

  return (
    <>
      <CreateContactDialog
        form={contactForm}
        dialog={contactDialog}
        isLoading={createContactRequest.isPending}
        isEdit={false}
      />

      <TabPanel p={0} maxH={500}>
        <VStack
          w="full"
          overflowY="scroll"
          sx={{
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
          h={{ base: '60vh', xs: 500 }}
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
              spacing={2}
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
                        optionsRequests[index].options,
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
                          .map((o) => o.user.address)
                          .includes(field.value);

                      return (
                        <FormControl
                          isInvalid={fieldState.invalid}
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
                            variant="dark"
                            optionsRef={optionRef}
                            value={field.value}
                            onChange={field.onChange}
                            onInputChange={(value: string) =>
                              setInputValue(value)
                            }
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
                mt="auto"
                isDisabled={isDisable}
                onClick={() => {
                  addresses.append();
                  form.setValue(
                    'minSigners',
                    String(addresses.fields.length + 1),
                  );
                  setTimeout(
                    () => scrollToBottom(optionsScrollableContainerRef),
                    0,
                  );
                }}
                leftIcon={<PlusSquareIcon w={5} h={5} />}
                _hover={{
                  opacity: 0.8,
                }}
              >
                Add more addresses
              </Button>
            </VStack>
          </Dialog.Section>

          <HStack
            position="relative"
            mt={{ base: 2, xs: 8 }}
            border="1px solid"
            borderColor="grey.925"
            borderRadius="xl"
            py={{ base: 2, xs: 4 }}
            px={4}
            mb={{ base: 12, xs: 4 }}
          >
            <Dialog.Section
              w="full"
              maxW={350}
              mb={{ base: 0, xs: 5, sm: 'unset' }}
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
                <FormControl position="relative" maxW={'full'} w="24">
                  <Select
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
        </VStack>
      </TabPanel>
    </>
  );
};

export { VaultAddressesStep };
