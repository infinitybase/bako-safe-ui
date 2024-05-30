import * as yup from 'yup';

import { AddressUtils } from '@/modules/core';
const schema = yup
  .object({
    name: yup.string().required('Name is required.').required(),
    description: yup.string().optional(),
    addresses: yup
      .array()
      .of(
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
                    return Number(addressIndex) !== _index && value === address;
                  },
                );

                return !hasAddress;
              },
            ),
        }),
      )
      .required(),
    minSigners: yup.number().required(),
  })
  //force deploy
  .test(
    'minSigner-validation',
    'The number of required signatures must be less than or equal to the number of addresses',
    function (values) {
      if (
        (values.addresses && values?.addresses?.length < values?.minSigners) ||
        values.minSigners < 1
      ) {
        return this.createError({
          path: 'minSigners',
          message:
            'The number of required signatures must be less than or equal to the number of addresses',
        });
      }

      return true;
    },
  );

export { schema };
