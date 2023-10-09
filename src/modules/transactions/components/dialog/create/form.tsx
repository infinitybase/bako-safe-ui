import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Icon,
  Input,
} from '@chakra-ui/react';
import React from 'react';
import { Controller } from 'react-hook-form';
import { MdAdd as AddIcon } from 'react-icons/md';

import { Dialog } from '@/components';
import { TransactionAccordions } from '@/modules/transactions/components/dialog/create/transactions';
import { UseCreateTransaction } from '@/modules/transactions/hooks';

export interface CreateTransactionFormProps {
  form: UseCreateTransaction['form'];
  assets: UseCreateTransaction['assets'];
  transactionsFields: UseCreateTransaction['transactionsFields'];
  isCreating?: boolean;
}

const CreateTransactionForm = (props: CreateTransactionFormProps) => {
  const { form, assets, transactionsFields, isCreating } = props;

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
        transactions={transactionsFields}
      />

      <Button
        mt={8}
        width="100%"
        color="grey"
        bgColor="dark.100"
        leftIcon={<Icon as={AddIcon} />}
        _hover={{}}
        _active={{}}
        onClick={() =>
          transactionsFields.append({ amount: '', asset: '', to: '' })
        }
      >
        Add Transaction
      </Button>
    </Box>
  );
};

export { CreateTransactionForm };
