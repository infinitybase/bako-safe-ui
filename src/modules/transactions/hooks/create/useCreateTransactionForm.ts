import { yupResolver } from '@hookform/resolvers/yup';
import { BN, bn, NetworkFuel } from 'fuels';
import { useMemo } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import * as yup from 'yup';

import {
  AddressUtils,
  AddressValidator,
  AssetMap,
  NativeAssetId,
} from '@/modules/core/utils';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

export interface ITransactionField {
  asset: string;
  value: string;
  amount: string;
  fee?: string;
  resolvedLabel?: string;
}

export interface ITransactionForm {
  name: string | undefined;
  handle: string | undefined;
  resolver: string | undefined;
  transactions: ITransactionField[] | undefined;
}

export type UseCreateTransactionFormParams = {
  assets?: { assetId: string; amount: string }[];
  nfts?: { assetId: string }[];
  assetsMap: AssetMap;
  validateBalance: (asset: string, amount: string) => boolean;
  getCoinAmount: (asset: string) => BN;
};

const useCreateTransactionForm = (params: UseCreateTransactionFormParams) => {
  const { providerInstance, fuelsTokens, assetsMap } = useWorkspaceContext();

  const addressValidator = useMemo(
    () => new AddressValidator(providerInstance),
    [providerInstance],
  );

  const assetIdsAndAddresses = fuelsTokens?.flatMap((item) =>
    item.networks
      ?.map((network) =>
        network.type === 'fuel' ? network.assetId : network.address,
      )
      .filter(Boolean),
  );

  const validationSchema = useMemo(() => {
    const transactionSchema = yup.object({
      asset: yup.string().required('Asset is required.'),
      amount: yup
        .string()
        .required('Amount is required.')
        .test(
          'amount-greater-than-zero',
          'Amount must be greater than 0.',
          (_, context) => {
            const { parent } = context;

            const isNFT = !!params.nfts?.find(
              (nft) => nft.assetId === parent.asset,
            );

            if (isNFT) return true;

            return bn.parseUnits(parent.amount).gt(bn(0));
          },
        )
        .test(
          'amount-decimals',
          'Exceeded the allowed number of decimal places.',
          (amount, { parent }) => {
            const decimalsCounter = amount.split('.')[1]?.length;

            const selectedToken =
              fuelsTokens
                ?.flatMap(({ networks }) => networks)
                .find((n) => (n as NetworkFuel)?.assetId === parent.asset) ||
              null;

            const maxDecimals =
              selectedToken?.decimals ?? assetsMap?.[parent.asset]?.units;

            return !(maxDecimals && decimalsCounter > maxDecimals);
          },
        )
        .test(
          'has-fee-balance',
          'Insufficient funds for the gas fee (ETH).',
          (_, context) => {
            const { parent } = context;

            if (parent.fee) {
              const hasFeeBalance = params.validateBalance(
                NativeAssetId,
                parent.fee,
              );

              return hasFeeBalance;
            }

            return true;
          },
        )
        .test('has-balance', 'Not enough balance.', (amount, context) => {
          const { parent } = context;

          const isNFT = !!params.nfts?.find(
            (nft) => nft.assetId === parent.asset,
          );

          if (isNFT) return true;

          if (parent.fee && parent.asset === NativeAssetId) {
            const transactionTotalAmount = bn
              .parseUnits(parent.amount)
              .add(bn.parseUnits(parent.fee))
              .format();

            return params.validateBalance(parent.asset, transactionTotalAmount);
          }

          const hasAssetBalance = params.validateBalance(
            parent.asset,
            parent.amount,
          );

          return hasAssetBalance;
        })
        .test(
          'has-total-balance',
          'Not enough balance.',
          (_amount, context) => {
            const { from, parent } = context;
            const isNFT = !!params.nfts?.find(
              (nft) => nft.assetId === parent.asset,
            );

            if (isNFT) return true;

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const [, schema] = from;
            const transactions = schema.value.transactions as {
              asset: string;
              amount: string;
              to: string;
            }[];

            const units = (
              params.assetsMap?.[parent.asset] ?? params.assetsMap?.['UNKNOWN']
            )?.units;

            const coinBalance = bn.parseUnits(
              params.getCoinAmount(parent.asset)?.format({ units }),
            );

            let transactionsBalance = transactions
              .filter((transaction) => transaction.asset === parent.asset)
              .reduce(
                (currentValue, transaction) =>
                  currentValue.add(bn.parseUnits(transaction.amount)),
                bn(0),
              );

            if (parent.fee && parent.asset === NativeAssetId) {
              transactionsBalance = transactionsBalance.add(
                bn.parseUnits(parent.fee),
              );
            }

            return transactionsBalance.lte(coinBalance);
          },
        ),
      fee: yup.string(),
      value: yup
        .string()
        .required('Address is required.')
        .test('valid-address', 'Invalid address.', (address) => {
          const allowEvm = true;
          return AddressUtils.isValid(address, !allowEvm);
        })
        .test(
          'valid-account',
          'This address can not receive assets from Bako.',
          async (address) => {
            const isAssetIdOrAssetAddress = !!assetIdsAndAddresses?.find(
              (item) => item === address,
            );

            try {
              const isValid =
                AddressUtils.isValid(address) && !isAssetIdOrAssetAddress;
              if (!isValid) return false;
              if (AddressUtils.isPasskey(address)) {
                return false;
              }
              return addressValidator.isValid(address);
            } catch {
              return false;
            }
          },
        ),
      resolvedLabel: yup.string().optional(),
    });

    const schema = yup.object({
      name: yup.string().optional(),
      handle: yup.string().optional(),
      resolver: yup.string().optional(),
      transactions: yup.array(transactionSchema),
    });

    return { transactionSchema, schema };
  }, [params]);

  const form = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(validationSchema.schema),
    defaultValues: {
      name: '',
      transactions: [
        {
          asset: NativeAssetId,
          value: '',
          amount: '',
          fee: '',
          resolvedLabel: '',
        },
      ],
    },
  });
  const transactionsFields = useFieldArray({
    control: form.control,
    name: 'transactions',
  });

  return {
    form,
    transactionsFields,
    validationSchema,
  };
};

export type UseCreateTransactionForm = ReturnType<
  typeof useCreateTransactionForm
>;

export { useCreateTransactionForm };
