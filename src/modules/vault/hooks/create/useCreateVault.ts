import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  useCreateVaultRequest,
  useFuel,
  useFuelAccount,
  useToast,
} from '@/modules';

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
  const [tab, setTab] = useState<TabState>(TabState.INFO);
  const toast = useToast();

  const { form, addressesFieldArray } = useCreateVaultForm(account);
  const request = useCreateVaultRequest({
    onSuccess: () => {
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
    const addresses = data.addresses?.map((address) => address.value) ?? [];

    request.createVault({
      name: data.name,
      addresses,
      minSigners: Number(data.minSigners),
      description: data.description,
      owner: account,
      provider: await fuel.getProvider(),
    });
  });

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
    request,
    navigate,
  };
};

export { useCreateVault };
