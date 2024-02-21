import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useContactToast } from '@/modules/addressBook/hooks';
import { useAuthStore } from '@/modules/auth/store';
import { useCreateBsafeVault } from '@/modules/core/hooks';
import { Pages } from '@/modules/core/routes';
import { TemplateService } from '@/modules/template/services/methods';
import { useTemplateStore } from '@/modules/template/store';
import { useWorkspace } from '@/modules/workspace';

import { useCreateVaultForm } from './useCreateVaultForm';

export enum TabState {
  INFO,
  ADDRESSES,
  SUCCESS,
}

export type UseCreateVaultReturn = ReturnType<typeof useCreateVault>;

const useCreateVault = () => {
  const { account } = useAuthStore();

  const navigate = useNavigate();
  const params = useParams<{ workspaceId: string }>();
  const { errorToast } = useContactToast();

  const [tab, setTab] = useState<TabState>(TabState.INFO);
  const [vaultId, setVaultId] = useState<string>('');
  const { setTemplateFormInitial } = useTemplateStore();
  const { form, addressesFieldArray } = useCreateVaultForm(account);
  const { currentWorkspace } = useWorkspace();
  const bsafeVault = useCreateBsafeVault({
    onSuccess: (data) => {
      setVaultId(data.BSAFEVaultId);
      setTab(TabState.SUCCESS);
    },
    onError: () => {
      errorToast({
        title: 'Error on vault creation!',
        description: 'An error occurred while creating the vault',
      });
    },
  });

  const handleCreateVault = form.handleSubmit(async (data) => {
    const addresses = data.addresses?.map((address) => address.value) ?? [];

    bsafeVault.create({
      name: data.name,
      description: data.description!,
      minSigners: Number(data.minSigners),
      addresses,
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
      navigate(
        Pages.detailsVault({
          vaultId: bsafeVault.data.BSAFEVaultId,
          workspaceId: currentWorkspace.id,
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
