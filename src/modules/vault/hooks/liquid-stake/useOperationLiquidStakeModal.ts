import { bn } from 'fuels';
import { useEffect, useState } from 'react';

import { formatMinDecimals } from '@/utils';

import { useDepositLiquidStake } from './useDepositLiquidStake';
import { DECIMALS } from './useGetInfosCardLiquidStake';

interface UseOperationLiquidStakeModalProps {
  balance: string;
  onClose: () => void;
}

const useOperationLiquidStakeModal = ({
  balance,
  onClose,
}: UseOperationLiquidStakeModalProps) => {
  const [errorNoBalance, setErrorNoBalance] = useState('');
  const [valueSource, setValueSource] = useState('0.000');
  const [valueDestination, setValueDestination] = useState('0.000');
  const [isDepositing, setIsDepositing] = useState(false);
  const [maxFee, setMaxFee] = useState<number>(0);
  const { price, depositWithVault, getMaxFee } = useDepositLiquidStake();

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
    setIsDepositing(false);
    onClose();
  };

  const handleSourceChange = (newValue: string) => {
    setValueSource(newValue);

    const sourceNumber = parseFloat(newValue) || 0;
    const destinationValue = (sourceNumber * price).toString();

    const formattedDestination = formatMinDecimals(destinationValue, 3);
    setValueDestination(formattedDestination);

    setErrorNoBalance(
      newValue > balance
        ? 'Your current Fuel tokens balance is insufficient for this operation.'
        : '',
    );
  };

  const handleDestinationChange = (newValue: string) => {
    setValueDestination(newValue);

    const destinationNumber = parseFloat(newValue) || 0;
    const sourceValue = (destinationNumber / price).toString();

    const formattedSource = formatMinDecimals(sourceValue, 3);
    setValueSource(formattedSource);
    setErrorNoBalance(
      formattedSource > balance
        ? 'Your current Fuel tokens balance is insufficient for this operation.'
        : '',
    );
  };

  useEffect(() => {
    async function getFee() {
      const maxFee = await getMaxFee(bn(1000));
      if (maxFee) setMaxFee(maxFee);
    }

    getFee();
  }, [getMaxFee]);

  const createTxLiquidStake = async () => {
    setIsDepositing(true);

    try {
      const COIN_QUANTITY = bn(
        Math.floor(Number(valueSource) * DECIMALS).toString(),
      );
      await depositWithVault(COIN_QUANTITY);
      await handleClose();
    } catch (error) {
      console.error('error createTxLiquidStake', error);
    } finally {
      setIsDepositing(false);
    }
  };

  return {
    errorNoBalance,
    valueSource,
    valueDestination,
    isDepositing,
    maxFee,
    handleClose,
    handleSetCurrencyAmount,
    handleSourceChange,
    handleDestinationChange,
    createTxLiquidStake,
  };
};

export { useOperationLiquidStakeModal };
