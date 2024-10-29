import { isNumericString } from '@/utils/is-numeric-string';

interface AmountUSDProps {
  amount: string;
}

const AmountUSD = ({ amount }: AmountUSDProps) => {
  return (
    <>
      {isNumericString(amount.replace(/,/g, '')) && '$'}
      {amount}
    </>
  );
};

export { AmountUSD };
