import {
  Box,
  Button,
  createListCollection,
  Field,
  Heading,
  HStack,
  Icon,
  Select,
  Stack,
  Text,
  VStack,
} from 'bako-ui';
import { AddressUtils as BakoAddressUtils } from 'bakosafe';
import { Address, isB256, isEvmAddress } from 'fuels';
import { useMemo, useRef, useState } from 'react';
import { Controller } from 'react-hook-form';

import { Autocomplete, CloseCircle } from '@/components';
import { Plus2Icon } from '@/components/icons/plus2';
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
import { UseCreateVaultReturn } from '@/modules/vault/hooks/create/useCreateVault';
import { useWorkspaceContext } from '@/modules/workspace/hooks';
import { AddressBookUtils } from '@/utils';
import { scrollToBottom } from '@/utils/scroll-to-bottom';

import { MyAccountSignerCard } from './myAccountSignerCard';

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

  const isDisabled =
    (!!form.formState.errors.addresses ||
      validateAddress.isLoading ||
      hasTenAddress) &&
    !hasOneAddress;

  const lastAddressIndex = addresses.fields.length;

  const minSigners = form.formState.errors.minSigners?.message;

  const signaturesOptions = useMemo(
    () => Array.from({ length: addresses.fields.length || 1 }, (_, i) => i + 1),
    [addresses.fields.length],
  );

  const signaturesCollection = createListCollection({
    items: signaturesOptions || [],
    itemToString: (item) => item.toString(),
    itemToValue: (item) => item.toString(),
  });

  return (
    <>
      <CreateContactDialog
        form={contactForm}
        dialog={contactDialog}
        isLoading={createContactRequest.isPending}
        isEdit={false}
      />

      <Box p={0} h="full">
        <VStack
          w="full"
          aria-label="Scroll vault form"
          justifyContent="space-between"
          h="full"
        >
          <VStack
            mt={4}
            w="full"
            gap={2}
            overflowY="scroll"
            flex={1}
            onClick={() => {
              handleFirstIsFirstLoad();
            }}
            ref={optionsScrollableContainerRef}
            css={{
              '&::-webkit-scrollbar': {
                display: 'none',
              },
            }}
            onWheel={(e) => {
              e.stopPropagation();
            }}
            h={{ base: '60vh', sm: 500 }}
          >
            {addresses.fields.map(({ id }, index) => {
              const first = index === 0;

              if (first) {
                return (
                  <Controller
                    key={id}
                    name={`addresses.${index}.value`}
                    control={form.control}
                    render={({ field }) => {
                      return (
                        <MyAccountSignerCard
                          address={field.value!}
                          providerInstance={providerInstance}
                        />
                      );
                    }}
                  />
                );
              }

              return (
                <Controller
                  key={id}
                  name={`addresses.${index}.value`}
                  control={form.control}
                  render={({ field, fieldState }) => {
                    const appliedOptions = handleFieldOptions(
                      field.value || '',
                      optionsRequests[index]?.options ?? [],
                      first,
                    );

                    if (index && !fieldState.invalid && field.value) {
                      validateAddress.handler(field.value, index);
                    }

                    const isLoading =
                      !optionsRequests[index].isSuccess ||
                      validateAddress.isLoading;
                    const value = field.value || '';

                    const showAddToAddressBook =
                      !fieldState.invalid &&
                      AddressUtils.isValid(value) &&
                      optionsRequests[index].isSuccess &&
                      listContactsRequest.data &&
                      !listContactsRequest.data
                        .map((o) =>
                          Address.fromString(o.user.address).toString(),
                        )
                        .includes(
                          isB256(value)
                            ? Address.fromString(value).toString()
                            : value,
                        );

                    return (
                      <Field.Root
                        invalid={fieldState.invalid}
                        id={`Address ${index + 1}`}
                        gap={0}
                      >
                        <Autocomplete
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
                              const address = await fetchResolveAddress.handler(
                                value.split(' - ').at(0)!,
                              );
                              if (address) {
                                // address without checksum
                                // is required to validate if it's not a vault address
                                result.value = new Address(address).toB256();

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
                              as={CloseCircle}
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
                          inputProps={{
                            placeholder: `Address ${index + 1}`,
                            _focusVisible: {
                              border: '0px solid',
                              borderLeft: '2px solid',
                              borderLeftColor: 'textPrimary',
                              bg: 'gray.550',
                              outline: 'none',
                            },
                            _hover: {
                              bg: 'gray.550',
                              borderLeft: '2px solid',
                              borderLeftColor: 'textPrimary',
                            },
                            transition: 'all 0.3s',
                          }}
                        />

                        <Field.HelperText color="red.500" mt={1}>
                          {fieldState.error?.message}
                        </Field.HelperText>

                        <AddToAddressBook
                          visible={showAddToAddressBook}
                          onAdd={() => {
                            let _address = field.value || '';

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
              w="full"
              variant="subtle"
              bg="bg.muted"
              disabled={isDisabled}
              onClick={() => {
                addresses.append();
                setTimeout(
                  () => scrollToBottom(optionsScrollableContainerRef),
                  0,
                );
              }}
              _hover={{
                bg: 'gray.550',
              }}
            >
              <Icon as={Plus2Icon} color="textSecondary" w={5} h={5} />
              Add more addresses
            </Button>
          </VStack>

          <HStack w="full" justifyContent="space-between" pb={6}>
            <Stack gap={3} maxW="275px">
              <Heading fontSize="xs" color="textPrimary" lineHeight="shorter">
                Minimum signatures required
              </Heading>
              <Text fontSize="xs" color="gray.400" lineHeight="shorter">
                Set the minimum number of signatures to approve any transfer in
                this vault.
              </Text>
            </Stack>

            <Controller
              name="minSigners"
              control={form.control}
              defaultValue="1"
              render={({ field }) => (
                <Select.Root
                  w="98px"
                  variant="subtle"
                  rounded="lg"
                  // positioning={{ strategy: 'fixed' }}
                  collection={signaturesCollection}
                  aria-label={'Select min signatures vault form'}
                  value={[field.value ?? '']}
                  onValueChange={(e) => field.onChange(e.value[0].toString())}
                >
                  <Select.HiddenSelect />

                  <Select.Control>
                    <Select.Trigger px={6}>
                      <Select.ValueText color="gray.50" />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>
                  <Select.Positioner>
                    <Select.Content>
                      {signaturesOptions.map((index) => (
                        <Select.Item item={index} key={index}>
                          {index}
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Select.Root>
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
