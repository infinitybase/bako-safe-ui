import { Box, BoxProps } from 'bako-ui';
import { forwardRef, memo, useMemo } from 'react';

import { IUserInfos } from '@/modules/auth';

import { TransactionWithVault } from '../../services';
import { transactionStatus } from '../../utils';
import { TransactionCard } from '../TransactionCard';
import { TransactionCardMobile } from '../transactionCardMobile';

interface TransactionItemProps extends BoxProps {
  transaction: TransactionWithVault;
  userInfos: IUserInfos;
  isMobile: boolean;
}

export const Item = memo(
  forwardRef<HTMLDivElement, TransactionItemProps>(
    ({ transaction, userInfos, isMobile, ...props }, ref) => {
      const status = useMemo(
        () => transactionStatus({ ...transaction, account: userInfos.address }),
        [transaction, userInfos],
      );

      const isSigner = useMemo(
        () =>
          !!transaction.predicate?.members?.find(
            (member) => member.address === userInfos.address,
          ),
        [transaction.predicate, userInfos.address],
      );

      return (
        <Box ref={ref} {...props}>
          {isMobile && (
            <TransactionCardMobile
              isSigner={isSigner}
              transaction={transaction}
              account={userInfos.address}
              mt="15px"
            />
          )}

          {!isMobile && (
            <TransactionCard.Container
              mb="11px"
              status={status}
              isSigner={isSigner}
              transaction={transaction}
              details={
                <TransactionCard.Details
                  transaction={transaction}
                  status={status}
                />
              }
            />
          )}
        </Box>
      );
    },
  ),
);

Item.displayName = 'Item';
