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
import { useEffect } from 'react';
import { Controller } from 'react-hook-form';

import { Dialog } from '@/components';
import { queryClient } from '@/config/query-client';
import { OFF_CHAIN_SYNC_DATA_QUERY_KEY } from '@/modules/core/hooks/bako-id';
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

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: [OFF_CHAIN_SYNC_DATA_QUERY_KEY],
    });
  }, []);

  return (
    <Box w="full" {...props}>
      <Divider mt={2} mb={7} borderColor={'grey.425'} />

      <Controller
        control={form.control}
        name="name"
        render={({ field, fieldState }) => (
          <FormControl isInvalid={fieldState.invalid}>
            <Input
              maxLength={27}
              value={field.value?.trimStart()}
              onChange={field.onChange}
              placeholder=" "
              variant="dark"
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
        title={
          <Heading fontSize="lg" fontWeight="bold" color="white">
            Who for?
          </Heading>
        }
        description="Set the recipient(s) for this transfer. You can set up to 10 recipients."
        descriptionFontSize="sm"
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
