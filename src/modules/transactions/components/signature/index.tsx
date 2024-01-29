import { Badge, CircularProgress, Icon } from '@chakra-ui/react';
import { ITransaction } from 'bsafe';
import { useMemo } from 'react';

import { PendingIcon } from '@/components';

import { waitingSignatures } from '../../utils';

interface WaitingSignatureBadgeProps {
  account: string;
  isLoading?: boolean;
  transactions: ITransaction[] | undefined;
}

const WaitingSignatureBadge = (props: WaitingSignatureBadgeProps) => {
  const { isLoading, account, transactions = [] } = props;

  const pendingSignatures = useMemo(
    () =>
      waitingSignatures({
        account,
        transactions,
      }),
    [transactions, account],
  );

  const has = pendingSignatures > 0;

  if (isLoading) {
    return (
      <CircularProgress
        size="20px"
        trackColor="dark.100"
        color="brand.500"
        isIndeterminate
      />
    );
  }

  if (!has) {
    return null;
  }

  return (
    <Badge h={6} variant="warning">
      <Icon as={PendingIcon} />
      {`${pendingSignatures} waiting for your signature`}
    </Badge>
  );
};

export { WaitingSignatureBadge };
