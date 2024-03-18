import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Heading,
  HStack,
  Icon,
  Stack,
  VStack,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { FaRegPlusSquare } from 'react-icons/fa';
import { IoChevronBack } from 'react-icons/io5';

import { CustomSkeleton, HomeIcon, VaultIcon } from '@/components';
import { AddressBookIcon } from '@/components/icons/address-book';
import { TransactionsIcon } from '@/components/icons/transactions';
import { useAuth } from '@/modules/auth';
import { Pages, PermissionRoles, useScreenSize } from '@/modules/core';
import { ActionCard } from '@/modules/home/components/ActionCard';
import { EmptyTransaction } from '@/modules/home/components/EmptyCard/Transaction';
import { useHome } from '@/modules/home/hooks/useHome';
import { useGetCurrentWorkspace, useWorkspace } from '@/modules/workspace';
import { limitCharacters } from '@/utils';

import {
  TransactionCard,
  TransactionCardMobile,
  TransactionFilter,
  WaitingSignatureBadge,
} from '../../components';
import { StatusFilter, useTransactionList } from '../../hooks';
import { transactionStatus } from '../../utils';

const UserTransactionsPage = () => {
  const {
    infinityTransactions,
    infinityTransactionsRef,
    transactionRequest,
    filter,
    inView,
    account,
    navigate,
    pendingSignerTransactions,
    hasSkeleton,
  } = useTransactionList();

  const { hasPermission, goWorkspace } = useWorkspace();
  const {
    isSingleWorkspace,
    workspaces: { current },
  } = useAuth();

  const { workspace } = useGetCurrentWorkspace();

  const { goHome } = useHome();

  const { isMobile } = useScreenSize();

  const { OWNER, MANAGER } = PermissionRoles;

  return (
    <VStack w="full" spacing={6} p={[1, 1]} px={['auto', 8]}>
      <HStack w="full" h="10" justifyContent="space-between" my={2}>
        <HStack>
          <Button
            variant="primary"
            fontWeight="semibold"
            leftIcon={
              <Box mr={-1}>
                <IoChevronBack size={22} />
              </Box>
            }
            px={3}
            bg="dark.100"
            color="grey.200"
            onClick={() =>
              isSingleWorkspace ? goHome() : goWorkspace(current ?? '')
            }
          >
            Back home
          </Button>

          {!isMobile && (
            <>
              <Breadcrumb ml={8}>
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

                {!isSingleWorkspace && (
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      fontSize="sm"
                      color="grey.200"
                      fontWeight="semibold"
                      onClick={() => goWorkspace(current)}
                    >
                      {workspace?.name}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                )}

                <BreadcrumbItem>
                  <BreadcrumbLink
                    fontSize="sm"
                    color="grey.200"
                    fontWeight="semibold"
                    href="#"
                  >
                    My Transactions
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </Breadcrumb>
            </>
          )}
        </HStack>
        <Box>
          <Button
            isDisabled={!hasPermission([OWNER, MANAGER])}
            variant="primary"
            fontWeight="bold"
            leftIcon={<FaRegPlusSquare />}
            onClick={() =>
              navigate(
                Pages.createVault({
                  workspaceId: current,
                }),
              )
            }
          >
            Create vault
          </Button>
        </Box>
      </HStack>

      {/* ACTION BUTTONS */}
      <Stack w="full" direction={['column', 'row']} spacing={6}>
        <ActionCard.Container
          onClick={() =>
            navigate(
              Pages.userVaults({
                workspaceId: current ?? '',
              }),
            )
          }
        >
          <ActionCard.Icon icon={VaultIcon} />
          <Box>
            <ActionCard.Title>Vaults</ActionCard.Title>
            <ActionCard.Description>
              Access and Manage All Your Vaults in One Place.
            </ActionCard.Description>
          </Box>
        </ActionCard.Container>

        <ActionCard.Container cursor="auto">
          <ActionCard.Icon icon={TransactionsIcon} />
          <Box>
            <ActionCard.Title>Transactions</ActionCard.Title>
            <ActionCard.Description>
              Manage Transactions Across All Vaults in One Place.
            </ActionCard.Description>
          </Box>
        </ActionCard.Container>

        <ActionCard.Container
          onClick={() =>
            navigate(
              Pages.addressBook({
                workspaceId: current ?? '',
              }),
            )
          }
        >
          <ActionCard.Icon icon={AddressBookIcon} />
          <Box>
            <ActionCard.Title>Address book</ActionCard.Title>
            <ActionCard.Description>
              Access and Manage Your Contacts for Easy Transfers and Vault
              Creation.
            </ActionCard.Description>
          </Box>
        </ActionCard.Container>
      </Stack>

      {/* USER TRANSACTIONS */}
      <VStack w="full" mt={6}>
        <HStack w="full">
          <Heading variant="title-xl" color="grey.200">
            Transactions
          </Heading>
          <WaitingSignatureBadge
            isLoading={pendingSignerTransactions.isLoading}
            quantity={pendingSignerTransactions.data?.ofUser ?? 0}
          />
        </HStack>

        {/* FILTER */}
        <Box w="full" mt={3}>
          <TransactionFilter.Control
            value={filter.value!}
            onChange={(value) => {
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
              value={StatusFilter.PENDING}
              label="Pending"
            />
          </TransactionFilter.Control>
        </Box>
      </VStack>

      {/* LIST */}
      <TransactionCard.List mt={1} w="full" spacing={[3, 5]}>
        {!transactionRequest.isLoading &&
          !transactionRequest?.transactions.length && <EmptyTransaction />}

        {infinityTransactions?.map((transaction) => {
          const isSigner = !!transaction.predicate?.members?.find(
            (member) => member.address === account,
          );

          return (
            <Box key={transaction.id} ref={infinityTransactionsRef}>
              <CustomSkeleton key={transaction.id} isLoaded={!hasSkeleton}>
                {isMobile ? (
                  <TransactionCardMobile
                    isSigner={isSigner}
                    transaction={transaction}
                    account={account}
                  />
                ) : (
                  <TransactionCard.Container
                    status={transactionStatus({ ...transaction, account })}
                    details={
                      <TransactionCard.Details transaction={transaction} />
                    }
                    transaction={transaction}
                    account={account}
                    isSigner={isSigner}
                  >
                    {transaction.predicate && (
                      <TransactionCard.VaultInfo
                        vault={transaction.predicate}
                      />
                    )}
                    <TransactionCard.CreationDate>
                      {format(new Date(transaction.createdAt), 'EEE, dd MMM')}
                    </TransactionCard.CreationDate>
                    <TransactionCard.Assets />
                    <TransactionCard.Amount
                      assets={transaction.resume.outputs}
                    />
                    <TransactionCard.Name>
                      {limitCharacters(transaction.name, 20)}
                    </TransactionCard.Name>
                    <TransactionCard.Status
                      transaction={transaction}
                      status={transactionStatus({ ...transaction, account })}
                    />
                    <TransactionCard.Actions
                      isSigner={isSigner}
                      transaction={transaction}
                      status={transactionStatus({ ...transaction, account })}
                    />
                  </TransactionCard.Container>
                )}
              </CustomSkeleton>
            </Box>
          );
        })}
        <Box ref={inView.ref} />
      </TransactionCard.List>
    </VStack>
  );
};

export { UserTransactionsPage };
