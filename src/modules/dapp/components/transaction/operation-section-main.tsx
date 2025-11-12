import { UseTransactionSocket } from '../../hooks';
import { SimplifiedOperation } from '../../services/simplify-transaction';
import { DappTransaction } from '.';

interface Props {
  operations?: SimplifiedOperation[];
  vault: UseTransactionSocket['vault'];
}

export const DappTransactionOperationSectionMain = (props: Props) => {
  const { operations, vault } = props;

  if (!operations?.length) return null;

  return operations.map((operation, index) => (
    <DappTransaction.Operation
      key={`${operation.type}-${operation?.from?.address || ''}-${operation?.to?.address || ''}-${index}`}
      vault={vault!}
      operation={operation}
      renderSeparator={false}
    />
  ));
};
