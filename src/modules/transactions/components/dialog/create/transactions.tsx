import {
  Accordion,
  AccordionItem,
  Box,
  Center,
  FormControl,
  FormHelperText,
  FormLabel,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { Controller } from 'react-hook-form';

import { AmountInput } from '@/components';
import { AutoComplete } from '@/components/autocomplete';
import { CreateContactDialog, useAddressBook } from '@/modules/addressBook';
import { AddressUtils, AssetSelect } from '@/modules/core';
import {
  UseCreateTransaction,
  useCreateTransaction,
} from '@/modules/transactions/hooks';
import { AddressBookUtils } from '@/utils/address-book';

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
  const {
    contactsPaginatedRequest: { contacts, isSuccess },
    search,
    handleOpenDialog,
    form: contactForm,
    contactDialog,
    createContactRequest,
    inView,
  } = useAddressBook();

  const options =
    contacts &&
    AddressBookUtils.removeDuplicates(contacts)?.map(({ user, nickname }) => ({
      value: user.address,
      label: AddressBookUtils.formatForAutocomplete(nickname, user.address),
    }));

  const asset = assets.assets![0];

  useEffect(() => {
    form.setValue(`transactions.${index}.asset`, asset.assetId);
  }, []);

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
                onChange={field.onChange}
                errorMessage={fieldState.error?.message}
                isLoading={!isSuccess}
                options={options}
                rightAction={{}}
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
          defaultValue={asset.assetId}
          render={({ field, fieldState }) => (
            <AssetSelect
              inView={inView}
              value={asset.name}
              index={index}
              label="Select the asset you want to send"
              isInvalid={fieldState.invalid}
              assets={assets.assets![0]}
              onChange={field.onChange}
              isDisabled={false}
              onInputChange={search.handler}
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
                    Balance: {asset?.slug}{' '}
                    {assets.getCoinBalance(asset.assetId)}
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
    <Accordion index={accordion.index}>
      {transactions.fields.map((field, index) => {
        const transaction = form.watch(`transactions.${index}`);
        const assetSlug = assets.getAssetInfo(transaction.asset)?.slug;
        const fieldState = form.getFieldState(`transactions.${index}`);

        const hasEmptyField = Object.values(transaction).some(
          (value) => value === '',
        );
        const isDisabled = hasEmptyField || fieldState.invalid;

        return (
          <AccordionItem
            key={field.id}
            mb={6}
            borderWidth={1}
            borderStyle="dashed"
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
                    onClick={() => props.transactions.remove(index)}
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
              <TransactionFormField index={index} form={form} assets={assets} />

              <Center mt={9}>
                <TransactionAccordion.ConfirmAction
                  onClick={() => accordion.close()}
                  isDisabled={isDisabled}
                />
              </Center>
            </TransactionAccordion.Item>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

export { TransactionAccordions };
