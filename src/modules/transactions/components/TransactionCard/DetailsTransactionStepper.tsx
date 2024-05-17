import { CustomSkeleton } from '@/components';

import { useTransactionHistory } from '../../hooks/details/useTransactionHistory';
import { TransactionStepper } from './TransactionStepper';

interface DetailsTransactionStepperProps {
  transactionId: string;
}

const DetailsTransactionStepper = ({
  transactionId,
}: DetailsTransactionStepperProps) => {
  const { transactionHistory, isLoading } =
    useTransactionHistory(transactionId);

  return (
    <CustomSkeleton isLoaded={!isLoading} h={290}>
      <TransactionStepper steps={transactionHistory!} />
    </CustomSkeleton>
  );
};

export default DetailsTransactionStepper;
