import { yupResolver } from '@hookform/resolvers/yup';
import { AddressUtils as BakoAddressUtils, BakoProvider } from 'bakosafe';
import { Assets } from 'fuels';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { AddressUtils } from '@/modules/core';
import { HandleUtils } from '@/utils';

const useCreateContactForm = (
  providerInstance: Promise<BakoProvider>,
  fuelsTokens?: Assets,
) => {
  const assetIdsAndAddresses = fuelsTokens?.flatMap((item) => {
    return item.networks
      ?.map(
        (network) =>
          ('assetId' in network && network['assetId']) ||
          ('address' in network && network['address']),
      )
      .filter(Boolean);
  });

  const schema = yup.object({
    nickname: yup.string().required('Name is required.'),
    handle: yup.string().optional(),
    resolver: yup.string().optional(),
    address: yup
      .string()
      .required('Address is required.')
      .test(
        'is-valid-address',
        'This address can not receive assets from Bako.',
        async (address) => {
          if (address?.startsWith('@')) {
            return HandleUtils.isValidHandle(address);
          }

          const isAssetIdOrAssetAddress = !!assetIdsAndAddresses?.find(
            (item) => item === address,
          );
          try {
            const isValid =
              AddressUtils.isValid(address) && !isAssetIdOrAssetAddress;
            if (!isValid) return false;

            const isEvm = BakoAddressUtils.isEvm(address);
            if (isEvm) return false;

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

export type ICreateContactFormData = {
  nickname: string;
  address: string;
  handle?: string;
  resolver?: string;
};

export { useCreateContactForm };
