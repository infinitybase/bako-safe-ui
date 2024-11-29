import { yupResolver } from '@hookform/resolvers/yup';
import { BakoProvider } from 'bakosafe';
import { Assets } from 'fuels';
import { useFieldArray, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { CookieName, CookiesConfig } from '@/config/cookies';
import { AddressUtils } from '@/modules/core/utils';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

const schema = (
  providerInstance: Promise<BakoProvider>,
  fuelsTokens?: Assets,
) => {
  const assetIdsAndAddresses = fuelsTokens?.flatMap((item) =>
    item.networks
      ?.map((network) => network['assetId'] ?? network['address'])
      .filter(Boolean),
  );
  return yup
    .object({
      name: yup.string().required('Name is required').trim(),
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
              'Address registered',
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
                      value.toLowerCase() === address.toLowerCase()
                    );
                  },
                );

                return !hasAddress;
              },
            )
            .test(
              'valid-account',
              'This address can not receive assets from Bako.',
              async (address) => {
                try {
                  if (address === CookiesConfig.getCookie(CookieName.ADDRESS)) {
                    return true;
                  }
                  const isAssetIdOrAssetAddress = !!assetIdsAndAddresses?.find(
                    (item) => item === address,
                  );

                  const isValid =
                    AddressUtils.isValid(address) && !isAssetIdOrAssetAddress;
                  if (!isValid) return false;

                  const provider = await providerInstance;
                  return await provider.isUserAccount(address);
                } catch {
                  return false;
                }
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
};

const useCreateVaultForm = (account?: string) => {
  const { providerInstance, fuelsTokens } = useWorkspaceContext();
  const vaultSchema = schema(providerInstance, fuelsTokens);

  const form = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(vaultSchema),
    defaultValues: {
      name: '',
      description: '',
      minSigners: '1',
      addresses: [{ value: account as string }],
    },
  });

  type UseCreateVaultFormFields = yup.InferType<typeof vaultSchema>;

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
