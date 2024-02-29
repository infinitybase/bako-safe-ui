import {
  Accordion,
  AccordionItem,
  Box,
  Button,
  Center,
  FormControl,
  FormHelperText,
  FormLabel,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Controller } from 'react-hook-form';

import { AmountInput, UserAddIcon } from '@/components';
import { AutoComplete } from '@/components/autocomplete';
import { CreateContactDialog, useAddressBook } from '@/modules/addressBook';
import {
  AddressUtils,
  AssetSelect,
  delay,
  NativeAssetId,
} from '@/modules/core';
import {
  UseCreateTransaction,
  useCreateTransaction,
} from '@/modules/transactions/hooks';

import { TransactionAccordion } from './accordion';

interface TransactionAccordionProps {
  form: UseCreateTransaction['form'];
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
  const {
    createContactRequest,
    search,
    handleOpenDialog,
    form: contactForm,
    contactDialog,
    paginatedContacts,
    inView,
  } = useAddressBook();

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
            return (
              <AutoComplete
                inView={inView}
                value={field.value}
                index={index}
                label={`Recipient ${index + 1} address`}
                isInvalid={fieldState.invalid}
                isDisabled={false}
                onInputChange={search.handler}
                onChange={(selected) => field.onChange(selected)}
                errorMessage={fieldState.error?.message}
                isLoading={!paginatedContacts.isSuccess}
                options={paginatedContacts.data!}
                bottomAction={
                  <Box mt={2}>
                    <Text color="grey.200" fontSize={12}>
                      Do you wanna{' '}
                      <Link
                        color="brand.500"
                        onClick={() =>
                          handleOpenDialog?.({ address: field.value })
                        }
                      >
                        add
                      </Link>{' '}
                      this address in your address book?
                    </Text>
                  </Box>
                }
              />
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
  const { nicks } = useCreateTransaction();
  const { form, transactions, assets, accordion } = props;

  return (
    <Accordion
      index={accordion.index}
      overflowY="auto"
      maxH={450}
      pr={4}
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
        const isDisabled = hasEmptyField || fieldState.invalid;

        return (
          <>
            <AccordionItem
              key={field.id}
              mb={6}
              borderWidth={1}
              borderColor="dark.100"
              borderRadius={10}
              backgroundColor="dark.300"
            >
              <TransactionAccordion.Item
                title={`Recipient ${index + 1}`}
                actions={
                  <TransactionAccordion.Actions>
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
                    <TransactionAccordion.ConfirmAction
                      onClick={() => accordion.close()}
                      isDisabled={isDisabled}
                    />
                  </TransactionAccordion.Actions>
                }
                resume={
                  !hasEmptyField && (
                    <Text fontSize="sm" color="grey.500">
                      <b>
                        {transaction.amount} {assetSlug}
                      </b>{' '}
                      to{' '}
                      <b>
                        {' '}
                        {nicks[transaction.to] ??
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
