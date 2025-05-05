import { isNumericString } from '@/utils/is-numeric-string';

interface AmountUSDProps {
  amount: string;
  isNFT: boolean;
}

const AmountUSD = ({ amount, isNFT }: AmountUSDProps) => {
  if (isNFT || amount === '0.00') {
    return null;
  }
  return (
    <>
      {isNumericString(amount?.replace(/,/g, '')) && '$'}
      {amount}
    </>
  );
};

export { AmountUSD };
