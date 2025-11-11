import { Address } from 'fuels';
import debounce from 'lodash.debounce';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useContactToast } from '@/modules/addressBook/hooks';
import { useCreateBakoSafeVault } from '@/modules/core/hooks';
import { Pages } from '@/modules/core/routes';
import { AddressUtils } from '@/modules/core/utils/address';
import { TemplateService } from '@/modules/template/services/methods';
import { useTemplateStore } from '@/modules/template/store';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

import { useCreateVaultForm, useValidateAddress } from '.';
import { useCheckVaultName } from '../useGetByNameVaultRequest';

export enum TabState {
  INFO,
  ADDRESSES,
  SUCCESS,
}

export type UseCreateVaultReturn = ReturnType<typeof useCreateVault>;

const useCreateVault = () => {
  const {
    authDetails: { userInfos },
    workspaceInfos: {
      requests: {
        latestPredicates: { refetch: refetchLatestPredicates },
      },
    },
    userVaults: {
      request: { refetch: refetchUserVaults },
    },
  } = useWorkspaceContext();

  const navigate = useNavigate();
  const params = useParams<{ workspaceId: string }>();
  const { errorToast } = useContactToast();

  const [tab, setTab] = useState<TabState>(TabState.INFO);
  const [vaultId, setVaultId] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const { setTemplateFormInitial } = useTemplateStore();
  const { form, addressesFieldArray } = useCreateVaultForm(userInfos.address);

  const [searchRequest, setSearchRequest] = useState('');
  const [search, setSearch] = useState('');

  const bakoSafeVault = useCreateBakoSafeVault({
    onSuccess: (data) => {
      refetchLatestPredicates();
      refetchUserVaults();
      setVaultId(data.id);
      setTab(TabState.SUCCESS);
      form.reset();
      setSearch('');
    },
    onError: () => {
      errorToast({
        title: 'Error on vault creation!',
        description: 'An error occurred while creating the vault',
      });
    },
  });

  const {
    currentValidateAddressIndex,
    isAddressValid,
    validatingAddress,
    validateAddress,
    setCurrentValidateAddressIndex,
  } = useValidateAddress();

  let vaultNameIsAvailable = false;

  const checkVaultNameResult = useCheckVaultName(searchRequest);
  vaultNameIsAvailable = checkVaultNameResult.data ?? false;

  const debouncedSearchHandler = useCallback(
    debounce((value: string) => {
      setSearchRequest(value);
    }, 300),
    [],
  );

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value.trimStart());
    debouncedSearchHandler(value);
  };

  const handleCreateVault = form.handleSubmit(async (data: any) => {
    if (form.formState.submitCount > 0) return;

    const addresses =
      data.addresses?.map((address: { value: string }) => {
        const _a = AddressUtils.isPasskey(address.value)
          ? AddressUtils.fromBech32(address.value as `passkey.${string}`)
          : address.value;

        return new Address(_a).toString();
      }) ?? [];

    await bakoSafeVault.create({
      name: data.name,
      description: data.description!,
      minSigners: Number(data.minSigners),
      providerUrl: userInfos.network.url,
      addresses,
    });
  });

  const setFormWithTemplate = async (id: string) => {
    const template = await TemplateService.getById(id);
    const address: string[] = template.addresses as string[];

    setSelectedTemplate(id);
    form.setValue('minSigners', template.minSigners.toString());

    if (template.addresses) {
      form.setValue(
        'addresses',
        address.map((item: string) => {
          return { value: item };
        }),
      );
    }
  };

  const onDeposit = async () => {
    if (bakoSafeVault.data) {
      window.open(
        `${import.meta.env.VITE_FAUCET}?address=${bakoSafeVault.data.predicateAddress}`,
        '_BLANK',
      );
      navigate(
        Pages.detailsVault({
          vaultId: bakoSafeVault.data.id,
          workspaceId: params.workspaceId!,
        }),
      );
    }
  };

  const onSaveTemplate = async () => {
    const data = form.getValues();
    const addresses =
      data.addresses?.map((address: { value: string }) => address.value) ?? [];
    const minSigners = Number(data.minSigners) ?? 1;

    setTemplateFormInitial({
      minSigners,
      addresses,
    });

    navigate(
      Pages.createTemplate({
        vaultId,
        workspaceId: params.workspaceId!,
      }),
    );
  };

  const removeAddress = (index: number) => {
    addressesFieldArray.remove(index);
    form.trigger();
  };
  const appendAddress = () => {
    addressesFieldArray.append({ value: '' });
    form.trigger();
  };

  const hasAddress = (address: string, index: number) => {
    return addressesFieldArray.fields.some(({ value }, _index) => {
      return index !== _index && value === address;
    });
  };

  useEffect(() => {
    if (!isAddressValid && currentValidateAddressIndex) {
      form.setError(`addresses.${currentValidateAddressIndex}.value`, {
        type: 'custom',
        message: 'You cannot add a vault as a signer',
      });
      setCurrentValidateAddressIndex(null);
    }
  }, [currentValidateAddressIndex, isAddressValid]);

  return {
    form: {
      ...form,
      handleCreateVault,
    },
    handleInputChange,
    vaultNameIsAvailable,
    vaultId,
    search,
    setSearch,
    addresses: {
      fields: addressesFieldArray.fields,
      remove: removeAddress,
      append: appendAddress,
      has: hasAddress,
    },
    tabs: {
      tab,
      set: setTab,
      isLast: tab === TabState.ADDRESSES,
    },
    bakoSafeVault,
    navigate,
    onDeposit,
    selectedTemplate,
    setFormWithTemplate,
    onSaveTemplate,
    validateAddress: {
      handler: validateAddress,
      isLoading: validatingAddress,
    },
  };
};

export { useCreateVault };
