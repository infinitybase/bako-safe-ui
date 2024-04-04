import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  CircularProgress,
  Heading,
  HStack,
  Icon,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { TransactionStatus } from 'bsafe';
import { format } from 'date-fns';
import { RiMenuUnfoldLine } from 'react-icons/ri';

import { CustomSkeleton, ErrorIcon, HomeIcon } from '@/components';
import { Drawer } from '@/layouts/dashboard/drawer';
import { useScreenSize } from '@/modules/core';
import { useHome } from '@/modules/home';
import {
  TransactionCard,
  TransactionFilter,
} from '@/modules/transactions/components';
import { limitCharacters } from '@/utils/limit-characters';

import { StatusFilter, useTransactionList } from '../../hooks';
import { transactionStatus } from '../../utils';

const TransactionsVaultPage = () => {
  const {
    transactionRequest,
    infinityTransactionsRef,
    infinityTransactions,
    filter,
    inView,
    account,
    selectedTransaction,
    setSelectedTransaction,
    defaultIndex,
  } = useTransactionList();
  const { goHome } = useHome();
  const { vaultRequiredSizeToColumnLayout, isMobile } = useScreenSize();
  const menuDrawer = useDisclosure();

  return (
    <Box w="full" height="100%" maxH="100%">
      <Drawer isOpen={menuDrawer.isOpen} onClose={menuDrawer.onClose} />

      <Box mb={10}>
        {vaultRequiredSizeToColumnLayout ? (
          <HStack mt={2} gap={1.5} w="fit-content" onClick={menuDrawer.onOpen}>
            <Icon as={RiMenuUnfoldLine} fontSize="xl" color="grey.200" />
            <Text fontSize="sm" fontWeight="normal" color="grey.100">
              Menu
            </Text>
          </HStack>
        ) : (
          <Breadcrumb>
            <BreadcrumbItem>
              <Icon mr={2} as={HomeIcon} fontSize="sm" color="grey.200" />
              <BreadcrumbLink
                fontSize="sm"
                color="grey.200"
                fontWeight="semibold"
                onClick={() => goHome()}
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
        )}
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
        value={filter.value!}
        onChange={(value) => {
          setSelectedTransaction({});
          filter.set(value as StatusFilter);
        }}
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
        <TransactionFilter.Field
          value={TransactionStatus.AWAIT_REQUIREMENTS}
          label="Pending"
        />

        {selectedTransaction.id && (
          <HStack spacing={2}>
            <Text color="brand.500">{selectedTransaction.name}</Text>
            <Box
              onClick={() => {
                setSelectedTransaction({});
                filter.set(StatusFilter.ALL);
              }}
              cursor="pointer"
            >
              <Icon as={ErrorIcon} color="brand.500" />
            </Box>
          </HStack>
        )}
      </TransactionFilter.Control>

      {/* TRANSACTION LIST */}
      <TransactionCard.List
        mt={7}
        w="full"
        spacing={5}
        openIndex={defaultIndex}
        key={defaultIndex.join(',')}
        pb={10}
      >
        {infinityTransactions?.map((transaction) => {
          const isSigner = !!transaction.predicate?.members?.find(
            (member) => member.address === account,
          );

          return (
            <Box key={transaction.id} ref={infinityTransactionsRef}>
              <CustomSkeleton isLoaded={!transactionRequest.isLoading}>
                <TransactionCard.Container
                  status={transactionStatus({ ...transaction, account })}
                  details={
                    <TransactionCard.Details transaction={transaction} />
                  }
                  transaction={transaction}
                  account={account}
                  isSigner={isSigner}
                >
                  {!isMobile && (
                    <TransactionCard.CreationDate>
                      {format(new Date(transaction.createdAt), 'EEE, dd MMM')}
                    </TransactionCard.CreationDate>
                  )}
                  <TransactionCard.Assets />
                  <TransactionCard.Amount assets={transaction.resume.outputs} />
                  <TransactionCard.Name>
                    {limitCharacters(transaction.name, 20)}
                  </TransactionCard.Name>
                  <TransactionCard.Status
                    transaction={transaction}
                    status={transactionStatus({ ...transaction, account })}
                    showDescription={!isMobile}
                  />
                  <TransactionCard.Actions
                    isSigner={isSigner}
                    transaction={transaction}
                    status={transactionStatus({ ...transaction, account })}
                  />
                </TransactionCard.Container>
              </CustomSkeleton>
            </Box>
          );
        })}
        <Box ref={inView.ref} />
      </TransactionCard.List>
    </Box>
  );
};

export { TransactionsVaultPage };
