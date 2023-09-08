import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Pages,
  useCreateVaultRequest,
  useFuelAccount,
  useToast,
} from '@/modules';

import { useCreateVaultForm } from './useCreateVaultForm';

export enum TabState {
  INFO,
  ADDRESSES,
}

export type UseCreateVaultReturn = ReturnType<typeof useCreateVault>;

const useCreateVault = () => {
  const { account } = useFuelAccount();

  const navigate = useNavigate();
  const [tab, setTab] = useState<TabState>(TabState.INFO);
  const toast = useToast();

  const { form, addressesFieldArray } = useCreateVaultForm(account);
  const request = useCreateVaultRequest({
    onSuccess: () => {
      toast.show({
        status: 'success',
        title: 'Vault created',
        position: 'bottom',
        isClosable: true,
      });
      navigate(Pages.home());
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

  const handleCreateVault = form.handleSubmit((data) => {
    const addresses = data.addresses?.map((address) => address.value) ?? [];

    request.createVault({
      name: data.name,
      addresses,
      minSigners: Number(data.minSigners),
      description: data.description,
      owner: account,
    });
  });

  const removeAddress = (index: number) => {
    addressesFieldArray.remove(index);
  };
  const appendAddress = () => {
    addressesFieldArray.append({ value: '' });
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
