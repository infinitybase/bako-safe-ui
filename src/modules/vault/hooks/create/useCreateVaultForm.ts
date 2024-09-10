import { yupResolver } from '@hookform/resolvers/yup';
import { useFieldArray, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { AddressUtils } from '@/modules/core/utils';
import { Address } from 'fuels';

const schema = yup
  .object({
    name: yup.string().required('Name is required.').trim(),
    description: yup.string().optional(),
    addresses: yup.array().of(
      yup.object({
        value: yup
          .string()
          .required('Empty address')
          .test('is-valid-address', 'Invalid address', (address) =>
            AddressUtils.isValid(address),
          )
          .test(
            'is-equal-addresses',
            'Address registered.',
            (address, context) => {
              const schema = context.from?.at(1);
              const addresses = schema?.value.addresses.map(
                (_address: { value: string }) => _address.value,
              );
              const addressIndex = context.path.replace(/\D/g, '');
              const hasAddress = addresses.some(
                (value: string, _index: number) => {
                  return (
                    Number(addressIndex) !== _index &&
                    Address.fromString(value).bech32Address ===
                      Address.fromString(address).bech32Address
                  );
                },
              );

              return !hasAddress;
            },
          ),
      }),
    ),
    minSigners: yup.string(),
  })
  .test(
    'minSigner-validation',
    'The number of required signatures must be less than or equal to the number of addresses',
    function (values) {
      if (
        values.addresses &&
        values?.addresses?.length < Number(values?.minSigners)
      ) {
        return this.createError({
          path: 'minSigners',
        });
      }

      return true;
    },
  );

export type UseCreateVaultFormFields = yup.InferType<typeof schema>;

const useCreateVaultForm = (account?: string) => {
  const form = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      minSigners: '1',
      addresses: [{ value: account as string }],
    },
  });

  const addressesFieldArray = useFieldArray<UseCreateVaultFormFields>({
    name: 'addresses',
    control: form.control,
  });

  return {
    form,
    addressesFieldArray,
  };
};

export { useCreateVaultForm };
