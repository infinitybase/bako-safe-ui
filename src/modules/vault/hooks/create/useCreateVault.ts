import { Provider } from 'fuels';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Pages,
  useCreateBsafeVault,
  useFuel,
  useFuelAccount,
  useToast,
  VaultUtils,
} from '@/modules';
import { TemplateService } from '@/modules/template/services/methods';
import { useTemplateStore } from '@/modules/template/store';

import { useCreateVaultForm } from './useCreateVaultForm';

export enum TabState {
  INFO,
  ADDRESSES,
  SUCCESS,
}

export type UseCreateVaultReturn = ReturnType<typeof useCreateVault>;

const useCreateVault = () => {
  const { account } = useFuelAccount();
  const [fuel] = useFuel();

  const navigate = useNavigate();
  const toast = useToast();

  const [tab, setTab] = useState<TabState>(TabState.INFO);
  const [vaultId, setVaultId] = useState<string>('');
  const { setTemplateFormInitial } = useTemplateStore();
  const { form, addressesFieldArray } = useCreateVaultForm(account);

  const bsafeVault = useCreateBsafeVault({
    onSuccess: (data) => {
      setVaultId(data.BSAFEVaultId);
      setTab(TabState.SUCCESS);
    },
    onError: () => {
      toast.show({
        status: 'error',
        title: 'Error on create vault',
        position: 'bottom',
        isClosable: true,
      });
    },
  });

  const handleCreateVault = form.handleSubmit(async (data) => {
    const netowrk = await fuel.network();
    const provider = await Provider.create(netowrk.url);
    const addresses = data.addresses?.map((address) => address.value) ?? [];

    bsafeVault.create({
      name: data.name,
      description: data.description,
      provider: provider,
      configurable: {
        chainId: provider.getChainId(),
        network: provider.url,
        SIGNATURES_COUNT: Number(data.minSigners),
        SIGNERS: VaultUtils.makeSubscribers(addresses),
        HASH_PREDICATE: VaultUtils.makeHashPredicate(),
      },
    });
  });

  const setFormWithTemplate = async (id: string) => {
    try {
      const template = await TemplateService.getById(id);
      const address: string[] = template.addresses as string[];

      form.setValue('minSigners', template.minSigners.toString());

      if (template.addresses) {
        form.setValue(
          'addresses',
          address.map((item: string) => {
            return { value: item };
          }),
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onDeposit = async () => {
    if (bsafeVault.data) {
      window.open(
        `${import.meta.env.VITE_FAUCET}?address=${bsafeVault.data.address}`,
        '_BLANK',
      );
      navigate(Pages.detailsVault({ vaultId: bsafeVault.data.BSAFEVaultId }));
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
    bsafeVault,
    navigate,
    onDeposit,
    setFormWithTemplate,
    onSaveTemplate,
  };
};

export { useCreateVault };
