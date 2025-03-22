import { Box, styled } from '@chakra-ui/react';
import { Virtualizer } from '@tanstack/react-virtual';
import { Ref, useMemo } from 'react';

import { IUserInfos } from '@/modules/auth';
import { TransactionWithVault } from '@/modules/transactions/services';
import { transactionStatus } from '@/modules/transactions/utils';

import { TransactionCard } from '../../../TransactionCard';
import { TransactionCardMobile } from '../../../transactionCardMobile';

interface VirtualizeListTransactionItemProps {
  transaction: TransactionWithVault;
  userInfos: IUserInfos;
  virtualizer: Virtualizer<HTMLDivElement, Element>;
  isMobile: boolean;
  transactionsRef: Ref<HTMLDivElement>;
}

const Root = styled('div', { baseStyle: { w: '100%' } });

const VirtualizeListTransactionItem = ({
  virtualizer,
  transaction,
  userInfos,
  isMobile,
  transactionsRef,
}: VirtualizeListTransactionItemProps) => {
  const status = useMemo(
    () =>
      transactionStatus({
        ...transaction,
        account: userInfos.address,
      }),
    [transaction, userInfos],
  );

  const isSigner = useMemo(
    () =>
      transaction.predicate?.members?.some(
        (member) => member.address === userInfos.address,
      ) ?? false,
    [transaction, userInfos],
  );

  return (
    <Root ref={virtualizer.measureElement}>
      <Box w="full" ref={transactionsRef} my={2}>
        {isMobile ? (
          <TransactionCardMobile
            transaction={transaction}
            isSigner={isSigner}
            account={userInfos.address}
            mt="15px"
          />
        ) : (
          <TransactionCard.Container
            status={status}
            isSigner={isSigner}
            transaction={transaction}
            account={userInfos.address}
            details={
              <TransactionCard.Details
                transaction={transaction}
                status={status}
              />
            }
          />
        )}
      </Box>
    </Root>
  );
};

export default VirtualizeListTransactionItem;
