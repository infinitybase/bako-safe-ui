import {
  Box,
  Button,
  Center,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
} from '@chakra-ui/react';
import React from 'react';
import { Controller } from 'react-hook-form';

import { Dialog, UserAddIcon } from '@/components';
import { delay } from '@/modules/core';
import { TransactionAccordions } from '@/modules/transactions/components/dialog/create/transactions';
import { UseCreateTransaction } from '@/modules/transactions/hooks';

export interface CreateTransactionFormProps {
  form: UseCreateTransaction['form'];
  assets: UseCreateTransaction['assets'];
  accordion: UseCreateTransaction['accordion'];
  transactionsFields: UseCreateTransaction['transactionsFields'];
}

const CreateTransactionForm = (props: CreateTransactionFormProps) => {
  const { form, assets, transactionsFields, accordion } = props;

  return (
    <Box w="full">
      <Controller
        control={form.control}
        name="name"
        render={({ field, fieldState }) => (
          <FormControl isInvalid={fieldState.invalid}>
            <Input
              value={field.value}
              onChange={field.onChange}
              placeholder=" "
            />
            <FormLabel>Transaction name</FormLabel>
            <FormHelperText color="error.500">
              {fieldState.error?.message}
            </FormHelperText>
          </FormControl>
        )}
      />

      <Divider borderColor="dark.100" my={9} />

      <Dialog.Section
        mb={8}
        title={
          <Heading fontSize="md" color="grey.200">
            Who for?
          </Heading>
        }
        description="Set the recipient(s) for this transfer. You can set up to 10 recipients."
      />

      <TransactionAccordions
        form={form}
        assets={assets}
        accordion={accordion}
        transactions={transactionsFields}
      />

      <Center>
        <Button
          maxW="fit-content"
          leftIcon={<UserAddIcon />}
          variant="secondary"
          bgColor="dark.100"
          border="none"
          onClick={() => {
            transactionsFields.append({ amount: '', asset: '', to: '' });
            delay(() => accordion.open(transactionsFields.fields.length), 100);
          }}
        >
          Add new recipient
        </Button>
      </Center>
    </Box>
  );
};

export { CreateTransactionForm };
