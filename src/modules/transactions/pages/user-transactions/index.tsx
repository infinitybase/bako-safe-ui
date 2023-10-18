// import { VaultCard } from '../../components';
// import { useUserVaults } from '../../hooks/user-vaults';

import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  CircularProgress,
  Heading,
  HStack,
  Icon,
  VStack,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { CgList } from 'react-icons/cg';
import { FaRegPlusSquare } from 'react-icons/fa';
import { GoArrowSwitch } from 'react-icons/go';
import { IoChevronBack } from 'react-icons/io5';

import { CustomSkeleton, HomeIcon, VaultIcon } from '@/components';
import { Pages } from '@/modules/core';
import { ActionCard } from '@/modules/home/components/ActionCard';
import { limitCharacters } from '@/utils';

import { TransactionCard, TransactionFilter } from '../../components';
import { StatusFilter, useTransactionList } from '../../hooks';
import { transactionStatus } from '../../utils';

const UserTransactionsPage = () => {
  const { transactionRequest, filter, inView, account, navigate } =
    useTransactionList();

  return (
    <VStack w="full" spacing={6}>
      <HStack w="full" h="10" justifyContent="space-between" my={2}>
        <HStack>
          <Button
            variant="primary"
            fontWeight="semibold"
            fontSize={15}
            leftIcon={
              <Box mr={-1}>
                <IoChevronBack size={22} />
              </Box>
            }
            px={3}
            bg="dark.100"
            color="grey.200"
            onClick={() => navigate(Pages.home())}
          >
            Back home
          </Button>

          <Breadcrumb ml={8}>
            <BreadcrumbItem>
              <Icon mr={2} as={HomeIcon} fontSize="sm" color="grey.200" />
              <BreadcrumbLink
                fontSize="sm"
                color="grey.200"
                fontWeight="semibold"
                href="/home"
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
                Vaults
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </HStack>

        <Box>
          <Button
            variant="primary"
            fontWeight="bold"
            leftIcon={<FaRegPlusSquare />}
            onClick={() => navigate(Pages.createVault())}
          >
            Create vault
          </Button>
        </Box>
      </HStack>

      {/* ACTION BUTTONS */}
      <HStack w="full" spacing={6}>
        <ActionCard.Container onClick={() => navigate(Pages.userVaults())}>
          <ActionCard.Icon icon={VaultIcon} />
          <Box>
            <ActionCard.Title>Vaults</ActionCard.Title>
            <ActionCard.Description>
              Access and Manage All Your Vaults in One Place.
            </ActionCard.Description>
          </Box>
        </ActionCard.Container>

        <ActionCard.Container>
          <ActionCard.Icon icon={GoArrowSwitch} />
          <Box>
            <ActionCard.Title>Transactions</ActionCard.Title>
            <ActionCard.Description>
              Manage Transactions Across All Vaults in One Place.
            </ActionCard.Description>
          </Box>
        </ActionCard.Container>

        <ActionCard.Container isUpcoming={true}>
          <ActionCard.Icon icon={CgList} isUpcoming={true} />
          <Box>
            <ActionCard.Title isUpcoming={true}>Address book</ActionCard.Title>
            <ActionCard.Description>
              Access and Manage Your Contacts for Easy Transfers and Vault
              Creation.
            </ActionCard.Description>
          </Box>
        </ActionCard.Container>
      </HStack>

      {/* USER TRANSACTIONS */}
      <VStack w="full" mt={6}>
        <HStack w="full">
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
        <Box w="full" mt={3}>
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
            <TransactionFilter.Field
              value={StatusFilter.PENDING}
              label="Pending"
            />
          </TransactionFilter.Control>
        </Box>
      </VStack>

      {/* LIST */}
      <TransactionCard.List
        mt={1}
        w="full"
        spacing={5}
        maxH="calc(100% - 140px)"
        overflowY="scroll"
        css={{
          '&::-webkit-scrollbar': { width: '0' }, // Hide the scrollbar in WebKit browsers,
          scrollbarWidth: 'none', // Hide the scrollbar in Firefox
        }}
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
                status={transactionStatus({ ...transaction, account })}
              />
            </TransactionCard.Container>
          </CustomSkeleton>
        ))}
        <Box ref={inView.ref} />
      </TransactionCard.List>
    </VStack>
  );
};

export { UserTransactionsPage };
