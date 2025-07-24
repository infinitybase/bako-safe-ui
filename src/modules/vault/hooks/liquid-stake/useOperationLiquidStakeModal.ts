import { useState } from 'react';

import { formatMinDecimals } from '@/utils';

interface UseOperationLiquidStakeModalProps {
  balance: string;
  onClose: () => void;
}

const useOperationLiquidStakeModal = ({
  balance,
  onClose,
}: UseOperationLiquidStakeModalProps) => {
  const [errorNoBalance, setErrorNoBalance] = useState(false);
  const [valueSource, setValueSource] = useState('0.000');
  const [valueDestination, setValueDestination] = useState('0.000');

  const handleSetCurrencyAmount = (percentage: number, balance: string) => {
    const valuePercent = (Number(balance) * percentage) / 100;

    const rawValue = valuePercent.toFixed(9);
    const formattedValue = formatMinDecimals(rawValue, 3);

    setValueSource(formattedValue);
    handleSourceChange(formattedValue);
  };

  const handleClose = () => {
    setValueDestination('0.00');
    setValueSource('0.00');
    onClose();
  };

  const handleSourceChange = (newValue: string) => {
    const rate = 0.995670147;
    setValueSource(newValue);

    const sourceNumber = parseFloat(newValue) || 0;
    const destinationValue = (sourceNumber * rate).toString();

    const formattedDestination = formatMinDecimals(destinationValue, 3);
    setValueDestination(formattedDestination);

    setErrorNoBalance(newValue > balance);
  };

  const handleDestinationChange = (newValue: string) => {
    const rate = 0.995670147;
    setValueDestination(newValue);

    const destinationNumber = parseFloat(newValue) || 0;
    const sourceValue = (destinationNumber / rate).toString();

    const formattedSource = formatMinDecimals(sourceValue, 3);
    setValueSource(formattedSource);
    setErrorNoBalance(formattedSource > balance);
  };

  return {
    errorNoBalance,
    valueSource,
    valueDestination,
    handleClose,
    handleSetCurrencyAmount,
    handleSourceChange,
    handleDestinationChange,
  };
};

export { useOperationLiquidStakeModal };
