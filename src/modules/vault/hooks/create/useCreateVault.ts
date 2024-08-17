import { Address } from 'fuels';
import debounce from 'lodash.debounce';
import { ChangeEvent, useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useContactToast } from '@/modules/addressBook/hooks';
import { useCreateBakoSafeVault } from '@/modules/core/hooks';
import { Pages } from '@/modules/core/routes';
import { TemplateService } from '@/modules/template/services/methods';
import { useTemplateStore } from '@/modules/template/store';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { useCheckVaultName } from '../useGetByNameVaultRequest';
import { useCreateVaultForm } from './useCreateVaultForm';

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
      setVaultId(data.BakoSafeVaultId);
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
    setSearch(value);
    debouncedSearchHandler(value);
  };

  const handleCreateVault = form.handleSubmit(async (data) => {
    const addresses =
      data.addresses?.map(
        (address) => Address.fromString(address.value).bech32Address,
      ) ?? [];

    bakoSafeVault.create({
      name: data.name,
      description: data.description!,
      minSigners: Number(data.minSigners),
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
        `${import.meta.env.VITE_FAUCET}?address=${bakoSafeVault.data.address}`,
        '_BLANK',
      );
      navigate(
        Pages.detailsVault({
          vaultId: bakoSafeVault.data.BakoSafeVaultId,
          workspaceId: params.workspaceId!,
        }),
      );
    }
  };

  const onSaveTemplate = async () => {
    const data = form.getValues();
    const addresses = data.addresses?.map((address) => address.value) ?? [];
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
  };
};

export { useCreateVault };
