import { yupResolver } from '@hookform/resolvers/yup';
import {
  AddressUtils as BakoAddressUtils,
  BakoProvider,
  Bech32,
  TypeUser,
} from 'bakosafe';
import { Assets } from 'fuels';
import { useFieldArray, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { CookieName, CookiesConfig } from '@/config/cookies';
import { AddressUtils } from '@/modules/core/utils';
import { useWorkspaceContext } from '@/modules/workspace/hooks';
import { formatAddressByUserType } from '@/utils';

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
              AddressUtils.isPasskey(address) || AddressUtils.isSocial(address)
                ? AddressUtils.isValid(
                    AddressUtils.fromBech32(address as Bech32),
                  )
                : AddressUtils.isValid(address),
            )
            .test(
              'is-equal-addresses',
              'Address registered',
              (address, context) => {
                const schema = context.from?.at(1);
                const _address =
                  AddressUtils.isPasskey(address) ||
                  AddressUtils.isSocial(address)
                    ? AddressUtils.fromBech32(address as Bech32)
                    : address;
                const addresses = schema?.value.addresses.map(
                  (_address: { value: string }) => {
                    let _a = _address.value;

                    if (
                      AddressUtils.isPasskey(_address.value) ||
                      AddressUtils.isSocial(_address.value)
                    ) {
                      _a = AddressUtils.fromBech32(_address.value as Bech32);
                    }

                    if (BakoAddressUtils.isEvm(_address.value)) {
                      _a = BakoAddressUtils.parseFuelAddressToEth(
                        _address.value,
                      );
                    }

                    return _a;
                  },
                );
                const addressIndex = context.path.replace(/\D/g, '');
                const hasAddress = addresses.some(
                  (value: string, _index: number) => {
                    let a = _address;
                    if (BakoAddressUtils.isEvm(_address)) {
                      a = BakoAddressUtils.parseFuelAddressToEth(_address);
                    }

                    return (
                      Number(addressIndex) !== _index &&
                      value.toLowerCase() === a.toLowerCase()
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
                  const _address =
                    AddressUtils.isPasskey(address) ||
                    AddressUtils.isSocial(address)
                      ? AddressUtils.fromBech32(address as Bech32)
                      : address;

                  if (
                    _address === CookiesConfig.getCookie(CookieName.ADDRESS)
                  ) {
                    return true;
                  }
                  const isAssetIdOrAssetAddress = !!assetIdsAndAddresses?.find(
                    (item) => item === _address,
                  );

                  const isValid =
                    AddressUtils.isValid(_address) && !isAssetIdOrAssetAddress;
                  if (!isValid) return false;

                  const provider = await providerInstance;
                  return await provider.isUserAccount(_address);
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

const getUserAddress = (type?: TypeUser, account?: string): string => {
  if (BakoAddressUtils.isEvm(account as string)) {
    return BakoAddressUtils.parseFuelAddressToEth(account as string);
  }

  if ((type === TypeUser.WEB_AUTHN || type === TypeUser.SOCIAL) && account) {
    return formatAddressByUserType(account, type);
  }

  return account as string;
};

const useCreateVaultForm = (account?: string) => {
  const { providerInstance, fuelsTokens, authDetails } = useWorkspaceContext();
  const vaultSchema = schema(providerInstance, fuelsTokens);

  const user_address = getUserAddress(
    authDetails?.userInfos?.type?.type,
    account,
  );

  const form = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(vaultSchema),
    defaultValues: {
      name: '',
      description: '',
      minSigners: '1',
      addresses: [{ value: user_address as string }],
    },
  });

  const addressesFieldArray = useFieldArray({
    name: 'addresses',
    control: form.control,
  });

  return {
    form,
    addressesFieldArray,
  };
};

export { useCreateVaultForm };
