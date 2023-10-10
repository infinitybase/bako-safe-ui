import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Heading,
  Icon,
  VStack,
} from '@chakra-ui/react';

import { Card, HomeIcon } from '@/components';
import { TransactionFilter } from '@/modules/transactions/components';

import { StatusFilter, useTransactionList } from '../../hooks';

const TransactionsVaultPage = () => {
  const { transactionRequest, filter, inView } = useTransactionList();

  return (
    <Box maxW={1000} w="full">
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
        spacing={3}
        w="full"
        maxH="calc(100% - 82px)"
        overflowY="scroll"
        alignItems="flex-start"
      >
        {transactionRequest.transactions.map((transaction) => (
          <Card w="full" key={transaction.id}>
            ok
          </Card>
        ))}
        {!transactionRequest.isLoading && <Box ref={inView.ref} />}
      </VStack>
    </Box>
  );
};

export { TransactionsVaultPage };
