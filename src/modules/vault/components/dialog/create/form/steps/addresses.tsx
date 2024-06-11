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
import { useRef, useState } from 'react';
import { Controller } from 'react-hook-form';

import { Autocomplete, Dialog, RemoveIcon, Select } from '@/components';
import {
  AddToAddressBook,
  CreateContactDialog,
} from '@/modules/addressBook/components';
import {
  AddressesFields,
  useAddressBook,
  useAddressBookAutocompleteOptions,
} from '@/modules/addressBook/hooks';
import { useAuth } from '@/modules/auth/hooks';
import { ITemplate } from '@/modules/core/models';
import { AddressUtils } from '@/modules/core/utils/address';
import { UseCreateVaultReturn } from '@/modules/vault/hooks/create/useCreateVault';
// import { useVaultState } from '@/modules/vault/states';
import { scrollToBottom } from '@/utils/scroll-to-bottom';

export interface VaultAddressesStepProps {
  form: UseCreateVaultReturn['form'];
  addresses: UseCreateVaultReturn['addresses'];
  templates: ITemplate[];
  selectedTemplate: UseCreateVaultReturn['selectedTemplate'];
  setTemplate: UseCreateVaultReturn['setFormWithTemplate'];
}
// templates,
// setTemplate,
// selectedTemplate,

const VaultAddressesStep = ({ form, addresses }: VaultAddressesStepProps) => {
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
  const [currentInputIndex, setCurrentInputIndex] = useState<
    number | undefined
  >(undefined);
  // const { disableScroll, setDisableScroll } = useVaultState();

  const handleFirstIsFirstLoad = () => {
    if (isFirstLoad) {
      setIsFirstLoad(false);
    }
  };

  const { optionsRequests, handleFieldOptions, optionRef } =
    useAddressBookAutocompleteOptions({
      workspaceId: workspaceId!,
      includePersonal: !isSingleWorkspace,
      contacts: listContactsRequest.data!,
      fields: form.watch('addresses') as AddressesFields,
      errors: form.formState.errors.addresses,
      isUsingTemplate: true,
      isFirstLoading: isFirstLoad,
      dynamicCurrentIndex: currentInputIndex,
    });

  // const inputRef = useRef<HTMLInputElement[]>([]);
  // const optionsContainerRef = useRef<HTMLDivElement>(null);
  const optionsScrollableContainerRef = useRef<HTMLDivElement>(null);

  // const handleSelectOption = () => {
  //   form.clearErrors();
  //   setIsFirstLoad(true);
  // };

  const isDisable = !!form.formState.errors.addresses;
  const lastAddressIndex = addresses.fields.length;

  // const handleKeepOptionsNearToInput = (index: number) => {
  //   console.log('index no keep', index);
  //   const pixelsToIncrement = 50;

  //   keepOptionsNearToInput({
  //     containerRef: inputRef,
  //     childRef: optionsContainerRef,
  //     pixelsToIncrement,
  //     index,
  //   });
  // };

  const minSigners = form.formState.errors.minSigners?.message;

  const hasTenAddress = addresses.fields.length >= 10;

  // useEffect(() => {
  //   handleKeepOptionsNearToInput(currentInputIndex ?? 0);
  //   if (currentInputIndex !== undefined) {
  //     setCurrentInputIndex(undefined);
  //   }
  // }, [lastAddressIndex]);

  return (
    <>
      <CreateContactDialog
        form={contactForm}
        dialog={contactDialog}
        isLoading={createContactRequest.isLoading}
        isEdit={false}
      />

      <TabPanel p={0}>
        {/* <Box
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
              callbackOnSelectOption={() => handleSelectOption()}
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
        </Box> */}

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
          pr={{ base: 2, sm: 4 }}
          h={485}
          // mb={8}
        >
          <Dialog.Section
            w="full"
            p={4}
            // mb={8}
            // borderRadius="xl"
            borderRadius="xl"
            border="1px solid"
            borderColor="grey.925"
            // bgColor="dark.600"
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
              minH={260}
              position="relative"
              // maxH={{ base: 230 }}
              onClick={() => {
                handleFirstIsFirstLoad();
              }}
              // overflowY={disableScroll ? 'hidden' : 'auto'}
              // sx={{
              //   '&::-webkit-scrollbar': {
              //     width: '5px',
              //     maxHeight: '330px',
              //   },
              //   '&::-webkit-scrollbar-thumb': {
              //     backgroundColor: '#2C2C2C',
              //     borderRadius: '30px',
              //     height: '10px',
              //   },
              // }}
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

                      const isLoading = !optionsRequests[index].isSuccess;

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
                            isFromTransactions
                            label={
                              first ? 'Your address' : `Address ${index + 1}`
                            }
                            // inputRef={(el) => (inputRef.current[index] = el!)}
                            onClick={() => {
                              // handleKeepOptionsNearToInput(index);
                              setCurrentInputIndex(index);
                              // setTimeout(
                              // () => setCurrentInputIndex(index),
                              // 100,
                              // );
                            }}
                            // actionOnSelect={() => setDisableScroll(false)}
                            // actionOnRemoveInput={() => setDisableScroll(false)}
                            // actionOnBlur={() => setDisableScroll(false)}
                            actionOnFocus={() => {
                              // setDisableScroll(true);
                              if (index !== lastAddressIndex) {
                                setCurrentInputIndex(index);
                              }
                            }}
                            // // to keep the options relative to the container when typing in the input
                            // onKeyUp={() =>
                            //   setTimeout(
                            //     () => handleKeepOptionsNearToInput(index),
                            //     100,
                            //   )
                            // }
                            // optionsContainerRef={optionsContainerRef}
                            optionsRef={optionRef}
                            value={field.value}
                            onChange={field.onChange}
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
                isDisabled={isDisable || hasTenAddress}
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
                Add more address
              </Button>
            </VStack>
          </Dialog.Section>

          <HStack position="relative" mt="12">
            <Dialog.Section
              w="full"
              maxW={350}
              mb={{ base: 5, sm: 'unset' }}
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
