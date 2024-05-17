import { useTransactionHistory } from '../../hooks/details/useTransactionHistory';
import { ITransactionHistory } from '../../services';

interface DetailsTransactionStepperProps {
  transactionId: string;
  children: (
    isLoading: boolean,
    transactionHistory: ITransactionHistory[] | null,
  ) => React.ReactNode;
}

const DetailsTransactionStepper = ({
  transactionId,
  children,
}: DetailsTransactionStepperProps) => {
  const { transactionHistory, isLoading } =
    useTransactionHistory(transactionId);

  return <>{children(isLoading, transactionHistory)}</>;
};

export default DetailsTransactionStepper;
