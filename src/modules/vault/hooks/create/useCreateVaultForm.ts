import { yupResolver } from '@hookform/resolvers/yup';
import { useFieldArray, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { AddressUtils } from '@/modules';

const schema = yup
  .object({
    name: yup.string().required('Name is required.'),
    description: yup.string().optional(),
    addresses: yup.array().of(
      yup.object({
        value: yup
          .string()
          .required('Empty address')
          .test('is-valid-address', 'Invalid address', (address) =>
            AddressUtils.isValid(address),
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
      addresses: [{ value: account }],
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
