import { yupResolver } from '@hookform/resolvers/yup';
import { BakoProvider } from 'bakosafe';
import { Assets } from 'fuels';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { AddressUtils } from '@/modules/core';

const useCreateContactForm = (
  providerInstance: Promise<BakoProvider>,
  fuelsTokens?: Assets,
) => {
  const assetIdsAndAddresses = fuelsTokens?.flatMap((item) =>
    item.networks
      .map((network) => network['assetId'] ?? network['address'])
      .filter(Boolean),
  );

  const schema = yup.object({
    nickname: yup.string().required('Name is required.'),
    address: yup
      .string()
      .required('Address is required.')
      .test(
        'is-valid-address',
        'This address can not receive assets from Bako.',
        async (address) => {
          const isAssetIdOrAssetAddress = !!assetIdsAndAddresses?.find(
            (item) => item === address,
          );
          try {
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
  });

  const form = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      nickname: '',
      address: '',
    },
  });

  return {
    form,
  };
};

export { useCreateContactForm };
