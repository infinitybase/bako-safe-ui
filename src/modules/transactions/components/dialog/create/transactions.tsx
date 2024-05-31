import {
  Accordion,
  AccordionItem,
  Button,
  Center,
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
  useAddressBook,
} from '@/modules/addressBook';
import { useAuth } from '@/modules/auth/hooks';
import {
  AddressUtils,
  AssetSelect,
  delay,
  NativeAssetId,
} from '@/modules/core';
import { UseCreateTransaction } from '@/modules/transactions/hooks';

import { TransactionAccordion } from './accordion';

interface TransactionAccordionProps {
  form: UseCreateTransaction['form'];
  nicks: UseCreateTransaction['nicks'];
  assets: UseCreateTransaction['assets'];
  accordion: UseCreateTransaction['accordion'];
  transactions: UseCreateTransaction['transactionsFields'];
}

interface TransctionFormFieldProps {
  form: UseCreateTransaction['form'];
  index: number;
  assets: UseCreateTransaction['assets'];
}

const TransactionFormField = ({
  form,
  assets,
  index,
}: TransctionFormFieldProps) => {
  const asset = form.watch(`transactions.${index}.asset`);
  const { isSingleWorkspace } = useAuth();

  const {
    createContactRequest,
    search,
    handleOpenDialog,
    form: contactForm,
    contactDialog,
    paginatedContacts,
    listContactsRequest,
    inView,
    canAddMember,
  } = useAddressBook(!isSingleWorkspace);

  return (
    <>
      <CreateContactDialog
        form={contactForm}
        dialog={contactDialog}
        isLoading={createContactRequest.isLoading}
        isEdit={false}
      />
      <VStack spacing={5}>
        <Controller
          name={`transactions.${index}.to`}
          control={form.control}
          render={({ field, fieldState }) => {
            const showAddToAddressBook =
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
                  label={`Recipient ${index + 1} address`}
                  onInputChange={search.handler}
                  onChange={field.onChange}
                  isLoading={!paginatedContacts.isSuccess}
                  options={paginatedContacts.data!}
                  inView={inView}
                  clearable={false}
                  isFromTransactions
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
              name={`transaction.${index}.asset`}
              value={field.value}
              onChange={field.onChange}
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
          render={({ field, fieldState }) => (
            <FormControl>
              <AmountInput
                placeholder=" "
                value={field.value}
                onChange={field.onChange}
                isInvalid={fieldState.invalid}
              />
              <FormLabel color="gray">Amount</FormLabel>
              <FormHelperText>
                {asset && (
                  <Text>
                    Balance: {assets.getAssetInfo(asset)?.slug}{' '}
                    {assets.getCoinBalance(asset)}
                  </Text>
                )}
              </FormHelperText>
              <FormHelperText color="error.500">
                {fieldState.error?.message}
              </FormHelperText>
            </FormControl>
          )}
        />
      </VStack>
    </>
  );
};

const TransactionAccordions = (props: TransactionAccordionProps) => {
  const { form, transactions, assets, accordion, nicks } = props;

  return (
    <Accordion
      index={accordion.index}
      overflowY="auto"
      maxH={450}
      pr={{ base: 1, sm: 4 }}
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

        const isDisabled = accordion.index <= 0;
        hasEmptyField || fieldState.invalid || isCurrentAmountZero;
        const contact = nicks.find(
          (nick) => nick.user.address === transaction.to,
        );

        return (
          <>
            <AccordionItem
              key={field.id}
              mb={6}
              borderWidth={1}
              borderColor="dark.600"
              borderRadius={10}
              backgroundColor="dark.600"
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
                          AddressUtils.format(transaction.to)}
                      </b>
                    </Text>
                  )
                }
              >
                <TransactionFormField
                  index={index}
                  form={form}
                  assets={assets}
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
              to: '',
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
