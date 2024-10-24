import { isNumericString } from '@/utils/is-numeric-string';

interface AmountUSDProps {
  amount: string;
}

const AmountUSD = ({ amount }: AmountUSDProps) => {
  return (
    <>
      {isNumericString(amount) && '$'}
      {amount}
    </>
  );
};

export { AmountUSD };
