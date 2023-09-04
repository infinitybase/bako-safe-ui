import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useFuelAccount } from '@/modules';

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
  const { form, addressesFieldArray } = useCreateVaultForm(account);

  const handleCreateVault = form.handleSubmit((data) => {
    console.log(data);
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
    navigate,
  };
};

export { useCreateVault };
