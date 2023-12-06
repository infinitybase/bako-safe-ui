import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  CircularProgress,
  Heading,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { format } from 'date-fns';

import { CustomSkeleton, HomeIcon } from '@/components';
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
    <Box w="full" height="100%" maxH="100%" overflowY="hidden">
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
      <HStack spacing={5} mb={7}>
        <Heading variant="title-xl" color="grey.200">
          Transactions
        </Heading>
        <CircularProgress
          hidden={!transactionRequest.isFetching}
          size="20px"
          color="brand.500"
          trackColor="dark.100"
          isIndeterminate
        />
      </HStack>

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
      <TransactionCard.List
        mt={7}
        w="full"
        spacing={5}
        maxH="calc(100% - 140px)"
        overflowY="scroll"
        css={{ '::-webkit-scrollbar': { width: '0' }, scrollbarWidth: 'none' }}
        pb={10}
      >
        {transactionRequest.transactions.map((transaction) => (
          <CustomSkeleton
            key={transaction.id}
            isLoaded={!transactionRequest.isLoading}
          >
            <TransactionCard.Container
              status={transactionStatus({ ...transaction, account })}
              details={<TransactionCard.Details transaction={transaction} />}
            >
              <TransactionCard.CreationDate>
                {format(new Date(transaction.createdAt), 'EEE, dd MMM')}
              </TransactionCard.CreationDate>
              <TransactionCard.Assets />
              <TransactionCard.Amount assets={transaction.resume.outputs} />
              <TransactionCard.Name>
                {limitCharacters(transaction.name, 20)}
              </TransactionCard.Name>
              <TransactionCard.Status
                transaction={transaction}
                status={transactionStatus({ ...transaction, account })}
              />
              <TransactionCard.Actions
                transaction={transaction}
                status={transactionStatus({ ...transaction, account })}
              />
            </TransactionCard.Container>
          </CustomSkeleton>
        ))}
        <Box ref={inView.ref} />
      </TransactionCard.List>
    </Box>
  );
};

export { TransactionsVaultPage };
