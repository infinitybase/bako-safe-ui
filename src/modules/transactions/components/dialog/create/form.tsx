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
import { UseVaultDetailsReturn } from '@/modules/vault';

export interface CreateTransactionFormProps extends BoxProps {
  form: UseCreateTransaction['form'];
  nicks: UseCreateTransaction['nicks'];
  assets: UseVaultDetailsReturn['assets'];
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
      <Divider mt={2} mb={7} borderColor={'grey.425'} />

      <Controller
        control={form.control}
        name="name"
        render={({ field, fieldState }) => (
          <FormControl
            isInvalid={fieldState.invalid}
            sx={{
              input: {
                boxShadow: 'none !important',
              },
            }}
          >
            <Input
              maxLength={27}
              value={field.value}
              onChange={field.onChange}
              placeholder=" "
              variant="dark"
              border="1px solid"
              borderColor="grey.425"
              _hover={{
                borderColor: 'grey.425',
              }}
              _focus={{
                borderColor: 'grey.200',
              }}
            />
            <FormLabel>Transaction name</FormLabel>
            <FormHelperText color="error.500">
              {fieldState.error?.message}
            </FormHelperText>
          </FormControl>
        )}
      />

      <Dialog.Section
        mb={8}
        mt={7}
        title={<Heading variant="dialogSectionTitle">Who for?</Heading>}
        description="Set the recipient(s) for this transfer. You can set up to 10 recipients."
        spacing={4}
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
