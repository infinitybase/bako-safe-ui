import { useQuery } from '@tanstack/react-query';
import { Box, BoxProps, Field, Icon, Input, InputGroup } from 'bako-ui';
import { bn } from 'fuels';
import { useMemo, useRef } from 'react';
import { Controller, FormProvider } from 'react-hook-form';

import { CloseCircle } from '@/components';
import { UseCreateTransaction } from '@/modules/transactions/hooks';
import { UseVaultDetailsReturn } from '@/modules/vault';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

import { Recipient } from './recipient';

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
  const recipientsListRef = useRef<HTMLDivElement>(null);

  const { providerInstance } = useWorkspaceContext();
  const { data: baseAssetId } = useQuery({
    queryKey: ['baseAssetId'],
    queryFn: async () => {
      const provider = await providerInstance;
      return provider.getBaseAssetId();
    },
  });

  const { hasEthForFee } = useMemo(() => {
    if (!baseAssetId) return { hasEthForFee: false };

    let feeAlreadyAdded = false;

    const used = transactionsFields.fields.reduce((acc, _, index) => {
      const transaction = form.watch(`transactions.${index}`);
      if (transaction?.asset !== baseAssetId) return acc;

      const amount = Number(transaction.amount || 0);
      let fee = 0;

      if (!feeAlreadyAdded) {
        fee = Number(transaction.fee || 0);
        feeAlreadyAdded = true;
      }

      return acc + amount + fee;
    }, 0);

    const asset = assets.assets?.find((a) => a.assetId === baseAssetId);
    const totalEth = asset?.amount ? bn(asset.amount).formatUnits() : 0;

    const hasEnough = Number(totalEth) >= Number(used.toFixed(9));

    return {
      totalEthUsed: used,
      hasEthForFee: hasEnough,
    };
  }, [transactionsFields, form, assets.assets, baseAssetId]);

  return (
    <FormProvider {...form}>
      <Box w="full" {...props}>
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field.Root invalid={!!fieldState.error}>
              <InputGroup
                bg="gray.600"
                rounded="8px"
                endElement={
                  <Icon
                    as={CloseCircle}
                    display={field.value ? 'block' : 'none'}
                    onClick={() => field.onChange('')}
                  />
                }
              >
                <Input
                  maxLength={27}
                  variant="subtle"
                  placeholder="Transaction name"
                  _placeholder={{
                    color: 'textSecondary',
                  }}
                  {...field}
                  onChange={({ target }) => field.onChange(target.value)}
                />
              </InputGroup>
              <Field.ErrorText>{fieldState.error?.message}</Field.ErrorText>
            </Field.Root>
          )}
        />

        <Recipient.List
          ref={recipientsListRef}
          accordion={accordion}
          transactions={transactionsFields}
          allAssetsUsed={form.allAssetsUsed}
          hasEthForFee={hasEthForFee}
          ethAssetId={baseAssetId}
        >
          {transactionsFields.fields.map((transaction, index) => (
            <Recipient.Item
              key={transaction.id}
              accordion={accordion}
              assets={assets}
              getBalanceAvailable={getBalanceAvailable}
              isFeeCalcLoading={isFeeCalcLoading}
              isFirstField={transactionsFields.fields[0].id === transaction.id}
              onDelete={transactionsFields.remove}
              nicks={nicks}
              index={index}
              listRef={recipientsListRef}
            />
          ))}
        </Recipient.List>
      </Box>
    </FormProvider>
  );
};

export { CreateTransactionForm };
