import { yupResolver } from '@hookform/resolvers/yup';
import { BN, bn } from 'fuels';
import { useMemo } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { AddressUtils } from '@/modules';

export type UseCreateTransactionFormParams = {
  assets?: { assetId: string; amount: string }[];
  validateBalance: (asset: string, amount: string) => boolean;
  getCoinAmount: (asset: string) => BN;
};

const useCreateTransactionForm = (params: UseCreateTransactionFormParams) => {
  const validationSchema = useMemo(() => {
    const transactionSchema = yup.object({
      asset: yup.string().required('Asset is required.'),
      amount: yup
        .string()
        .required('Amount is required.')
        .test('has-balance', 'Not found balance.', (amount, context) => {
          const { parent } = context;
          return params.validateBalance(parent.asset, amount);
        })
        .test('has-total-balance', 'Not found balance.', (_amount, context) => {
          const { from, parent } = context;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const [, schema] = from;
          const transactions = schema.value.transactions as {
            asset: string;
            amount: string;
            to: string;
          }[];

          const coinBalance = params
            .getCoinAmount(parent.asset)
            .sub(bn.parseUnits('0.000000001'));
          const tranasctionsBalance = transactions
            .filter((transaction) => transaction.asset === parent.asset)
            .reduce(
              (currentValue, transaction) =>
                currentValue.add(bn.parseUnits(transaction.amount)),
              bn(0),
            );

          return tranasctionsBalance.lte(coinBalance);
        }),
      to: yup
        .string()
        .required('Address is required.')
        .test('valid-address', 'Address invalid.', (address) =>
          AddressUtils.isValid(address),
        ),
    });

    const schema = yup.object({
      name: yup.string().required(''),
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
          asset: '',
          to: '',
          amount: '',
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
