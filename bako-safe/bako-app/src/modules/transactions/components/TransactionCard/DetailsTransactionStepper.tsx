import { useTransactionHistory } from '../../hooks/details/useTransactionHistory';
import { ITransactionHistory } from '../../services';

interface DetailsTransactionStepperProps {
  transactionId: string;
  predicateId: string;
  isMobileDetailsOpen: boolean;
  isTransactionSuccess: boolean;
  isDeposit: boolean;
  children: (
    isLoading: boolean,
    transactionHistory: ITransactionHistory[] | undefined,
  ) => React.ReactNode;
}

const DetailsTransactionStepper = ({
  transactionId,
  predicateId,
  isMobileDetailsOpen,
  isTransactionSuccess,
  isDeposit,
  children,
}: DetailsTransactionStepperProps) => {
  const { transactionHistory, isLoading } = useTransactionHistory(
    transactionId,
    predicateId,
    isMobileDetailsOpen,
    isTransactionSuccess,
    isDeposit,
  );

  return <>{children(isLoading, transactionHistory)}</>;
};

export default DetailsTransactionStepper;
