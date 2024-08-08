import { useTransactionHistory } from '../../hooks/details/useTransactionHistory';
import { ITransactionHistory } from '../../services';

interface DetailsTransactionStepperProps {
  transactionId: string;
  predicateId: string;
  children: (
    isLoading: boolean,
    transactionHistory: ITransactionHistory[] | null,
  ) => React.ReactNode;
}

const DetailsTransactionStepper = ({
  transactionId,
  predicateId,
  children,
}: DetailsTransactionStepperProps) => {
  const { transactionHistory, isLoading } = useTransactionHistory(
    transactionId,
    predicateId,
  );

  return <>{children(isLoading, transactionHistory)}</>;
};

export default DetailsTransactionStepper;
