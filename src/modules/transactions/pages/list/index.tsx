import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Heading,
  Icon,
  VStack,
} from '@chakra-ui/react';
import { format } from 'date-fns';

import { HomeIcon } from '@/components';
import { transactionStatus } from '@/modules';
import {
  TransactionCard,
  TransactionFilter,
} from '@/modules/transactions/components';
import { limitCharacters } from '@/utils';

import { StatusFilter, useTransactionList } from '../../hooks';

const TransactionsVaultPage = () => {
  const { transactionRequest, filter, inView, account } = useTransactionList();

  return (
    <Box w="full">
      {/* BREADCRUMB */}
      <Box mb={10}>
        <Breadcrumb>
          <BreadcrumbItem>
            <Icon mr={2} as={HomeIcon} fontSize="sm" color="grey.200" />
            <BreadcrumbLink
              fontSize="sm"
              color="grey.200"
              fontWeight="semibold"
              href="#"
            >
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink
              fontSize="sm"
              color="grey.200"
              fontWeight="semibold"
              href="#"
            >
              Transactions
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </Box>

      {/* TITLE */}
      <Box mb={7}>
        <Heading variant="title-xl" color="grey.200">
          Transactions
        </Heading>
      </Box>

      {/* FILTER */}
      <TransactionFilter.Control
        value={filter.value}
        onChange={(value) => filter.set(value as StatusFilter)}
      >
        <TransactionFilter.Field value={StatusFilter.ALL} label="All" />
        <TransactionFilter.Field
          value={StatusFilter.COMPLETED}
          label="Completed"
        />
        <TransactionFilter.Field
          value={StatusFilter.DECLINED}
          label="Declined"
        />
        <TransactionFilter.Field value={StatusFilter.PENDING} label="Pending" />
      </TransactionFilter.Control>

      {/* TRANSACTION LIST */}
      <VStack
        mt={7}
        spacing={5}
        w="full"
        maxH="calc(100% - 82px)"
        overflowY="scroll"
        alignItems="flex-start"
      >
        {transactionRequest.transactions.map((transaction) => (
          <TransactionCard.Container
            status={transactionStatus({ ...transaction, account })}
            isExpanded={false}
            key={transaction.id}
          >
            {/*<TransactionCard.VaultInfo vault={transaction.predicate} />*/}
            <TransactionCard.CreationDate>
              {format(new Date(transaction.createdAt), 'EEE, dd MMM')}
            </TransactionCard.CreationDate>
            <TransactionCard.Assets />
            <TransactionCard.Amount assets={transaction.assets} />
            <TransactionCard.Name>
              {limitCharacters(transaction.name, 20)}
            </TransactionCard.Name>
            <TransactionCard.Status
              transaction={transaction}
              status={transactionStatus({ ...transaction, account })}
            />
            <TransactionCard.Actions
              transaction={transaction}
              isExpanded={true}
              status={transactionStatus({ ...transaction, account })}
              collapse={() => console.log('ok')}
            />
          </TransactionCard.Container>
        ))}
        {!transactionRequest.isLoading && <Box ref={inView.ref} />}
      </VStack>
    </Box>
  );
};

export { TransactionsVaultPage };
