import {
  Accordion,
  AccordionButton,
  AccordionItem,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import { Controller } from 'react-hook-form';

import { AmountInput } from '@/components';
import { AssetSelect } from '@/modules/core';
import { UseCreateTransaction } from '@/modules/transactions/hooks';

import { TransactionAccordion } from './accordion';

interface TransactionAccordionProps {
  form: UseCreateTransaction['form'];
  assets: UseCreateTransaction['assets'];
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

  return (
    <VStack spacing={5}>
      <Controller
        name={`transactions.${index}.to`}
        control={form.control}
        render={({ field, fieldState }) => (
          <FormControl isInvalid={fieldState.invalid}>
            <Input
              value={field.value}
              onChange={field.onChange}
              placeholder=" "
            />
            <FormLabel>Recipient 1 address</FormLabel>
            <FormHelperText color="error.500">
              {fieldState.error?.message}
            </FormHelperText>
          </FormControl>
        )}
      />
      <Controller
        name={`transactions.${index}.asset`}
        control={form.control}
        render={({ field, fieldState }) => (
          <AssetSelect
            assets={assets.assets}
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
  );
};

const TransactionAccordions = (props: TransactionAccordionProps) => {
  const { form, transactions, assets } = props;

  return (
    <Accordion allowMultiple>
      {transactions.fields.map((field, index) => {
        return (
          <AccordionItem
            key={field.id}
            mb={6}
            py={5}
            px={5}
            borderWidth={1}
            borderStyle="dashed"
            borderColor="dark.100"
            borderRadius={10}
            backgroundColor="dark.300"
          >
            {({ isExpanded }) => (
              <TransactionAccordion.Item
                title={`Recipient ${index + 1}`}
                actions={
                  <TransactionAccordion.Actions>
                    <TransactionAccordion.EditAction disabled={isExpanded} />
                    <TransactionAccordion.DeleteAction
                      isDisabled={props.transactions.fields.length === 1}
                      onClick={() => props.transactions.remove(index)}
                    />
                  </TransactionAccordion.Actions>
                }
                resume={
                  <Text fontSize="sm" color="grey.500">
                    0.03898 ETH to 827383764...0909
                  </Text>
                }
                isExpanded={isExpanded}
              >
                <TransactionFormField
                  form={form}
                  index={index}
                  assets={assets}
                />

                <AccordionButton as={Button}>Confirm</AccordionButton>
              </TransactionAccordion.Item>
            )}
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

export { TransactionAccordions };
