import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  Icon,
  Input,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import { Controller } from 'react-hook-form';
import { MdAdd as AddIcon } from 'react-icons/md';
import { TbTrash as RemoveIcon } from 'react-icons/tb';

import { AmountInput } from '@/components';
import { AssetSelect } from '@/modules/core';
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
    <form onSubmit={form.handleCreateTransaction}>
      <Box mb={2}>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormControl>
              <FormLabel color="gray">Name</FormLabel>
              <Input
                value={field.value}
                onChange={field.onChange}
                variant="filled"
                bg="dark.100"
                color="gray"
              />
              <FormHelperText>
                <Text color="error">{fieldState.error?.message}</Text>
              </FormHelperText>
            </FormControl>
          )}
        />
      </Box>
      <Divider opacity="0.2" mb={3} mt={3} />
      {transactionsFields.fields.map((transaction, index) => {
        const asset = form.watch(`transactions.${index}.asset`);

        return (
          <React.Fragment key={transaction.id}>
            <Box mb={2}>
              <Controller
                name={`transactions.${index}.to`}
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormControl>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                        flexDirection: 'row',
                      }}
                    >
                      <FormLabel color="gray">To</FormLabel>
                      {index > 0 && (
                        <Icon
                          as={RemoveIcon}
                          fontSize="md"
                          color="red.400"
                          cursor="pointer"
                          onClick={() => transactionsFields.remove(index)}
                        />
                      )}
                    </div>
                    <Input
                      value={field.value}
                      onChange={field.onChange}
                      variant="filled"
                      bg="dark.100"
                      color="gray"
                      _hover={{}}
                    />
                    <FormHelperText>
                      <Text color="error">{fieldState.error?.message}</Text>
                    </FormHelperText>
                  </FormControl>
                )}
              />
            </Box>
            <Box mb={2}>
              <Controller
                name={`transactions.${index}.asset`}
                control={form.control}
                render={({ field }) => (
                  <AssetSelect
                    assets={assets.assets}
                    name={`transaction.${index}.asset`}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </Box>
            <Grid mb={4}>
              <Controller
                name={`transactions.${index}.amount`}
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormControl>
                    <FormLabel color="gray">Amount</FormLabel>
                    <AmountInput
                      value={field.value}
                      onChange={field.onChange}
                    />
                    <FormHelperText>
                      {asset && (
                        <Text>
                          Balance: {assets.getAssetInfo(asset)?.slug}{' '}
                          {assets.getCoinBalance(asset)}
                        </Text>
                      )}
                    </FormHelperText>
                    <FormHelperText>
                      <Text color="error">{fieldState.error?.message}</Text>
                    </FormHelperText>
                  </FormControl>
                )}
              />
            </Grid>
            <Divider opacity="0.2" mb={3} />
          </React.Fragment>
        );
      })}

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

      <Button
        mt={4}
        w="100%"
        color="brand.900"
        variant="solid"
        colorScheme="brand"
        type="submit"
        isDisabled={!form.formState.isValid}
        isLoading={isCreating}
      >
        Create
      </Button>
    </form>
  );
};

export { CreateTransactionForm };
