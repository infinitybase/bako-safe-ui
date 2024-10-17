import {
  Accordion,
  AccordionItem,
  Button,
  Center,
  CircularProgress,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Controller } from 'react-hook-form';

import { AmountInput, Autocomplete, UserAddIcon } from '@/components';
import {
  AddToAddressBook,
  CreateContactDialog,
  useAddressBookAutocompleteOptions,
} from '@/modules/addressBook';
import {
  AddressUtils,
  AssetSelect,
  delay,
  NativeAssetId,
} from '@/modules/core';
import { UseCreateTransaction } from '@/modules/transactions/hooks';
import { UseVaultDetailsReturn } from '@/modules/vault';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { TransactionAccordion } from './accordion';

interface TransactionAccordionProps {
  form: UseCreateTransaction['form'];
  nicks: UseCreateTransaction['nicks'];
  assets: UseVaultDetailsReturn['assets'];
  accordion: UseCreateTransaction['accordion'];
  transactions: UseCreateTransaction['transactionsFields'];
  isFeeCalcLoading: boolean;
  getBalanceAvailable: UseCreateTransaction['getBalanceAvailable'];
}

interface TransctionFormFieldProps {
  form: UseCreateTransaction['form'];
  index: number;
  assets: UseVaultDetailsReturn['assets'];
  isFeeCalcLoading: boolean;
  getBalanceAvailable: UseCreateTransaction['getBalanceAvailable'];
}

const TransactionFormField = (props: TransctionFormFieldProps) => {
  const { form, assets, index, isFeeCalcLoading, getBalanceAvailable } = props;

  const {
    authDetails: { userInfos },
    addressBookInfos: {
      workspaceId,
      dialog: { contactDialog },
      handlers: { handleOpenDialog },
      requests: { listContactsRequest, createContactRequest },
      form: contactForm,
      inView,
      canAddMember,
    },
    vaultDetails: {
      assets: { isNFTAsset },
    },
  } = useWorkspaceContext();

  const balanceAvailable = getBalanceAvailable();

  const { optionsRequests, handleFieldOptions, optionRef } =
    useAddressBookAutocompleteOptions({
      workspaceId: workspaceId!,
      includePersonal: !userInfos.onSingleWorkspace,
      contacts: listContactsRequest.data!,
      fields: form.watch('transactions')!,
      errors: form.formState.errors.transactions,
      isUsingTemplate: false,
      isFirstLoading: false,
      dynamicCurrentIndex: index,
      canRepeatAddresses: true,
    });

  const asset = form.watch(`transactions.${index}.asset`);
  const isNFT = isNFTAsset(asset);

  return (
    <>
      <CreateContactDialog
        form={contactForm}
        dialog={contactDialog}
        isLoading={createContactRequest.isPending}
        isEdit={false}
      />
      <VStack spacing={5}>
        <Controller
          name={`transactions.${index}.value`}
          control={form.control}
          render={({ field, fieldState }) => {
            const appliedOptions = handleFieldOptions(
              field.value,
              optionsRequests[index].options,
              !!field.value,
            );

            const showAddToAddressBook =
              canAddMember &&
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
                  value={field.value}
                  label={`Recipient ${index + 1} address`}
                  onChange={field.onChange}
                  isLoading={!optionsRequests[index].isSuccess}
                  options={appliedOptions}
                  inView={inView}
                  clearable={false}
                  optionsRef={optionRef}
                  variant="dark"
                />
                <FormHelperText color="error.500">
                  {fieldState.error?.message}
                </FormHelperText>
                <AddToAddressBook
                  visible={showAddToAddressBook}
                  onAdd={() => handleOpenDialog?.({ address: field.value })}
                />
              </FormControl>
            );
          }}
        />
        <Controller
          name={`transactions.${index}.asset`}
          control={form.control}
          render={({ field, fieldState }) => (
            <AssetSelect
              isInvalid={fieldState.invalid}
              assets={assets!.assets!}
              nfts={assets!.nfts!}
              name={`transaction.${index}.asset`}
              value={field.value}
              onChange={(e) => {
                field.onChange(e);
                if (isNFTAsset(e)) {
                  form.setValue(`transactions.${index}.amount`, '1');
                }
              }}
              helperText={
                <FormHelperText
                  color={fieldState.invalid ? 'error.500' : 'grey.200'}
                >
                  {fieldState.error?.message ??
                    'Select the asset you want to send'}
                </FormHelperText>
              }
            />
          )}
        />
        <Controller
          name={`transactions.${index}.amount`}
          control={form.control}
          render={({ field, fieldState }) => {
            return (
              <FormControl>
                <AmountInput
                  placeholder=" "
                  value={isNFT ? '1' : field.value}
                  onChange={field.onChange}
                  isInvalid={fieldState.invalid}
                  isDisabled={isNFT}
                />
                <FormLabel color="gray">Amount</FormLabel>
                <FormHelperText>
                  {asset && (
                    <Text display="flex" alignItems="center">
                      Balance (available):{' '}
                      {isFeeCalcLoading ? (
                        <CircularProgress
                          trackColor="dark.100"
                          size={3}
                          isIndeterminate
                          color="brand.500"
                          ml={1}
                        />
                      ) : (
                        <>
                          {assets.getAssetInfo(asset)?.slug} {balanceAvailable}
                        </>
                      )}
                    </Text>
                  )}
                </FormHelperText>
                <FormHelperText color="error.500">
                  {fieldState.error?.message}
                </FormHelperText>
              </FormControl>
            );
          }}
        />
      </VStack>
    </>
  );
};

const TransactionAccordions = (props: TransactionAccordionProps) => {
  const {
    form,
    transactions,
    assets,
    accordion,
    nicks,
    isFeeCalcLoading,
    getBalanceAvailable,
  } = props;

  const {
    screenSizes: { isMobile },
  } = useWorkspaceContext();

  // Logic to fix the button in the footer
  // const accordionHeight = () => {
  //   if (isMobile && isLargerThan900) return 500;
  //   if (isMobile && isLargerThan768) return 400;
  //   if (isMobile && isLargerThan660) return 220;
  //   if (isMobile && isLargerThan600) return 200;

  //   return 450;
  // };

  return (
    <Accordion
      index={accordion.index}
      overflowY="auto"
      pb={isMobile ? 10 : 0}
      // maxH={accordionHeight()}
      maxH={450}
      pr={{ base: 1, sm: 0 }}
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
      {transactions.fields.map((field, index) => {
        const transaction = form.watch(`transactions.${index}`);
        const assetSlug = assets.getAssetInfo(transaction.asset)?.slug;
        const fieldState = form.getFieldState(`transactions.${index}`);

        const hasEmptyField = Object.values(transaction).some(
          (value) => value === '',
        );

        const currentAmount = form.watch(`transactions.${index}.amount`);
        const isCurrentAmountZero = Number(currentAmount) === 0;

        const isDisabled =
          hasEmptyField || fieldState.invalid || isCurrentAmountZero;
        const contact = nicks.find(
          (nick) => nick.user.address === transaction.value,
        );

        return (
          <>
            <AccordionItem
              key={field.id}
              mb={6}
              borderWidth={1}
              borderColor="grey.925"
              borderRadius={10}
              backgroundColor="dark.950"
            >
              <TransactionAccordion.Item
                title={`Recipient ${index + 1}`}
                actions={
                  <TransactionAccordion.Actions>
                    <HStack spacing={4}>
                      <TransactionAccordion.EditAction
                        onClick={() => accordion.open(index)}
                      />
                      <TransactionAccordion.DeleteAction
                        isDisabled={props.transactions.fields.length === 1}
                        onClick={() => {
                          transactions.remove(index);
                          accordion.close();
                        }}
                      />
                    </HStack>
                    <TransactionAccordion.ConfirmAction
                      onClick={() => accordion.close()}
                      isDisabled={isDisabled}
                      isLoading={
                        !isCurrentAmountZero ? isFeeCalcLoading : false
                      }
                    />
                  </TransactionAccordion.Actions>
                }
                resume={
                  !hasEmptyField && (
                    <Text fontSize="sm" color="grey.500" mt={2}>
                      <b>
                        {transaction.amount} {assetSlug}
                      </b>{' '}
                      to{' '}
                      <b>
                        {' '}
                        {contact?.nickname ??
                          AddressUtils.format(transaction.value)}
                      </b>
                    </Text>
                  )
                }
              >
                <TransactionFormField
                  index={index}
                  form={form}
                  assets={assets}
                  isFeeCalcLoading={isFeeCalcLoading}
                  getBalanceAvailable={getBalanceAvailable}
                />
              </TransactionAccordion.Item>
            </AccordionItem>
          </>
        );
      })}
      <Center mt={6}>
        <Button
          w="full"
          leftIcon={<UserAddIcon />}
          variant="primary"
          bgColor="grey.200"
          border="none"
          _hover={{
            opacity: 0.8,
          }}
          onClick={() => {
            transactions.append({
              amount: '',
              asset: NativeAssetId,
              value: '',
            });
            delay(() => accordion.open(transactions.fields.length), 100);
          }}
        >
          Add more recipients
        </Button>
      </Center>
    </Accordion>
  );
};

export { TransactionAccordions };
