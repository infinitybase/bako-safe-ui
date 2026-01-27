import { randomBytes } from 'ethers';
import { bn } from 'fuels';
import { useCallback, useState } from 'react';

import { useTransactionToast } from '@/modules/transactions/providers/toast';
import { formatMaxDecimals, formatMinDecimals } from '@/utils';

import { useDepositLiquidStake } from './useDepositLiquidStake';

interface UseOperationLiquidStakeModalProps {
  balance: number;
  onClose: () => void;
}

const useOperationLiquidStakeModal = ({
  balance,
  onClose,
}: UseOperationLiquidStakeModalProps) => {
  const [errorAmount, setErrorAmount] = useState('');
  const [valueSource, setValueSource] = useState('0.00');
  const [valueDestination, setValueDestination] = useState('0.00');
  const [isDepositing, setIsDepositing] = useState(false);
  const [maxFee, setMaxFee] = useState<number>(0);
  const { price, depositWithVault, getMaxFee } = useDepositLiquidStake();
  const toast = useTransactionToast();
  const MINIMUM_VALUE = '1';

  const handleSetCurrencyAmount = (percentage: number, balance: string) => {
    const balanceTreated = Number(balance.replace(/,/g, ''));
    const valuePercent = (balanceTreated * percentage) / 100;

    const rawValue = valuePercent.toFixed(9);
    const formattedValue = formatMinDecimals(rawValue, 3);

    setValueSource(formattedValue);
    handleSourceChange(formattedValue);
  };

  const handleClose = () => {
    setValueDestination('0.00');
    setValueSource('0.00');
    setErrorAmount('');
    setIsDepositing(false);
    onClose();
  };

  const handleSourceChange = (newValue: string) => {
    setValueSource(newValue);

    const value = parseFloat(newValue.replace(/,/g, ''));

    const sourceNumber = value || 0;
    const destinationValue = (sourceNumber * price).toString();

    const formattedMinDestination = formatMinDecimals(destinationValue, 3);
    const formattedDestination = formatMaxDecimals(formattedMinDestination, 9);
    setValueDestination(formattedDestination);

    setErrorAmount(
      value > balance
        ? 'Your current Fuel tokens balance is insufficient for this operation.'
        : value < Number(MINIMUM_VALUE)
          ? 'Amount must be at least 1.'
          : '',
    );
  };

  const handleDestinationChange = (newValue: string) => {
    setValueDestination(newValue);

    const destinationNumber = parseFloat(newValue) || 0;
    const sourceValue = (destinationNumber / price).toString();

    const formattedMinSource = formatMinDecimals(sourceValue, 3);
    const formattedSource = formatMaxDecimals(formattedMinSource, 9);

    setValueSource(formattedSource);
    setErrorAmount(
      Number(formattedSource) > balance
        ? 'Your current Fuel tokens balance is insufficient for this operation.'
        : Number(formattedSource) < Number(MINIMUM_VALUE)
          ? 'Amount must be at least 1.'
          : '',
    );
  };

  const calculateFee = useCallback(async () => {
    const maxFee = await getMaxFee(bn(1000000));
    if (maxFee) setMaxFee(maxFee);
  }, [getMaxFee]);

  const createTxLiquidStake = async () => {
    setIsDepositing(true);

    try {
      const COIN_QUANTITY = bn.parseUnits(valueSource.replace(/,/g, ''), 9);
      await depositWithVault(COIN_QUANTITY);
      handleClose();
    } catch (error) {
      console.error('error createTxLiquidStake', error);
      if (error instanceof Error && error.message === 'Rejected request!')
        return;

      toast.generalError(
        randomBytes.toString(),
        'Error on try transaction Liquid Stake',
      );
    } finally {
      setIsDepositing(false);
    }
  };

  return {
    errorAmount,
    valueSource,
    valueDestination,
    isDepositing,
    maxFee,
    handleClose,
    handleSetCurrencyAmount,
    handleSourceChange,
    handleDestinationChange,
    createTxLiquidStake,
    calculateFee,
  };
};

export { useOperationLiquidStakeModal };
