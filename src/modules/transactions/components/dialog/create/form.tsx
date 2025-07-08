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
import { bn } from 'fuels';
import { useEffect, useMemo, useState } from 'react';
import { Controller, FormProvider } from 'react-hook-form';

import { Dialog } from '@/components';
import { UseCreateTransaction } from '@/modules/transactions/hooks';
import { UseVaultDetailsReturn } from '@/modules/vault';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

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

  const { providerInstance } = useWorkspaceContext();

  const [ethAssetId, setEthAssetId] = useState<string | undefined>();

  useEffect(() => {
    const fetchEthAssetId = async () => {
      const provider = await providerInstance;
      const baseAssetId = await provider.getBaseAssetId();
      setEthAssetId(baseAssetId);
    };

    fetchEthAssetId();
  }, [providerInstance]);

  const { hasEthForFee } = useMemo(() => {
    if (!ethAssetId) return { hasEthForFee: false };

    let feeAlreadyAdded = false;

    const used = transactionsFields.fields.reduce((acc, _, index) => {
      const transaction = form.watch(`transactions.${index}`);
      if (transaction.asset !== ethAssetId) return acc;

      const amount = Number(transaction.amount || 0);
      let fee = 0;

      if (!feeAlreadyAdded) {
        fee = Number(transaction.fee || 0);
        feeAlreadyAdded = true;
      }

      return acc + amount + fee;
    }, 0);

    const asset = assets.assets?.find((a) => a.assetId === ethAssetId);
    const totalEth = asset?.amount ? bn(asset.amount).formatUnits() : 0;

    const hasEnough = Number(totalEth) >= Number(used.toFixed(9));

    return {
      totalEthUsed: used,
      hasEthForFee: hasEnough,
    };
  }, [transactionsFields, form, assets.assets, ethAssetId]);

  return (
    <FormProvider {...form}>
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
              <FormLabel id="transaction_name">Transaction name</FormLabel>
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

        <Recipient.List
          accordion={accordion}
          transactions={transactionsFields}
          allAssetsUsed={form.allAssetsUsed}
          hasEthForFee={hasEthForFee}
          ethAssetId={ethAssetId}
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
              hasEthForFee={hasEthForFee}
              ethAssetId={ethAssetId}
            />
          ))}
        </Recipient.List>
      </Box>
    </FormProvider>
  );
};

export { CreateTransactionForm };
