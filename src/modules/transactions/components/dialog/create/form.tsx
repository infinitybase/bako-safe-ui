import {
  Box,
  BoxProps,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
} from '@chakra-ui/react';
import { Controller } from 'react-hook-form';

import { Dialog } from '@/components';
import { TransactionAccordions } from '@/modules/transactions/components/dialog/create/transactions';
import { UseCreateTransaction } from '@/modules/transactions/hooks';

export interface CreateTransactionFormProps extends BoxProps {
  form: UseCreateTransaction['form'];
  nicks: UseCreateTransaction['nicks'];
  assets: UseCreateTransaction['assets'];
  accordion: UseCreateTransaction['accordion'];
  transactionsFields: UseCreateTransaction['transactionsFields'];
  isFeeCalcLoading: boolean;
  getBalanceAvailable: UseCreateTransaction['getBalanceAvailable'];
}

const CreateTransactionForm = (props: CreateTransactionFormProps) => {
  const {
    form,
    assets,
    transactionsFields,
    accordion,
    nicks,
    isFeeCalcLoading,
    getBalanceAvailable,
  } = props;

  return (
    <Box w="full" {...props}>
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

      <Divider mt={7} mb={4} />

      <Dialog.Section
        mb={8}
        title={
          <Heading fontSize="lg" fontWeight="bold" color="white">
            Who for?
          </Heading>
        }
        description="Set the recipient(s) for this transfer. You can set up to 10 recipients."
      />

      <TransactionAccordions
        form={form}
        nicks={nicks}
        assets={assets}
        accordion={accordion}
        transactions={transactionsFields}
        isFeeCalcLoading={isFeeCalcLoading}
        getBalanceAvailable={getBalanceAvailable}
      />
    </Box>
  );
};

export { CreateTransactionForm };
