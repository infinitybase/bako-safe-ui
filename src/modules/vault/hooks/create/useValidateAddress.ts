import { useState } from 'react';

import { useCheckVaultByAddressRequest } from '../useCheckVaultByAddressRequest';

const useValidateAddress = () => {
  const [address, setAddress] = useState('');
  const [enabled, setEnabled] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const request = useCheckVaultByAddressRequest(address, enabled);

  const validateAddress = (address: string, index: number) => {
    setAddress(address);
    setEnabled(!!address);
    setCurrentIndex(index);
  };

  return {
    currentValidateAddressIndex: currentIndex,
    isAddressValid: !request.data,
    validatingAddress: request.isLoading,
    validateAddress,
    setCurrentValidateAddressIndex: setCurrentIndex,
  };
};

export { useValidateAddress };
