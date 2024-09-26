import { useState } from 'react';

import { useVaultByAddressRequest } from '../useVaultByAddressRequest';

const useValidateAddress = () => {
  const [address, setAddress] = useState('');
  const [enabled, setEnabled] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const request = useVaultByAddressRequest(address, enabled);

  const validateAddress = (address: string, index: number) => {
    setAddress(address);
    setEnabled(!!address);
    setCurrentIndex(index);
  };

  return {
    currentValidateAddressIndex: currentIndex,
    isAddressValid: !request.data?.id,
    validatingAddress: request.isLoading,
    validateAddress,
  };
};

export { useValidateAddress };
