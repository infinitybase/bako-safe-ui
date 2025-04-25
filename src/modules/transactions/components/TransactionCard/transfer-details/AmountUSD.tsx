import { isNumericString } from '@/utils/is-numeric-string';

interface AmountUSDProps {
  amount: string;
  isNFT: boolean;
}

const AmountUSD = ({ amount, isNFT }: AmountUSDProps) => {
  if (isNFT) {
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
